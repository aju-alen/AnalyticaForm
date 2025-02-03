import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const createNewSurvey = async (req, res) => {
    const { surveyTitle } = req.body;
    const userId = req.tokenId;
    console.log(surveyTitle, req.tokenId, 'req.body');
    try {
        const newSurvey = await prisma.survey.create({
            data: {
                surveyTitle,
                surveyDescription: "Test",
                userId,
                surveyStatus: 'Active',
            }
        });
        await prisma.$disconnect();
        res.status(201).send({ message: 'Survey created successfully', newSurvey });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getUserSurvey = async (req, res) => {
    const userId = req.tokenId;
    try {
        const getSurveyAll = await prisma.survey.findMany({
            where: {
                userId
            }
        });
        await prisma.$disconnect();
        res.status(200).send(getSurveyAll);

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}
export const getSurveyById = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const getSurvey = await prisma.survey.findUnique({
            where: {
                id: surveyId
            }
        });
        await prisma.$disconnect();
        res.status(200).json(getSurvey);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}

export const updateSurveyById = async (req, res) => {
    const surveyId = req.params.surveyId;
    console.log(req.body, 'req.body in update');
    try {
        const updateSurvey = await prisma.survey.update({
            where: {
                id: surveyId
            },
            data: {
                surveyTitle: req.body.surveyTitle,
                surveyForms: req.body.surveyForms,
                selectedItems: req.body.selectedItems,
                surveyIntroduction: req.body.surveyIntroduction,
            }
        });
        await prisma.$disconnect();
        console.log(updateSurvey, 'updateSurvey');
        res.status(200).json({ message: 'Survey updated successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getAllSurveyResponse = async (req, res) => {

    const {surveyId,isSubscribed} = req.params;
    
    try {

        const getAllResponse = await prisma.userSurveyResponse.findMany({
            where: {
                surveyId
            },
            ...(!isSubscribed ? { take: 500 } : {}),
        });
        await prisma.$disconnect();
        res.status(200).send(getAllResponse);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}

export const getAllSurveyOfOneUser = async (req, res) => {
    try{
        const userId = req.params.userId;
        const getAllSurvey = await prisma.survey.findMany({
            where: {
                userId
            },
            select:{
                surveyTitle:true,
                surveyStatus:true,
                surveyIntroduction:true,
                createdAt:true,
                updatedAt:true,
                surveyResponses:true,
                id:true,
                userId:true,
                surveyViews:true,
                surveyCompleted:true,
            }
        });
        await prisma.$disconnect();
        res.status(200).send(getAllSurvey);

    }
    catch (err){
        console.log(err);
        res.status(500).send({ message: 'Could not get all surveys of one user' });
    }
}

export const updateUserView = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const updateView = await prisma.survey.update({
            where: {
                id: surveyId
            },
            data: {
                surveyViews: {
                    increment: 1
                }
            }
        });
        await prisma.$disconnect();
        res.status(200).send({ message: 'Survey view updated successfully' });

    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}



export const deleteUserSurvey = async (req, res) => {
    const surveyId = req.params.surveyId;
    console.log(surveyId, 'surveyId');
    console.log(req.tokenId,'req.tokenId');
    try{
        const confirmUserIsOwner = await prisma.survey.findUnique({
            where:{
                id:surveyId
            },
            select:{
                userId:true
            }
        });
        if(confirmUserIsOwner.userId !== req.tokenId){
            return res.status(403).send({message:'Unauthorized'});
        }
        const deleteUserResponse = await prisma.userSurveyResponse.deleteMany({
            where:{
                surveyId:surveyId
            }
        });
        const deleteUserSurvey = await prisma.survey.delete({
            where:{
                id:surveyId
            }
        });
        await prisma.$disconnect();
        res.status(200).send({message:'Survey deleted successfully'});

    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}

export const updateUserStatus = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const updateStatus = await prisma.survey.update({
            where: {
                id: surveyId
            },
            data: {
                surveyStatus: req.body.surveyStatus
            }
        });
        await prisma.$disconnect();
        res.status(200).send({ message: 'Survey status updated successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}

export const getIpOfSingleSurvey = async (req, res) => {
    const {surveyId} = req.params;
    try{
        const getIpOfOneSurvey = await prisma.userSurveyResponse.findMany({
            where:{
                surveyId,
            },
            select:{
                ipAddress:true
            }
        }); 
        await prisma.$disconnect();
        const formatedData = getIpOfOneSurvey.map((data)=>data.ipAddress);
console.log(formatedData,'formatedData');
const sendData = JSON.stringify(formatedData)

        res.status(200).json(sendData);
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}

