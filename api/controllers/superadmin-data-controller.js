import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const getSingleSurveyDataForUser = async (req, res) => {
    console.log('123');
    try{
        const allUserData = await prisma.user.findMany({
            include:{
                surveys: {
                    select: {
                      id: true,
                      surveyResponses:true,
                      surveyViews:true,
                      surveyTitle:true,
                    }
            }
        }
        });
        console.log(allUserData);
        res.status(200).json(allUserData);
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
};