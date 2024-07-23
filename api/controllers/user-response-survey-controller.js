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

export const postSingleSurveyDataForUser = async (req, res) => {
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(userIP, 'userIP ip address');
    console.log(typeof(userIP), 'typeOF userIP ip address');
    console.log(req.body.formQuestions);
    const surveyId = req.params.surveyId;
    if(req.body.userName === ''){
        req.body.userName = undefined;
    }
    if(req.body.userEmail === ''){
        req.body.userEmail = undefined;
    }
    try{
        const createUserResponse = await prisma.userSurveyResponse.create({
            
            data:{
                surveyId,
                userResponse:req.body.userResponse,
                userName:req.body.userName,
                userEmail:req.body.userEmail,
                formQuestions:req.body.formQuestions,
                introduction:req.body.introduction,
                ipAddress:userIP.split(',')[0]

            }
        });

        const updateSurveyResponseCount = await prisma.survey.update({
            where:{
                id:surveyId
            },
            data:{
                surveyResponses:{
                    increment:1
                }
            }
        });
        await prisma.$disconnect();
        res.status(201).send({message:'User response submitted successfully',createUserResponse});

    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }

}
