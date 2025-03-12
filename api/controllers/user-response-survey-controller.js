import { PrismaClient } from '@prisma/client'
import { updateUserResponseLimit } from './auth-controllers.js';
import { generateIpAddressesForCountry } from '../utils/ipGenerator.js';
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
    console.log("-----------------",req.body, '--------req.body in postSingleSurveyDataForUser');

    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const surveyId = req.params.surveyId;
    if(req.body.userName === ''){
        req.body.userName = undefined;
    }
    if(req.body.userEmail === ''){
        req.body.userEmail = undefined;
    }
    console.log(req.body.targetCountry, 'req.body.targetCountry in postSingleSurveyDataForUser');
    
   
    try{
        const getCountryDataFromSurvey = await prisma.survey.findUnique({
            where:{
                id:surveyId
            },
            select:{
                targetCountry:true
            }
        });
        let ipAddress;
        switch(getCountryDataFromSurvey.targetCountry){
            case 'NIL':
                ipAddress = userIP.split(',')[0];
                break;
            default:
                ipAddress = generateIpAddressesForCountry(getCountryDataFromSurvey.targetCountry,1);
        }
        console.log(ipAddress, 'ipAddress in postSingleSurveyDataForUser');

        const createUserResponse = await prisma.userSurveyResponse.create({
            
            data:{
                surveyId,
                userResponse:req.body.userResponse,
                userName:req.body.userName,
                userEmail:req.body.userEmail,
                formQuestions:req.body.formQuestions,
                introduction:req.body.introduction,
                ipAddress:ipAddress,
                userTimeSpent:req.body.userTimeSpent


            }
        });

        const updateSurveyResponseCount = await prisma.survey.update({
            where:{
                id:surveyId
            },
            data:{
                surveyResponses:{
                    increment:1
                },
                surveyCompleted: {
                    increment: 1
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
