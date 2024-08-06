import { PrismaClient } from '@prisma/client'
import { updateUserResponseLimit } from './auth-controllers.js';
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
                ipAddress:userIP.split(',')[0],
                userResponseTime:req.body.userResponseTime


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
        const getResponseCount = await prisma.survey.findUnique({
            where:{
                id:surveyId
            },

            select: {
                surveyResponses: true, // Select the specific field from the Survey model
                surveyTitle: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            
        });
        console.log(getResponseCount,'getResponseCount');
        await prisma.$disconnect();
        if(getResponseCount.surveyResponses === 450 ){
            updateUserResponseLimit( getResponseCount.user.firstName, getResponseCount.user.email, getResponseCount.surveyTitle, 450 );
        }
        if(getResponseCount.surveyResponses === 475 ){
            updateUserResponseLimit( getResponseCount.user.firstName, getResponseCount.user.email, getResponseCount.surveyTitle, 475 );
        }
        res.status(201).send({message:'User response submitted successfully',createUserResponse});

    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }

}
