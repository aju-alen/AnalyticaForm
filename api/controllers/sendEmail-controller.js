import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import { resendEmailBoiler } from '../utils/resendEmailTemplate.js';
dotenv.config();

const prisma = new PrismaClient();

export const contactUs = async (req, res) => {
    console.log(req.body, 'req.body');
    const {username, email, message,contact} = req.body;
    try{    

        await contacUsEmail(username, email, message,contact);
        res.status(200).json({message: 'Email sent successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
};


const contacUsEmail = async (username, email, message,contact) => {
    try{
        await resendEmailBoiler(
            process.env.GMAIL_AUTH_USER_SUPPORT,
            process.env.GMAIL_AUTH_USER_SUPPORT,
            'You have got a new query on Dubai Analytica',
            `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Dubai Analytica</p>

        </div>
        <div>
            <p>Hello Admin,</p>
            <p>You have received a new query on Dubai Analytica</p>
            <br>
            <p>Username : ${username}</p>
            <p>Sent From : ${email}</p>
            <p>Message : ${message}</p>
            <p>Contact : ${contact}</p>
            <br>
        </div>
    </body>
    </html>`
        );
    }
    catch (err) {
        console.log("Err sending verification email", err);
    }
}

export const reportAbuse = async (req, res) => {
    console.log(req.body, 'req.body');
    const {email,comment} = req.body;
    const {surveyId} = req.params;
    
    try{    
      const getSurveyDetail = await prisma.survey.findUnique({
        where: {
            id: surveyId
            },
            select:{
                surveyTitle:true,
                user:{
                    select:{
                        email:true
                    }
                }
            }
      })
      console.log(getSurveyDetail, 'getSurveyDetail');
      

        reportAbuseEmailToAdmin(email,comment,getSurveyDetail.surveyTitle,getSurveyDetail.user.email);
        reportAbuseEmailConfirmation(email,comment,getSurveyDetail.surveyTitle,getSurveyDetail.user.email);
        // reportAbuseEmail(username, email, message,contact);
        res.status(200).json({message: 'Email sent successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
};

const reportAbuseEmailToAdmin = async (email,comment,surveyTitle,surveyOwner) => {
    const mailList = [`${process.env.GMAIL_AUTH_USER}`,`${process.env.GMAIL_AUTH_USER_SUPPORT}`].filter(Boolean);
    const html = `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Dubai Analytica</p>

        </div>
        <div>
            <p>Hello</p>
            <p>You have received a new Report abuse </p>
            <br>
            <p>Reported By :${email===''?'Anonymous':email}</p>
            <p>Message : ${comment}</p>
            <p>Survey Title : ${surveyTitle}</p>
            <p>Survey Owner : ${surveyOwner}</p>
            <br>
        </div>
    </body>
    </html>`;
    try{
        await Promise.all(mailList.map((adminEmail) => resendEmailBoiler(
            process.env.GMAIL_AUTH_USER_SUPPORT,
            adminEmail,
            'Report Abuse Email',
            html
        )));
    }
    catch(err){
        console.log(err);
    }
}

const reportAbuseEmailConfirmation = async (email,comment,surveyTitle,surveyOwner) => {
    const html = `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="email verification" style="display:block;margin:auto;width:50%;" />

        </div>
        <div>
            <p>Dear Participant,</p>
            <p>We have received your abuse report</p>
            <p>One of our representatives will get back to you shortly.</p>
            <p>Thank you for contributing to the responsible use of our platform and the safety of our community.</p>
            <br>
            <p>The Team at <a href="https://dubaianalytica.com/">Dubai Analytica</a></p>
        </div>
    </body>
    </html>`;
    try{
        await resendEmailBoiler(
            process.env.GMAIL_AUTH_USER_SUPPORT,
            email,
            'Report Abuse Email Submitted',
            html
        );
    }
    catch(err){
        console.log(err);
    }
}

export const reportNfswImage = async (req, res) => {
    console.log(req.body, 'req.body');
    const {awsId,filesUrl,email,id,firstName} = req.body;
    try{
        reportNSFWEmail(awsId,filesUrl,email,id,firstName);
        res.status(200).json({message: 'Email sent successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}

const reportNSFWEmail = async (awsId,filesUrl,email,id,firstName) => {
    const html = `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Dubai Analytica</p>

        </div>
        <div>
            <p>Hello</p>
            <p>An admin has uploaded an image that needs to be reviewed</p>
            <br>
            <p>Uploaded By : ${email}</p>
            <p>First Name : ${firstName}</p>
            <p>UserId : ${id}</p>
            <p>Image Id in aws : ${awsId}</p>
            <p>Image Url : ${filesUrl}</p>
            <br>
            <p>Click on the link below to view the image</p>
            <p>Check the image and take necessary action</p>
        </div>
    </body>
    </html>`;
    try{
        await resendEmailBoiler(
            process.env.GMAIL_AUTH_USER_SUPPORT,
            process.env.GMAIL_AUTH_USER_SUPPORT,
            'Report NSFW Image for Image Form',
            html
        );
    }
    catch(err){
        console.log(err);
    }
}

export const sendSurveyExcelViaEmail = async (req, res) => {
    try {
        const { surveyId, recipientEmail, note, isSubscribed } = req.body;
        
        if (!surveyId || !recipientEmail) {
            return res.status(400).json({ message: 'Survey ID and recipient email are required' });
        }

        // Fetch all responses for the survey
        const getAllResponse = await prisma.userSurveyResponse.findMany({
            where: {
                surveyId
            },
            include: {
                survey: {
                    select: {
                        surveyTitle: true,
                        surveyForms: true,
                    }
                }
            },
            ...(!isSubscribed ? { take: 500 } : {}),
        });

        if (!getAllResponse || getAllResponse.length === 0) {
            return res.status(404).json({ message: 'No responses found for this survey' });
        }

        // Generate Excel buffer using the shared helper function
        const { generateExcelBuffer } = await import('./excel-controller.js');
        const excelBuffer = await generateExcelBuffer(getAllResponse);

        const surveyTitle = String(getAllResponse[0]?.survey?.surveyTitle || 'Survey');
        const fileName = `${surveyTitle.replace(/[^a-z0-9]/gi, '_')}_Responses.xlsx`;

        // Calculate statistics
        const totalResponses = getAllResponse.length;
        
        // Calculate unique participants
        const uniqueParticipants = new Set(
            getAllResponse.map(
                (item) => `${item.userEmail || 'Anonymous'}-${item.userName || 'Anonymous'}`
            )
        ).size;

        // Calculate average time spent
        const parseTimeStringToSeconds = (value = '') => {
            if (!value) return 0;
            const minuteMatch = String(value).match(/(\d+)\s*m/);
            const secondMatch = String(value).match(/(\d+)\s*s/);
            const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
            const seconds = secondMatch ? Number(secondMatch[1]) : 0;
            return minutes * 60 + seconds;
        };

        const formatSecondsToLabel = (seconds) => {
            if (!seconds || Number.isNaN(seconds)) return '0m 0s';
            const mins = Math.floor(seconds / 60);
            const secs = Math.round(seconds % 60);
            return `${mins}m ${secs}s`;
        };

        const totalSeconds = getAllResponse.reduce((sum, item) => {
            return sum + parseTimeStringToSeconds(item.userTimeSpent);
        }, 0);
        const avgTimeSpent = totalResponses > 0 ? formatSecondsToLabel(totalSeconds / totalResponses) : '0m 0s';

        // Calculate recent submissions (last 24 hours)
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const recentSubmissions = getAllResponse.filter(
            (item) => new Date(item.createdAt) >= last24Hours
        ).length;

        // Calculate first and last response dates
        const sortedByDate = [...getAllResponse].sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
        );
        const firstResponseDate = sortedByDate.length > 0 
            ? new Date(sortedByDate[0].createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : 'N/A';
        const lastResponseDate = sortedByDate.length > 0
            ? new Date(sortedByDate[sortedByDate.length - 1].createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : 'N/A';

        // Calculate anonymous vs identified
        const identifiedResponses = getAllResponse.filter(
            (item) => item.userEmail && item.userEmail !== 'Anonymous'
        ).length;
        const anonymousResponses = totalResponses - identifiedResponses;

        // Create email HTML - ensure note is properly escaped
        const escapedNote = note ? String(note).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>') : '';
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px;">
                                <!-- Header -->
                                <tr>
                                    <td align="center" style="padding: 40px 30px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                                        <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="Dubai Analytica" style="display:block;margin:0 auto;width:180px;height:auto;" />
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 30px;">
                                        <h1 style="margin: 0 0 20px 0; color: #1a202c; font-size: 28px; font-weight: 700;">
                                            Survey Response Report
                                        </h1>
                                        
                                        <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                            Hello,
                                        </p>
                                        
                                        <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                            Please find attached the Excel file containing all responses for the survey: <strong style="color: #2d3748;">${String(surveyTitle)}</strong>
                                        </p>

                                        ${escapedNote ? `
                                        <div style="background-color: #edf2f7; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                            <p style="margin: 0 0 8px 0; color: #2d3748; font-weight: 600; font-size: 14px;">Note from sender:</p>
                                            <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">${escapedNote}</p>
                                        </div>
                                        ` : ''}

                                        <!-- Statistics Section -->
                                        <div style="background-color: #f7fafc; border-radius: 8px; padding: 25px; margin: 25px 0;">
                                            <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                                                📊 Survey Statistics
                                            </h2>
                                            
                                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 15px;">
                                                <tr>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                                        <span style="color: #718096; font-size: 14px; font-weight: 500;">Total Responses</span>
                                                    </td>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                                        <span style="color: #2d3748; font-size: 16px; font-weight: 700;">${String(totalResponses)}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                                        <span style="color: #718096; font-size: 14px; font-weight: 500;">Unique Participants</span>
                                                    </td>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                                        <span style="color: #2d3748; font-size: 16px; font-weight: 700;">${String(uniqueParticipants)}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                                        <span style="color: #718096; font-size: 14px; font-weight: 500;">Average Time Spent</span>
                                                    </td>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                                        <span style="color: #2d3748; font-size: 16px; font-weight: 700;">${String(avgTimeSpent)}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                                        <span style="color: #718096; font-size: 14px; font-weight: 500;">Recent Submissions (24h)</span>
                                                    </td>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                                        <span style="color: #2d3748; font-size: 16px; font-weight: 700;">${String(recentSubmissions)}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                                        <span style="color: #718096; font-size: 14px; font-weight: 500;">Identified Responses</span>
                                                    </td>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                                        <span style="color: #2d3748; font-size: 16px; font-weight: 700;">${String(identifiedResponses)}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                                        <span style="color: #718096; font-size: 14px; font-weight: 500;">Anonymous Responses</span>
                                                    </td>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                                        <span style="color: #2d3748; font-size: 16px; font-weight: 700;">${String(anonymousResponses)}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                                        <span style="color: #718096; font-size: 14px; font-weight: 500;">First Response</span>
                                                    </td>
                                                    <td width="50%" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                                        <span style="color: #2d3748; font-size: 14px; font-weight: 500;">${String(firstResponseDate)}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="50%" style="padding: 12px 0;">
                                                        <span style="color: #718096; font-size: 14px; font-weight: 500;">Last Response</span>
                                                    </td>
                                                    <td width="50%" style="padding: 12px 0; text-align: right;">
                                                        <span style="color: #2d3748; font-size: 14px; font-weight: 500;">${String(lastResponseDate)}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>

                                        <!-- File Info -->
                                        <div style="background-color: #edf2f7; border-radius: 6px; padding: 15px; margin: 20px 0;">
                                            <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                                                <strong style="color: #2d3748;">📎 Attachment:</strong> ${String(fileName)}
                                            </p>
                                            <p style="margin: 8px 0 0 0; color: #718096; font-size: 13px;">
                                                The Excel file contains detailed response data including user information, answers, and analytics.
                                            </p>
                                        </div>

                                        <!-- Footer -->
                                        <p style="margin: 30px 0 0 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                            Best regards,<br>
                                            <strong style="color: #2d3748;">Dubai Analytica Team</strong>
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Footer Bar -->
                                <tr>
                                    <td style="background-color: #edf2f7; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px;">
                                        <p style="margin: 0; color: #718096; font-size: 12px;">
                                            This is an automated email from Dubai Analytica. Please do not reply to this email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        // Convert buffer to base64 for Resend attachment
        // Ensure excelBuffer is a Buffer before converting
        let base64Buffer;
        if (Buffer.isBuffer(excelBuffer)) {
            base64Buffer = excelBuffer.toString('base64');
        } else if (excelBuffer instanceof Uint8Array) {
            base64Buffer = Buffer.from(excelBuffer).toString('base64');
        } else {
            // If it's already a string or something else, try to convert it
            base64Buffer = Buffer.from(excelBuffer).toString('base64');
        }

        // Send email with attachment
        await resendEmailBoiler(
            String(process.env.GMAIL_AUTH_USER_SUPPORT || ''),
            String(recipientEmail),
            `Survey responses – ${surveyTitle}`,
            emailHtml,
            [{
                filename: String(fileName),
                content: String(base64Buffer),
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }]
        );

        await prisma.$disconnect();
        res.status(200).json({ message: 'Email sent successfully with Excel attachment' });
    } catch (err) {
        console.error('Error sending survey Excel via email:', err);
        await prisma.$disconnect();
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};