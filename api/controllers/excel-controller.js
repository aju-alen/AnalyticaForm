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
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 70;
    headerRow.eachCell((cell, colNumber) => {
        worksheet.getColumn(colNumber).width = headers[colNumber - 1].length + 5;
        cell.font = { bold: true, size: 12, name: 'Arial', color: { argb: 'FFFFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
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
    const subHeaderRow = worksheet.addRow(subHeaders);
    subHeaderRow.eachCell((cell) => {
        cell.font = { size: 9, name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
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

// Function to create a single row of user data
const createUserRow = (user, subHeaders, headers, questionMap) => {
    const userInfo = [user.userName, user.userEmail, user.id, user.ipAddress];
    const userResponses = new Array(questionMap.length).fill('');

    user.userResponse.forEach(response => {
        response.selectedValue.forEach(selected => {
            if (selected.question && selected.question !== response.question && response.formType !== "MultiScaleCheckBox") {
                const subHeaderIndex = subHeaders.findIndex(header => header.includes(selected.question));
                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.answer;
                }
            } else if (response.formType === "ContactInformationForm") {
                const subHeaderIndex = subHeaders.findIndex(header => header.includes(selected.question));
                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.answer;
                }
            } else if (response.formType === "SingleCheckForm") {
                const subHeaderIndex = subHeaders.findIndex(header => header.includes(selected.rowQuestion));
                if (subHeaderIndex !== -1) {
                    userResponses[subHeaderIndex - 4] = selected.answer;
                }
            } else if (response.formType === "MultiScaleCheckBox") {
                const headerRowIdx = headers.indexOf(response.question + ' ' + selected.question);
                const subHeaderIdx = subHeaders.indexOf(selected.answer, headerRowIdx);
                if (subHeaderIdx !== -1) {
                    userResponses[subHeaderIdx - 4] = selected.answer;
                }
            } else {
                const headerIndex = headers.findIndex(header => header.includes(response.question));
                if (headerIndex !== -1) {
                    userResponses[headerIndex - 4] = selected.answer;
                }
            }
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

// Main function for exporting data to Excel
export const exportToExcel = async (req, res) => {
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
            const row = createUserRow(user, subHeaders, headers, questionMap);
            const userRow = userDataSheet.addRow(row);
            styleUserRow(userRow);
        });

        // Analytics Sheet
        const analyticsSheet = workbook.addWorksheet('Analytics');
        const analyticsData = createAnalyticsData(data);
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
};


export const exportToExcelIndex = async (req, res) => {                             
    try {
        const data = req.body;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('User Data');

        const formQuestions = data[0].formQuestions;

        // Create headers
        const headers = ['Name', 'Email ID'];
        const subHeaders = ['', ''];
        const questionMap = [];

        formQuestions.forEach(formQuestion => {
            Object.entries(formQuestion).forEach(([key, values]) => {
                const validValues = values.filter(value => value !== null);
                const repeatCount = validValues.length > 0 ? validValues.length : 1;
                for (let i = 0; i < repeatCount; i++) {
                    headers.push(key);
                    questionMap.push(key); // Store the mapping of header to question
                }

                // Add the values under the corresponding headers
                values.forEach(value => {
                    subHeaders.push(value || '');
                });
            });
        });

        // Add headers to the worksheet
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell, colNumber) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' } // Yellow color
            };
        });

        // Add sub-headers (form question values) to the worksheet
        const subHeaderRow = worksheet.addRow(subHeaders);

        // Add an empty row for spacing
        worksheet.addRow([]);


        data.forEach(user => {
            const userInfo = [user.userName, user.userEmail];

            // Initialize user responses with empty strings for each header
            const userResponses = new Array(questionMap.length).fill('');

            // Map user responses to the correct headers or sub-headers
            user.userResponse.forEach(response => {
                response.selectedValue.forEach(selected => {
                    if(response.formType === "SinglePointForm"){
                        const headerIndex = headers.indexOf(selected.question);
                        if (headerIndex !== -1) {
                            userResponses[headerIndex - 2] = selected.index; // Offset by 2 for 'Name' and 'Email ID'
                        }
                    }
                    else if(response.formType === "SingleCheckForm"){
                        const subHeaderIndex = subHeaders.indexOf(selected.answer);
                        if (subHeaderIndex !== -1) {
                            userResponses[subHeaderIndex - 2] = 1 // Offset by 2 for 'Name' and 'Email ID'
                        }
                    }
                    else if (response.formType === "MultiScalePoint"){
                        const subHeaderIndex = subHeaders.indexOf(selected.question);
                        if (subHeaderIndex !== -1) {
                            userResponses[subHeaderIndex - 2] = selected.index; // Offset by 2 for 'Name' and 'Email ID'
                        }
                    }
                    else if(response.formType === "MultiScaleCheckBox"){
                        const headerRowIdx = headers.indexOf(response.question + ' ' + selected.question);
                        const subHeaderIdx = subHeaders.indexOf(selected.answer, headerRowIdx);
                        if (subHeaderIdx !== -1) {
                            userResponses[subHeaderIdx - 2] = 1; // Offset by 2 for 'Name' and 'Email ID'
                        }
                    }
                    
                });
            });











            const row = userInfo.concat(userResponses);
            worksheet.addRow(row);
        });


        worksheet.columns.forEach(column => {
            column.width = 30; // Adjust column width
        });

        // Write to buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Send buffer as response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=data_dynamic.xlsx');
        res.send(buffer);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }

}


// // Function to extract form questions
// const extractFormQuestions = (data) => {
//     return data[data.length - 1].formQuestions;
// };

// // Function to create headers and sub-headers dynamically
// const createHeadersAndSubHeaders = (formQuestions) => {
//     const headers = ['Name', 'Email ID', 'Response Id', 'IP Address'];
//     const subHeaders = ['', '', '', ''];
//     const questionMap = [];

//     formQuestions.forEach(formQuestion => {
//         Object.entries(formQuestion).forEach(([key, values]) => {
//             const validValues = values.filter(value => value !== null);
//             const repeatCount = validValues.length > 0 ? validValues.length : 1;

//             for (let i = 0; i < repeatCount; i++) {
//                 headers.push(key);
//                 questionMap.push(key);
//             }

//             values.forEach(value => {
//                 subHeaders.push(value || '');
//             });
//         });
//     });

//     return { headers, subHeaders, questionMap };
// };

// // Function to add headers with styles
// const addHeadersToWorksheet = (worksheet, headers) => {
//     const headerRow = worksheet.addRow(headers);
//     headerRow.eachCell((cell, colNumber) => {
//         cell.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'FFFF00' }, // Yellow background
//         };
//         cell.font = { bold: true, size: 10 };  // Smaller font size, bold
//         cell.alignment = { vertical: 'middle', horizontal: 'center' };  // Centered text
//     });
// };

// // Function to add sub-headers with styles
// const addSubHeadersToWorksheet = (worksheet, subHeaders) => {
//     const subHeaderRow = worksheet.addRow(subHeaders);
//     subHeaderRow.eachCell((cell) => {
//         cell.font = { size: 9 };  // Smaller font size for sub-headers
//         cell.alignment = { vertical: 'middle', horizontal: 'center' };
//     });
// };

// // Function to style each user data row
// const styleUserRow = (userRow) => {
//     userRow.eachCell((cell) => {
//         cell.font = { size: 9 };  // Smaller font size
//         cell.alignment = { vertical: 'middle', horizontal: 'center' };
//         cell.border = {
//             top: { style: 'thin' },
//             left: { style: 'thin' },
//             bottom: { style: 'thin' },
//             right: { style: 'thin' }
//         };
//     });
// };

// // Function to adjust column styles
// const adjustColumnStyles = (worksheet) => {
//     worksheet.columns.forEach(column => {
//         column.width = 25;  // Adjust column width for better readability
//     });
// };

// // Function to adjust row styles
// const adjustRowStyles = (worksheet) => {
//     worksheet.eachRow((row) => {
//         row.height = 18;  // Smaller row height to complement smaller font size
//     });
// };

// // Function to send Excel response
// const sendExcelResponse = (res, buffer) => {
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=data_dynamic.xlsx');
//     res.send(buffer);
// };

// // Function to create a single row of user data including their responses
// const createUserRow = (user, subHeaders, headers, questionMap) => {
//     const userInfo = [user.userName, user.userEmail, user.id, user.ipAddress];
//     const userResponses = new Array(questionMap.length).fill('');

//     user.userResponse.forEach(response => {
//         response.selectedValue.forEach(selected => {
//             if (selected.question && selected.question !== response.question && response.formType !== "MultiScaleCheckBox") {
//                 const subHeaderIndex = subHeaders.findIndex(header => header.includes(selected.question));
//                 if (subHeaderIndex !== -1) {
//                     userResponses[subHeaderIndex - 4] = selected.answer;
//                 }
//             } else if (response.formType === "ContactInformationForm") {
//                 const subHeaderIndex = subHeaders.findIndex(header => header.includes(selected.question));
//                 if (subHeaderIndex !== -1) {
//                     userResponses[subHeaderIndex - 4] = selected.answer;
//                 }
//             } else if (response.formType === "SingleCheckForm") {
//                 const subHeaderIndex = subHeaders.findIndex(header => header.includes(selected.rowQuestion));
//                 if (subHeaderIndex !== -1) {
//                     userResponses[subHeaderIndex - 4] = selected.answer;
//                 }
//             } else if (response.formType === "MultiScaleCheckBox") {
//                 const headerRowIdx = headers.indexOf(response.question + ' ' + selected.question);
//                 const subHeaderIdx = subHeaders.indexOf(selected.answer, headerRowIdx);
//                 if (subHeaderIdx !== -1) {
//                     userResponses[subHeaderIdx - 4] = selected.answer;
//                 }
//             } else {
//                 const headerIndex = headers.findIndex(header => header.includes(response.question));
//                 if (headerIndex !== -1) {
//                     userResponses[headerIndex - 4] = selected.answer;
//                 }
//             }
//         });
//     });

//     return userInfo.concat(userResponses);
// };

// // Main function for exporting data to Excel
// export const exportToExcel = async (req, res) => {
//     try {
//         const data = req.body;
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('User Data');

//         const formQuestions = extractFormQuestions(data);
//         const { headers, subHeaders, questionMap } = createHeadersAndSubHeaders(formQuestions);

//         // Add headers and sub-headers to worksheet with custom styles
//         addHeadersToWorksheet(worksheet, headers);
//         addSubHeadersToWorksheet(worksheet, subHeaders);

//         // Add spacing row
//         worksheet.addRow([]);

//         // Add user data rows
//         data.forEach(user => {
//             const row = createUserRow(user, subHeaders, headers, questionMap);
//             const userRow = worksheet.addRow(row);
//             styleUserRow(userRow);  // Apply styles to each user row
//         });

//         adjustColumnStyles(worksheet);
//         adjustRowStyles(worksheet);

//         // Write to buffer and send as response
//         const buffer = await workbook.xlsx.writeBuffer();
//         sendExcelResponse(res, buffer);

//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Internal server error' });
//     }
// };