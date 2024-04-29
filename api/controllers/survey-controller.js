import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const createNewSurvey = async (req, res) => {
    const {surveyTitle} = req.body;
    const userId = req.tokenId;
    console.log(surveyTitle,req.tokenId,'req.body');
try{
    const newSurvey = await prisma.survey.create({
        data:{
            surveyTitle,
            surveyDescription:"Test",
            userId,
        }
    });
    res.status(201).send({message:'Survey created successfully',newSurvey});

}catch(err){
    console.log(err);
    res.status(500).send({message:'Internal server error'});
}
};

export const getUserSurvey = async (req, res) => {
    const userId = req.tokenId;
    try{
        const getSurveyAll = await prisma.survey.findMany({
            where:{
                userId
            }
        });
        res.status(200).send(getSurveyAll);

    }catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}