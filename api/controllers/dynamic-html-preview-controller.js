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
                <title>Dubai Analytica: ${survey.surveyTitle}</title>
                <meta name="robots" content="index, follow" />
                <meta name="description" content="All-in-One Survey Software for Market and Academic Research
                Create, distribute, and analyse surveys—all in one place. Gain deeper insights with data gathered from surveys." />
                
                <!-- Facebook Open Graph Tags -->
                <meta property="og:site_name" content="Dubai Analytica" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="${survey.surveyTitle}" />
                <meta property="og:description" content="All-in-One Survey Software for Market and Academic Research
                Create, distribute, and analyse surveys—all in one place. Gain deeper insights with data gathered from surveys." />
                <meta property="og:image" content="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" />
                <meta property="og:url" content="https://dubaianalytica.com/user-survey/${surveyId}" />
                
                <!-- Twitter Tags -->
                <meta name="twitter:creator" content="Dubai Analytica" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Survey Title" />
                <meta name="twitter:description" content="All-in-One Survey Software for Market and Academic Research
                Create, distribute, and analyse surveys—all in one place. Gain deeper insights with data gathered from surveys." />
                <meta name="twitter:image" content="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" />
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