import ExcelJS from 'exceljs';

export const exportToExcel = async (req, res) => {
    try {
        const data = req.body;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('User Data');

        // Extract form questions dynamically
        const formQuestions = data[data.length - 1].formQuestions;

        // Create headers
        const headers = ['Name', 'Email ID','Response Id','IP Address'];
        const subHeaders = ['', '','',''];
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
        console.log(headers, 'headers');

        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell, colNumber) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' } // Yellow color
            };
        });

        // Add sub-headers (form question values) to the worksheet
        console.log(subHeaders, 'subHeaders');
        const subHeaderRow = worksheet.addRow(subHeaders);

        // Add an empty row for spacing
        worksheet.addRow([]);

        // Add user data to the worksheet
        // console.log(data, 'data in fiunal dataaaaaa');
        data.forEach(user => {
            const userInfo = [user.userName, user.userEmail,user.id,user.ipAddress];
            // Initialize user responses with empty strings for each header
            const userResponses = new Array(questionMap.length).fill('');

            // Map user responses to the correct headers or sub-headers
            user.userResponse.forEach(response => {
                
                response.selectedValue.forEach(selected => {
                    // console.log(selected, 'selected--api--');
                    
                    if (selected.question && selected.question !== response.question && response.formType !== "MultiScaleCheckBox") {
                        // Find the index in the sub-headers
                        // console.log(selected,'inside !== MultiScaleCheckBox');
                        const subHeaderIndex = subHeaders.findIndex(header =>  header.includes(selected.question));
                        
                        if (subHeaderIndex !== -1) {
                            userResponses[subHeaderIndex - 4] = selected.answer; // Offset by 2 for 'Name' and 'Email ID'
                        }
                    }
                    else if ( response.formType === "ContactInformationForm") {
                        // Find the index in the sub-headers
                        // console.log(selected,'inside !== MultiScaleCheckBox');
                        const subHeaderIndex = subHeaders.findIndex(header =>  header.includes(selected.question));   
                        if (subHeaderIndex !== -1) {
                            userResponses[subHeaderIndex - 4] = selected.answer; // Offset by 2 for 'Name' and 'Email ID'
                        }
                    }
                    else if (response.formType === "SingleCheckForm") {

                        const subHeaderIndex = subHeaders.findIndex(header =>  header.includes(selected.rowQuestion));
                        
                        if (subHeaderIndex !== -1) {
                            userResponses[subHeaderIndex - 4] = selected.answer; // Offset by 2 for 'Name' and 'Email ID'
                        }
                    } else if (response.formType === "MultiScaleCheckBox") {
                        const headerRowIdx = headers.indexOf(response.question + ' ' + selected.question);
                        const subHeaderIdx = subHeaders.indexOf(selected.answer, headerRowIdx);
                        // console.log(subHeaderIdx, 'subHeaderIdx', headerRowIdx, 'headerRowIdx');
                        if (subHeaderIdx !== -1) {
                            userResponses[subHeaderIdx - 4] = selected.answer; // Offset by 2 for 'Name' and 'Email ID'
                        }
                    } else {
                        // console.log('inside else');
                        // Find the index in the headers
                        const headerIndex = headers.findIndex(header =>  header.includes(response.question));
                        // console.log(headerIndex, 'headerIndex');
                        if (headerIndex !== -1) {
                            userResponses[headerIndex - 4] = selected.answer; // Offset by 2 for 'Name' and 'Email ID'
                        }
                    }
                });
            });

            // Create a single row of user data including responses
            const row = userInfo.concat(userResponses);
            worksheet.addRow(row);
        });

        // Apply styles
        worksheet.columns.forEach(column => {
            column.width = 30; // Adjust column width
        });

        // Write to buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Send buffer as response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=data_dynamic.xlsx');
        res.send(buffer);

    } catch (err) {
        console.log(err);
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