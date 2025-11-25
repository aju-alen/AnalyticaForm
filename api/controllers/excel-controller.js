import ExcelJS from 'exceljs';

// Function to extract form questions
const extractFormQuestions = (data) => {
    return data[data.length - 1].formQuestions;
};

// Function to create headers and sub-headers dynamically
const createHeadersAndSubHeaders = (formQuestions) => {
    const headers = ['Name', 'Email ID', 'Response Id', 'IP Address'];
    const subHeaders = ['', '', '', ''];
    const questionMap = [];

    formQuestions.forEach(formQuestion => {
        Object.entries(formQuestion).forEach(([key, values]) => {
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

    const headerIndex = headers.indexOf(response.question);
    const subHeaderIndex = subHeaders.findIndex((header, index) => 
        header.includes(selected.question) && index >= headerIndex
    );
    if (subHeaderIndex !== -1) {
        userResponses[subHeaderIndex - 4] = selected.answer;
    }
};

// Process different form types
const formTypeHandlers = {
    MultiScalePoint: (headers, subHeaders, response, selected, userResponses) => {
        processResponse(headers, subHeaders, response, selected, userResponses);
    },

    SingleCheckForm: (headers, subHeaders, response, selected, userResponses) => {
        const matchingHeaderIndices = headers.reduce((indices, header, index) => {
            if (header === response.question) indices.push(index);
            return indices;
        }, []);

        for (const headerIndex of matchingHeaderIndices) {
            if (subHeaders[headerIndex].includes(selected.rowQuestion)) {
                userResponses[headerIndex - 4] = selected.answer;
                break;
            }
        }
    },

    SinglePointForm: (headers, subHeaders, response, selected, userResponses) => {
        const headerIndex = headers.indexOf(response.question);
        if (headerIndex !== -1) {
            userResponses[headerIndex - 4] = selected.answer;
        }
    },

    CommentBoxForm: (headers, subHeaders, response, selected, userResponses) => {
        console.log('insidedede');
        
        const matchingHeaderIndices = subHeaders.reduce((indices, subHeader, index) => {            

            if (subHeader === response.selectedValue[0].question && headers[index] === 'Comment Box') indices.push(index);
            return indices;
        }, []);
        
        console.log(matchingHeaderIndices,'matchingHeaderIndices in CommentBoxForm');
        

        // Find the correct header-subheader pair
        for (const headerIndex of matchingHeaderIndices) { 
            if (subHeaders[headerIndex].includes(selected.question)) {
                userResponses[headerIndex - 4] = selected.answer;
                break;
            }
        }
    },
    SingleRowTextForm: (headers, subHeaders, response, selected, userResponses) => {
        
        const matchingHeaderIndices = subHeaders.reduce((indices, subHeader, index) => {            

            if (subHeader === response.selectedValue[0].question && headers[index] === 'Single Row Text') indices.push(index);
            return indices;
        }, []);
        
        console.log(matchingHeaderIndices,'matchingHeaderIndices in rowText');
        

        // Find the correct header-subheader pair
        for (const headerIndex of matchingHeaderIndices) { 
            if (subHeaders[headerIndex].includes(selected.question)) {
                userResponses[headerIndex - 4] = selected.answer;
                break;
            }
        }
    },

    MultiScaleCheckBox: (headers, subHeaders, response, selected, userResponses) => {
        const headerRowIdx = headers.indexOf(`${response.question} ${selected.question}`);
        const subHeaderIdx = subHeaders.indexOf(selected.answer, headerRowIdx);
        
        if (subHeaderIdx !== -1) {
            userResponses[subHeaderIdx - 4] = selected.answer;
        }
    },

    SelectDropDownForm: (headers, subHeaders, response, selected, userResponses) => {
        const headerIndex = headers.findIndex(header => header.includes(response.question));
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
        response.selectedValue.forEach(selected => {
            // Special case for non-MultiScaleCheckBox forms with different questions
            // if (selected.question && 
            //     selected.question !== response.question && 
            //     response.formType !== "MultiScaleCheckBox") {
            //         console.log('--------------------------------');
            //         console.log('inside not !MultiScaleCheckBox');
            //         console.log('--------------------------------');
                    
                    
            //     processResponse(headers, subHeaders, response, selected, userResponses);
            //     return;
            // }

            // Get the appropriate handler for the form type or use default
            const handler = formTypeHandlers[response.formType] || formTypeHandlers.default;
            handler(headers, subHeaders, response, selected, userResponses);
        });
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
            response.selectedValue.forEach(selected => {
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

// Helper function to generate Excel buffer (can be used by both export and email)
export const generateExcelBuffer = async (data) => {
    const workbook = new ExcelJS.Workbook();

    // User Data Sheet
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

    // Analytics Sheet
    const analyticsSheet = workbook.addWorksheet('Analytics');
    const analyticsData = createAnalyticsData(data);
    addAnalyticsDataToWorksheet(analyticsSheet, analyticsData);

    // Write to buffer and return
    return await workbook.xlsx.writeBuffer();
};

// Main function for exporting data to Excel
export const exportToExcel = async (req, res) => {
    try {
        const data = req.body;
        const buffer = await generateExcelBuffer(data);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=data_with_analytics.xlsx');
        res.send(buffer);
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
        response.selectedValue.forEach(selected => {
            
            if(response.formType === "MultiScalePoint"){
                const headerIndex = headers.indexOf(response.question);
                const subHeaderIndex = subHeaders.findIndex((header, index) => {
                    return header.includes(selected.question) && index >= headerIndex;
                });

                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.index;
                }
            }
            else if (response.formType === "SingleCheckForm") {
                
                const matchingHeaderIndices = headers.reduce((indices, header, index) => {
                    if (header === response.question) {
                        indices.push(index);
                    }
                    return indices;
                }, []);
                
                for (const headerIndex of matchingHeaderIndices) {
                    
                    if (subHeaders[headerIndex].includes(selected.rowQuestion)) {
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
                const headerIndex = headers.findIndex(header => header.includes(response.question));    
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
            response.selectedValue.forEach(selected => {
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
        const workbook = new ExcelJS.Workbook();

        // User Data Sheet
        const userDataSheet = workbook.addWorksheet('User Data');
        const formQuestions = extractFormQuestions(data);
        const { headers, subHeaders, questionMap } = createHeadersAndSubHeaders(formQuestions);

        addHeadersToWorksheet(userDataSheet, headers);
        addSubHeadersToWorksheet(userDataSheet, subHeaders);
        userDataSheet.addRow([]);

        data.forEach(user => {
            // const row = createUserRowIndexOld(user, subHeaders, headers, questionMap);
            const row = createUserRowIndex(user, subHeaders, headers, questionMap);
            const userRow = userDataSheet.addRow(row);
            styleUserRow(userRow);
        });

        // Analytics Sheet
        const analyticsSheet = workbook.addWorksheet('Analytics');
        const analyticsData = createAnalyticsDataIndex(data);
        addAnalyticsDataToWorksheet(analyticsSheet, analyticsData);

        // Write to buffer and send as response
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=data_with_analytics.xlsx');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }

}