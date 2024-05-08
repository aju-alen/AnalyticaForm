import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { corsOptions } from './utils/corsFe.js';
import authRoute from './routes/auth-route.js';
import surveyRoute from './routes/survey-route.js';
import userResponseSurveyRoute from './routes/user-response-survey.route.js';
import ExcelJS from 'exceljs';
const app = express();

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute)
app.use('/api/survey', surveyRoute)
app.use('/api/user-response-survey', userResponseSurveyRoute)

app.post('/export-to-excel', async (req, res) => {
    const data = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Add headers
    worksheet.addRow(['Question', 'Answer']);

    // Add data rows
    data.userResponse.forEach(item => {
        item.selectedValue.forEach(selected => {
            worksheet.addRow([selected.question,selected.answer]);
        });
    });

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Send buffer as response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
    res.send(buffer);
});



app.use(errorHandler);
const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Backend running at port ${PORT}`);
})