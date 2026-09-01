import ExcelJS from 'exceljs';
import { prisma } from '../utils/prisma.js';
import { requireSurveyAccess, requesterIsSuperAdmin } from '../utils/surveyAccess.js';
import { userHasActiveProSubscription } from '../utils/planLimits.js';
import { loadResponsesForExport, writeWorkbookToResponse } from '../utils/surveyExport.js';
import { buildQuestionAnalytics } from '../utils/questionAnalytics.js';

// Function to extract form questions
const extractFormQuestions = (data) => {
    for (let i = data.length - 1; i >= 0; i -= 1) {
        if (Array.isArray(data[i]?.formQuestions) && data[i].formQuestions.length) {
            return data[i].formQuestions;
        }
    }
    return [];
};

// Function to create headers and sub-headers dynamically
const createHeadersAndSubHeaders = (formQuestions) => {
    const headers = ['Name', 'Email ID', 'Response Id', 'IP Address'];
    const subHeaders = ['', '', '', ''];
    const questionMap = [];

    formQuestions.forEach(formQuestion => {
        if (!formQuestion || typeof formQuestion !== 'object') return;
        Object.entries(formQuestion).forEach(([key, values]) => {
            if (!Array.isArray(values)) return;
            const validValues = values.filter(value => value !== null);
            const repeatCount = validValues.length > 0 ? validValues.length : 1;

            for (let i = 0; i < repeatCount; i++) {
                headers.push(key);
                questionMap.push(key);
            }

            values.forEach(value => {
                subHeaders.push(value || '');
            });
        });
    });
  
    return { headers, subHeaders, questionMap };
};

// Function to add headers to a worksheet with custom styles
const addHeadersToWorksheet = (worksheet, headers) => {
    const headerRow = worksheet.addRow(headers.map(header => 
        header
    ));
    headerRow.height = 35;
    headerRow.eachCell((cell, colNumber) => {
        worksheet.getColumn(colNumber).width = 15; // Fixed width for all columns
        cell.font = { bold: true, size: 11, name: 'Arial', color: { argb: 'FFFFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false }; // Disabled text wrapping
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF008080' } };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });
};

// Function to add sub-headers to a worksheet with custom styles
const addSubHeadersToWorksheet = (worksheet, subHeaders) => {
    const subHeaderRow = worksheet.addRow(subHeaders.map(header => 
        header
    ));
    subHeaderRow.height = 25;
    subHeaderRow.eachCell((cell, colNumber) => {
        worksheet.getColumn(colNumber).width = 15; // Fixed width for all columns
        cell.font = { size: 9, name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false }; // Disabled text wrapping
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0FFFF' } };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });
};

// Function to style each user data row
const styleUserRow = (userRow) => {
    userRow.eachCell((cell) => {
        cell.font = { size: 9, name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE0' } };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });
};

// Helper function to find header index and update responses
const processResponse = (headers, subHeaders, response, selected, userResponses) => {
    const answer = selected.answer ?? selected.value ?? '';
    const selectedLabel = String(selected.question || '').trim();
    let headerIndex = headers.indexOf(response.question);
    if (headerIndex === -1 && response.question) {
        headerIndex = headers.findIndex((header) => typeof header === 'string' && header.includes(response.question));
    }
    if (headerIndex === -1) return;

    if (!selectedLabel) {
        userResponses[headerIndex - 4] = answer;
        return;
    }

    const subHeaderIndex = subHeaders.findIndex((header, index) => {
        if (index < headerIndex) return false;
        const sub = String(header || '');
        return sub === selectedLabel || sub.includes(selectedLabel);
    });
    if (subHeaderIndex !== -1) {
        userResponses[subHeaderIndex - 4] = answer;
        return;
    }
    userResponses[headerIndex - 4] = answer;
};

const fillTypedTextAnswer = (typeHeader, headers, subHeaders, response, selected, userResponses) => {
    const answer = selected.answer ?? selected.value ?? '';
    const selectedLabel = String(selected.question || response.question || '').trim();
    const indices = [];
    headers.forEach((header, index) => {
        if (header === typeHeader) indices.push(index);
    });
    if (!indices.length && response.question) {
        headers.forEach((header, index) => {
            if (header === response.question) indices.push(index);
        });
    }
    if (!indices.length) return;

    for (const i of indices) {
        const sub = String(subHeaders[i] || '');
        if (!sub.trim()) {
            userResponses[i - 4] = answer;
            return;
        }
        if (selectedLabel && (sub === selectedLabel || sub.includes(selectedLabel) || selectedLabel.includes(sub))) {
            userResponses[i - 4] = answer;
            return;
        }
    }
    userResponses[indices[0] - 4] = answer;
};

const CONSENT_HEADER_BY_TYPE = {
    ConsentForm: 'Form Consent',
    QualitativeConsentForm: 'Interview Consent',
    DynamicConsentForm: 'Dynamic Consent (Quantitative)',
    DynamicQualitativeConsentForm: 'Dynamic Consent (Qualitative)',
};

const fillConsentAnswer = (headers, subHeaders, response, selected, userResponses) => {
    const headerName = CONSENT_HEADER_BY_TYPE[response.formType];
    if (!headerName) return;

    if (response.formType === 'ConsentForm') {
        const headerIndex = headers.indexOf(headerName);
        if (headerIndex !== -1) {
            userResponses[headerIndex - 4] = selected.answer || '';
        }
        return;
    }

    const matchingIndices = headers.reduce((acc, h, i) => {
        if (h === headerName) acc.push(i);
        return acc;
    }, []);

    const selectedLabel = selected.question || '';
    for (const i of matchingIndices) {
        if (subHeaders[i] === 'Zoom join URL') continue;
        if (subHeaders[i] === selectedLabel || (selectedLabel && subHeaders[i].includes(selectedLabel))) {
            userResponses[i - 4] = selected.answer || '';
            break;
        }
    }
};

const fillConsentIndex = (headers, subHeaders, response, selected, userResponses) => {
    const headerName = CONSENT_HEADER_BY_TYPE[response.formType];
    if (!headerName) return;

    if (response.formType === 'ConsentForm') {
        const headerIndex = headers.indexOf(headerName);
        if (headerIndex !== -1) {
            userResponses[headerIndex - 4] = selected.index ?? '';
        }
        return;
    }

    const matchingIndices = headers.reduce((acc, h, i) => {
        if (h === headerName) acc.push(i);
        return acc;
    }, []);

    const selectedLabel = selected.question || '';
    for (const i of matchingIndices) {
        if (subHeaders[i] === 'Zoom join URL') continue;
        if (subHeaders[i] === selectedLabel || (selectedLabel && subHeaders[i].includes(selectedLabel))) {
            userResponses[i - 4] = selected.index ?? '';
            break;
        }
    }
};

const fillZoomJoinUrl = (headers, subHeaders, response, userResponses) => {
    if (
        response.formType !== 'QualitativeConsentForm' &&
        response.formType !== 'DynamicQualitativeConsentForm'
    ) {
        return;
    }
    const headerName = CONSENT_HEADER_BY_TYPE[response.formType];
    if (!headerName) return;
    const joinUrl = response?.zoomMeeting?.joinUrl || '';
    for (let i = 0; i < headers.length; i++) {
        if (headers[i] === headerName && subHeaders[i] === 'Zoom join URL') {
            userResponses[i - 4] = joinUrl;
            break;
        }
    }
};

// Process different form types
const formTypeHandlers = {
    MultiScalePoint: (headers, subHeaders, response, selected, userResponses) => {
        processResponse(headers, subHeaders, response, selected, userResponses);
    },

    SingleCheckForm: (headers, subHeaders, response, selected, userResponses) => {
        const isOther = selected.value === '__OTHER__' || selected.id === 'other';
        const subLabel = isOther ? 'Other' : String(selected.rowQuestion || selected.answer || selected.value || '').trim();
        const matchingHeaderIndices = headers.reduce((indices, header, index) => {
            if (header === response.question) indices.push(index);
            return indices;
        }, []);

        for (const headerIndex of matchingHeaderIndices) {
            const sub = String(subHeaders[headerIndex] || '');
            if (sub && (sub === subLabel || (subLabel && sub.includes(subLabel)))) {
                userResponses[headerIndex - 4] = selected.answer;
                return;
            }
        }
        for (const headerIndex of matchingHeaderIndices) {
            const sub = String(subHeaders[headerIndex] || '');
            if (!sub.trim() && !userResponses[headerIndex - 4]) {
                userResponses[headerIndex - 4] = selected.answer;
                return;
            }
        }
    },

    SinglePointForm: (headers, subHeaders, response, selected, userResponses) => {
        const isOther = selected.value === '__OTHER__';
        const subLabel = isOther ? 'Other' : (selected.answer || '');
        const matchingHeaderIndices = headers.reduce((indices, header, index) => {
            if (header === response.question) indices.push(index);
            return indices;
        }, []);
        for (const headerIndex of matchingHeaderIndices) {
            if (subHeaders[headerIndex] === subLabel) {
                userResponses[headerIndex - 4] = selected.answer;
                break;
            }
        }
    },

    ConsentForm: fillConsentAnswer,
    QualitativeConsentForm: fillConsentAnswer,
    DynamicConsentForm: fillConsentAnswer,
    DynamicQualitativeConsentForm: fillConsentAnswer,

    CommentBoxForm: (headers, subHeaders, response, selected, userResponses) => {
        fillTypedTextAnswer('Comment Box', headers, subHeaders, response, selected, userResponses);
    },
    SingleRowTextForm: (headers, subHeaders, response, selected, userResponses) => {
        fillTypedTextAnswer('Single Row Text', headers, subHeaders, response, selected, userResponses);
    },
    EmailAddressForm: (headers, subHeaders, response, selected, userResponses) => {
        fillTypedTextAnswer('Email Address', headers, subHeaders, response, selected, userResponses);
    },

    MultiScaleCheckBox: (headers, subHeaders, response, selected, userResponses) => {
        const headerRowIdx = headers.indexOf(`${response.question} ${selected.question}`);
        const subHeaderIdx = subHeaders.indexOf(selected.answer, headerRowIdx);
        
        if (subHeaderIdx !== -1) {
            userResponses[subHeaderIdx - 4] = selected.answer;
        }
    },

    SelectDropDownForm: (headers, subHeaders, response, selected, userResponses) => {
        const question = String(response.question || '').trim();
        if (!question) return;
        const headerIndex = headers.findIndex((header) => header === question || (typeof header === 'string' && header.includes(question)));
        if (headerIndex !== -1) {
            userResponses[headerIndex - 4] = selected.answer;
        }
    },

    // Default handler for other form types (ContactInformationForm, PresentationTextForm, etc.)
    default: (headers, subHeaders, response, selected, userResponses) => {
        processResponse(headers, subHeaders, response, selected, userResponses);
    }
};

// Function to create a single row of user data
const createUserRow = (user, subHeaders, headers, questionMap) => {
    const userInfo = [user.userName, user.userEmail, user.id, user.ipAddress];
    const userResponses = new Array(questionMap.length).fill('');

    user.userResponse.forEach(response => {
        (response.selectedValue || []).forEach(selected => {
            // Get the appropriate handler for the form type or use default
            const handler = formTypeHandlers[response.formType] || formTypeHandlers.default;
            handler(headers, subHeaders, response, selected, userResponses);
        });
        fillZoomJoinUrl(headers, subHeaders, response, userResponses);
    });

    return userInfo.concat(userResponses);
};

// Function to create analytics data
const createAnalyticsData = (data) => {
    const analytics = {};

    data.forEach(user => {
        user.userResponse.forEach(response => {
            const question = response.question;
            if (!analytics[question]) {
                analytics[question] = {};
            }
            (response.selectedValue || []).forEach(selected => {
                if (!analytics[question][selected.answer]) {
                    analytics[question][selected.answer] = 0;
                }
                analytics[question][selected.answer] += 1;
            });
        });
    });

    return analytics;
};

// Function to add analytics data to a worksheet
const addAnalyticsDataToWorksheet = (worksheet, analytics) => {
    worksheet.addRow(['Question', 'Answer', 'Count']);

    Object.entries(analytics).forEach(([question, answers]) => {
        Object.entries(answers).forEach(([answer, count]) => {
            worksheet.addRow([question, answer, count]);
        });
    });

    worksheet.columns.forEach(column => {
        column.width = 20;
    });
};

const buildAnswersWorkbook = (data) => {
    const workbook = new ExcelJS.Workbook();

    const userDataSheet = workbook.addWorksheet('User Data');
    const formQuestions = extractFormQuestions(data);
    const { headers, subHeaders, questionMap } = createHeadersAndSubHeaders(formQuestions);

    addHeadersToWorksheet(userDataSheet, headers);
    addSubHeadersToWorksheet(userDataSheet, subHeaders);
    userDataSheet.addRow([]);

    data.forEach(user => {
        const row = createUserRow(user, subHeaders, headers, questionMap);
        const userRow = userDataSheet.addRow(row);
        styleUserRow(userRow);
    });

    const analyticsSheet = workbook.addWorksheet('Analytics');
    const analyticsData = createAnalyticsData(data);
    addAnalyticsDataToWorksheet(analyticsSheet, analyticsData);

    return workbook;
};

const buildIndexWorkbook = (data) => {
    const workbook = new ExcelJS.Workbook();

    const userDataSheet = workbook.addWorksheet('User Data');
    const formQuestions = extractFormQuestions(data);
    const { headers, subHeaders, questionMap } = createHeadersAndSubHeaders(formQuestions);

    addHeadersToWorksheet(userDataSheet, headers);
    addSubHeadersToWorksheet(userDataSheet, subHeaders);
    userDataSheet.addRow([]);

    data.forEach(user => {
        const row = createUserRowIndex(user, subHeaders, headers, questionMap);
        const userRow = userDataSheet.addRow(row);
        styleUserRow(userRow);
    });

    const analyticsSheet = workbook.addWorksheet('Analytics');
    const analyticsData = createAnalyticsDataIndex(data);
    addAnalyticsDataToWorksheet(analyticsSheet, analyticsData);

    return workbook;
};

const exportFilename = (data, suffix) => {
    const title = data?.[0]?.survey?.surveyTitle || 'survey';
    return `${String(title).replace(/[\\/"]/g, '')} ${suffix}.xlsx`;
};

const loadExportRows = async (req, res) => {
    const surveyId = req.params.surveyId;
    const access = await requireSurveyAccess(req, res, surveyId, { allowSuperAdmin: true });
    if (!access) return null;
    const isOwnerPro = await userHasActiveProSubscription(prisma, req.tokenId)
        || await requesterIsSuperAdmin(req);
    const data = await loadResponsesForExport(prisma, surveyId, { isOwnerPro });
    if (!data.length) {
        res.status(404).send({ message: 'No responses found for this survey' });
        return null;
    }
    return data;
};

export const generateExcelBuffer = async (data) => {
    const workbook = buildAnswersWorkbook(data);
    return workbook.xlsx.writeBuffer();
};

export const exportToExcel = async (req, res) => {
    try {
        const data = req.body;
        const workbook = buildAnswersWorkbook(data);
        await writeWorkbookToResponse(res, workbook, 'data_with_analytics.xlsx');
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const exportSurveyToExcel = async (req, res) => {
    try {
        const data = await loadExportRows(req, res);
        if (!data) return;
        await writeWorkbookToResponse(res, buildAnswersWorkbook(data), exportFilename(data, 'Answers'));
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const exportSurveyToExcelIndex = async (req, res) => {
    try {
        const data = await loadExportRows(req, res);
        if (!data) return;
        await writeWorkbookToResponse(res, buildIndexWorkbook(data), exportFilename(data, 'Index'));
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const exportQuestionSummary = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const access = await requireSurveyAccess(req, res, surveyId, { allowSuperAdmin: true });
        if (!access) return;

        const isPro = await userHasActiveProSubscription(prisma, req.tokenId)
            || await requesterIsSuperAdmin(req);
        if (!isPro) {
            return res.status(403).send({ message: 'Question summary Excel export is available on the Premium plan.' });
        }

        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            select: { surveyTitle: true, surveyForms: true },
        });
        if (!survey) {
            return res.status(404).send({ message: 'Survey not found' });
        }

        const responses = await prisma.userSurveyResponse.findMany({
            where: { surveyId },
            select: { userResponse: true },
        });
        const questions = buildQuestionAnalytics(survey.surveyForms, responses);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Question summary');
        const header = sheet.addRow(['Question', 'Option', 'Count', 'Percent']);
        header.font = { bold: true };
        questions.forEach((question) => {
            if (!question.options.length) {
                sheet.addRow([question.question, '', question.answered, '']);
                return;
            }
            question.options.forEach((option) => {
                sheet.addRow([question.question, option.label, option.count, option.percent]);
            });
        });
        sheet.columns = [
            { width: 50 },
            { width: 30 },
            { width: 12 },
            { width: 12 },
        ];
        const title = String(survey.surveyTitle || 'survey').replace(/[\\/"]/g, '');
        await writeWorkbookToResponse(res, workbook, `${title} Question summary.xlsx`);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

const createUserRowIndexOld = (user, subHeaders, headers, questionMap) => {
    const userInfo = [user.userName, user.userEmail, user.id, user.ipAddress];
    const userResponses = new Array(questionMap.length).fill('');

    user.userResponse.forEach(response => {
        
        
        response.selectedValue.forEach(selected => {
           
            if (selected.question && selected.question !== response.question && response.formType !== "MultiScaleCheckBox") {
                const subHeaderIndex = subHeaders.findIndex(header => header.includes(selected.question));
        
                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.index;
                }
            } 
            if(response.formType === "CommentBoxForm"){
                const subHeaderIndex = subHeaders.findIndex(header => header.includes(selected.question));

                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.answer;

                    
                }
            }
            else if (response.formType === "ContactInformationForm") {
                const subHeaderIndex = subHeaders.findIndex(header => header.includes(selected.question));
                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.index;
                }
            } else if (response.formType === "SingleCheckForm") {
                const subHeaderIndex = subHeaders.findIndex(header => header.includes(selected.rowQuestion));
                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.index;
                }
            } else if (response.formType === "MultiScaleCheckBox") {
                const headerRowIdx = headers.indexOf(response.question + ' ' + selected.question);
                const subHeaderIdx = subHeaders.indexOf(selected.answer, headerRowIdx);
                if (subHeaderIdx !== -1) {
                    userResponses[subHeaderIdx - 4] = selected.index;
                }
            } else {
                const headerIndex = headers.findIndex(header => header.includes(response.question));    
                
                
                if (headerIndex !== -1) {
                    userResponses[headerIndex - 4] = selected.index;
                }
                if(response.formType === "SelectDropDownForm" && headerIndex !== -1){
                    console.log('--------------------------------');
                    
                    console.log(response,'response in select drop down');
                    console.log('--------------------------------');
                    console.log(user.survey['surveyForms'],'selected in select drop down');
                    const single = user.survey['surveyForms'].filter(item => item.formType === 'SelectDropDownForm')
                    const final = single[0].options
                    console.log('--------------------------------');
                    console.log(final,'final in select drop down');
                    console.log('--------------------------------');
                    const initialIndex= final.findIndex((item,index) => (
                        item.value === selected.answer

                    ))
                    console.log('--------------------------------');
                    console.log(initialIndex +1,'initialIndex in select drop down');

                    

                    
                    userResponses[headerIndex - 4] = initialIndex +1;
                }
            }
        });
    });

    return userInfo.concat(userResponses);
};

const createUserRowIndex = (user, subHeaders, headers, questionMap) => {
    const userInfo = [user.userName, user.userEmail, user.id, user.ipAddress];
    const userResponses = new Array(questionMap.length).fill('');

    user.userResponse.forEach(response => {
        (response.selectedValue || []).forEach(selected => {
            
            if (CONSENT_HEADER_BY_TYPE[response.formType]) {
                fillConsentIndex(headers, subHeaders, response, selected, userResponses);
            }
            else if(response.formType === "MultiScalePoint"){
                const headerIndex = headers.indexOf(response.question);
                const subHeaderIndex = subHeaders.findIndex((header, index) => {
                    return header.includes(selected.question) && index >= headerIndex;
                });

                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.index;
                }
            }
            else if (response.formType === "SingleCheckForm") {
                const rowLabel = String(selected.rowQuestion || selected.answer || selected.value || '').trim();
                const matchingHeaderIndices = headers.reduce((indices, header, index) => {
                    if (header === response.question) {
                        indices.push(index);
                    }
                    return indices;
                }, []);

                for (const headerIndex of matchingHeaderIndices) {
                    const sub = String(subHeaders[headerIndex] || '');
                    if (sub && rowLabel && (sub === rowLabel || sub.includes(rowLabel))) {
                        userResponses[headerIndex - 4] = selected.index;
                        break;
                    }
                }
                if (matchingHeaderIndices.some((headerIndex) => userResponses[headerIndex - 4] !== '')) {
                    return;
                }
                for (const headerIndex of matchingHeaderIndices) {
                    const sub = String(subHeaders[headerIndex] || '');
                    if (!sub.trim() && !userResponses[headerIndex - 4]) {
                        userResponses[headerIndex - 4] = selected.index;
                        break;
                    }
                }
            }
            else if (selected.question && selected.question !== response.question && response.formType !== "MultiScaleCheckBox") {
                const headerIndex = headers.indexOf(response.question);
                const subHeaderIndex = subHeaders.findIndex((header, index) => {
                    return header.includes(selected.question) && index >= headerIndex;
                });
                
                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.index;
                }
            }
            else if (response.formType === "ContactInformationForm") {
                const headerIndex = headers.indexOf(response.question);
                const subHeaderIndex = subHeaders.findIndex((header, index) => {
                    return header.includes(selected.question) && index >= headerIndex;
                });
                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.index;
                }
                console.log(userResponses,'userResponses in contact information');
                
            }
            else if (response.formType === "MultiScaleCheckBox") {
                console.log('-------------------------------- inside multi scale check box');
                const headerRowIdx = headers.indexOf(response.question + ' ' + selected.question);
                const subHeaderIdx = subHeaders.indexOf(selected.answer, headerRowIdx);
                if (subHeaderIdx !== -1) {
                    userResponses[subHeaderIdx - 4] = selected.index;
                }
            }
            else if(response.formType === "SelectDropDownForm"){
                const question = String(response.question || '').trim();
                if (!question) return;
                const headerIndex = headers.findIndex((header) => header === question || (typeof header === 'string' && header.includes(question)));
                if (headerIndex !== -1) {
                    userResponses[headerIndex - 4] = selected.index;
                }
            }
            else if (response.formType === "PresentationTextForm"){
                const headerIndex = headers.indexOf(response.question);
                const subHeaderIndex = subHeaders.findIndex((header, index) => {
                    return header.includes(selected.question) && index >= headerIndex;
                });
                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.index;
                }
                
            }
            else {
                const headerIndex = headers.findIndex(header => header.includes(response.question));    
                if (headerIndex !== -1) {
                    userResponses[headerIndex - 4] = selected.index;
                }
            }
        });
        fillZoomJoinUrl(headers, subHeaders, response, userResponses);
    });

    return userInfo.concat(userResponses);
};

// Modified function to create analytics data using selected.index
const createAnalyticsDataIndex = (data) => {
    const analytics = {};

    data.forEach(user => {
        user.userResponse.forEach(response => {
            const question = response.question;
            if (!analytics[question]) {
                analytics[question] = {};
            }
            (response.selectedValue || []).forEach(selected => {
                const index = selected.index;
                if (!analytics[question][index]) {
                    analytics[question][index] = 0;
                }
                analytics[question][index] += 1;
            });
        });
    });

    return analytics;
};


export const exportToExcelIndex = async (req, res) => {
    try {
        const data = req.body;
        await writeWorkbookToResponse(res, buildIndexWorkbook(data), 'data_with_analytics.xlsx');
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};