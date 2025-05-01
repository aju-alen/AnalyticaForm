import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamicMetaHtml = async (req, res) => {
    try{
        const { surveyId } = req.params;
        const survey = await prisma.survey.findUnique({
            where: {
                id: surveyId
            }
        })

        if(!survey){
            return res.status(404).json({
                message: 'Survey not found'
            })
        }
        console.log(survey,'survey in dynamic meta html');
        
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Dubai Analytica: ${survey.surveyTitle}</title>
                <meta name="robots" content="index, follow" />
                <meta name="description" content="${survey.description || 'Take part in this survey by Dubai Analytica - Your trusted platform for Market and Academic Research'}" />
                
                <!-- Facebook Open Graph Tags -->
                <meta property="og:site_name" content="Dubai Analytica" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="${survey.surveyTitle} | Dubai Analytica" />
                <meta property="og:description" content="${survey.description || 'Take part in this survey by Dubai Analytica - Your trusted platform for Market and Academic Research'}" />
                <meta property="og:image" content="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/DA-whatsapp-preview.png" />
                <meta property="og:url" content="https://app.dubaianalytica.com/user-survey/${surveyId}" />
                
                <!-- Twitter Tags -->
                <meta name="twitter:creator" content="Dubai Analytica" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="${survey.surveyTitle} | Dubai Analytica" />
                <meta name="twitter:description" content="${survey.description || 'Take part in this survey by Dubai Analytica - Your trusted platform for Market and Academic Research'}" />
                <meta name="twitter:image" content="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/DA-whatsapp-preview.png" />
                <meta http-equiv="refresh" content="0;url=https://app.dubaianalytica.com/user-survey/${surveyId}" />
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                        background: #f5f5f5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div>
                    <h1>${survey.surveyTitle}</h1>
                    <p>Redirecting to survey...</p>
                </div>
            </body>
            </html>
        `);

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}