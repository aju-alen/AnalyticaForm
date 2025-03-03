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
                <meta property="og:title" content="${survey.surveyTitle}" />
                <meta property="og:image" content="${survey.image || 'https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png'}" />
                <meta property="og:url" content="https://dubaianalytica.com/user-survey/${surveyId}" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta http-equiv="refresh" content="0;url=https://dubaianalytica.com/user-survey/${surveyId}" />
            </head>
            <body></body>
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