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
export const getSurveyById = async (req, res) => {
    const surveyId = req.params.surveyId;
    try{
        const getSurvey = await prisma.survey.findUnique({
            where:{
                id:surveyId
            }
        });
        res.status(200).json(getSurvey);
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}

export const updateSurveyById = async (req, res) => {
    const surveyId = req.params.surveyId;
    console.log(req.body,'req.body in update');
    try{
        const updateSurvey = await prisma.survey.update({
            where:{
                id:surveyId
            },
            data:{
                surveyTitle:req.body.surveyTitle,
                surveyForms:req.body.surveyForms,
                selectedItems:req.body.selectedItems
            }
        });
        res.status(200).json({message:'Survey updated successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
};  
