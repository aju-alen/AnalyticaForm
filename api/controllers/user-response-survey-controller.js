import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const getSingleSurveyDataForUser = async (req, res) => {
    const surveyId = req.params.surveyId;
    try{
        const getSurveyData = await prisma.survey.findUnique({
            where:{
                id:surveyId
            }});
        res.status(200).json(getSurveyData);
    }catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}
