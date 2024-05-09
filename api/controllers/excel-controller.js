import ExcelJS from 'exceljs';


export const exportToExcel = async (req, res) => {
    try{
        const data = req.body;

    const workbook = new ExcelJS.Workbook();

    // Iterate through each user
    data.forEach((user, index) => {
        const worksheet = workbook.addWorksheet(`User_${index + 1}`);

        // Add main headers for user information
        worksheet.addRow(['Name', 'Email Id', 'User Response Date']);
        worksheet.addRow([user.userName, user.userEmail, user.createdAt]);

        // Add spacing row
        worksheet.addRow([]);

        // Add headers for user responses
        worksheet.addRow(['Main Heading', 'Question', 'Response']);

            // Add data rows for user responses
            user.userResponse.forEach(response => {
                response.selectedValue.forEach(selected => {
                    worksheet.addRow([response.question, selected.question, selected.answer]);
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