import ExcelJS from 'exceljs';


export const exportToExcel = async (req, res) => {
    try{
        const data = req.body;

    const workbook = new ExcelJS.Workbook();

    // Iterate through each user
    data.forEach((user, index) => {
        const worksheet = workbook.addWorksheet(`User_${index + 1}`);

        // Add main headers for user information
        const headerRow = worksheet.addRow(['Name', 'Email Id', 'User Response Date']);
        headerRow.eachCell((cell, colNumber) => {
            // Apply color to each cell in the header row
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' } // Yellow color
            };
        });
        worksheet.addRow([user.userName, user.userEmail, user.createdAt]);

        // Add spacing row
        worksheet.addRow([]);

        // Add headers for user responses
        const surveyHeader = worksheet.addRow(['Main Heading', 'Question', 'Response']);
        surveyHeader.eachCell((cell, colNumber) => {
            // Apply color to each cell in the header row
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' } // Yellow color
            };
        });

            // Add data rows for user responses
            user.userResponse.forEach(response => {
                response.selectedValue.forEach(selected => {
                    if(selected.question === response.question){
                        worksheet.addRow(['', selected.question, selected.answer]);    
                    }
                    else{
                        worksheet.addRow([response.question, selected.question, selected.answer]);

                    }
                });
            });

        // Apply styles
        worksheet.columns.forEach(column => {
            column.width = 60; // Adjust column width
        });

        // Apply color to main question column (A)
        // const mainQuestionColumn = worksheet.getColumn('A');
        // mainQuestionColumn.fill = {
        //     type: 'pattern',
        //     pattern: 'solid',
        //     fgColor: { argb: 'FFFF00' } // Yellow color
        // };
    });

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Send buffer as response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=data_dynamic.xlsx');
    res.send(buffer);

    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}