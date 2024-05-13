import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../utils/backendUrl'
import { useParams } from 'react-router-dom'
import SelectSingleCheckBox from '../components/SelectSingleCheckBox'
import SelectSingleRadio from '../components/SelectSingleRadio'
import SelectMultiScalePoint from '../components/SelectMultiScalePoint'
import { Button, TextField } from '@mui/material'
import SelectMultiScaleCheckBox from '../components/SelectMultiScaleCheckBox'
import SelectMultiSpreadsheet from '../components/SelectMultiSpreadsheet'


const UserSubmitSurvey = () => {
    const { surveyId } = useParams();
    const [surveyData, setSurveyData] = React.useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [introduction, setIntroduction] = useState(true)
    const [responseSubmitted, setResponseSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        userEmail: '',
        userName: '',
    });


    const handleSaveSinglePointForm = (formData) => {

        // Check if the formData id exists in the surveyForms array
        const existingFormIndex = surveyData.surveyForms.findIndex(form => form.id === formData.id);

        if (existingFormIndex !== -1) {
            // If the form data already exists, update it
            setSurveyData(prevSurveyData => ({
                ...prevSurveyData,
                surveyForms: prevSurveyData.surveyForms.map((form, index) => {
                    if (index === existingFormIndex) {
                        return formData; // Update existing form data
                    }
                    return form; // Leave other form data unchanged
                })
            }));
        } else {
            // If the form data doesn't exist, add it to the surveyForms array
            setSurveyData(prevSurveyData => ({
                ...prevSurveyData,
                surveyForms: [...prevSurveyData.surveyForms, formData]
            }));
        }
    };

    const handleSaveSingleCheckForm = (formData) => {

        const existingFormIndex = surveyData.surveyForms.findIndex(form => form.id === formData.id);

        if (existingFormIndex !== -1) {
            // If the form data already exists, update it
            setSurveyData(prevSurveyData => ({
                ...prevSurveyData,
                surveyForms: prevSurveyData.surveyForms.map((form, index) => {
                    if (index === existingFormIndex) {
                        return formData; // Update existing form data
                    }
                    return form; // Leave other form data unchanged
                })
            }));
        } else {
            // If the form data doesn't exist, add it to the surveyForms array
            setSurveyData(prevSurveyData => ({
                ...prevSurveyData,
                surveyForms: [...prevSurveyData.surveyForms, formData]
            }));
        }

    }

    const handleSaveMultiScalePointForm = (formData) => {

        const existingFormIndex = surveyData.surveyForms.findIndex(form => form.id === formData.id);

        if (existingFormIndex !== -1) {
            // If the form data already exists, update it
            setSurveyData(prevSurveyData => ({
                ...prevSurveyData,
                surveyForms: prevSurveyData.surveyForms.map((form, index) => {
                    if (index === existingFormIndex) {
                        return formData; // Update existing form data
                    }
                    return form; // Leave other form data unchanged
                })
            }));
        } else {
            // If the form data doesn't exist, add it to the surveyForms array
            setSurveyData(prevSurveyData => ({
                ...prevSurveyData,
                surveyForms: [...prevSurveyData.surveyForms, formData]
            }));
        }

    }

    const handleNext = () => {
        setCurrentIndex(prevIndex => prevIndex + 1);
    }

    const handleChangeIntroduction = () => {
        setIntroduction(false);
    }

    const handleSaveForm = async () => {
        try {
            const data = surveyData.surveyForms.map(form => ({
                question: form.question,
                selectedValue: form.selectedValue.map(option => option)
            }));
            const finalData = {
                userResponse: data,
                userName: formData.userName,
                userEmail: formData.userEmail

            }
            console.log(surveyData, 'surveyData');
            console.log(finalData, 'finalData');

            const sendUserResp = await axios.post(`${backendUrl}/api/user-response-survey/submit-survey/${surveyId}`, finalData);
            setResponseSubmitted(true);

            console.log(sendUserResp, 'sendUserResp');

        }
        catch (err) {
            console.log(err);
        }

    }


    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                const surveyData = await axios.get(`${backendUrl}/api/user-response-survey/get-one-survey/user/${surveyId}`);
                setSurveyData(surveyData.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchSurveyData();
    }, [])
    console.log(surveyData, 'surveyData');


    const renderCurrentComponent = () => {
        const currentItem = surveyData?.surveyForms[currentIndex];

        if (!currentItem) {
            return (
                <div className="">
                    <h1 className=' font-bold text-blue-500 text-2xl text-center mb-2'>Thank You for your response</h1>
                    {!responseSubmitted && <h1 className=' font-bold text-blue-500 text-md mb-2'>Please enter your details. You can still proceed if you wish not to enter the details.  </h1>}

                    {!responseSubmitted &&
                        <div className=" text-center">
                            <TextField
                                label='Please Enter your name'
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            ></TextField>
                            <TextField
                                label='Please Enter your Email Id'
                                value={formData.userEmail}
                                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                            ></TextField>
                                <div className=" mt-4">
                            <Button 
                                variant='contained'

                            onClick={handleSaveForm} >Submit Response</Button>
                            </div>
                        </div>
                    }
                    {responseSubmitted && <h1 className=' font-bold text-blue-500 text-md mb-2'>Response submitted! You can now leave this page</h1>}
                </div>
            ); // Handle case when currentIndex is out of bounds
        }

        switch (currentItem.formType) {
            case 'SinglePointForm':
                return <SelectSingleRadio
                    data={currentItem}
                    onSaveForm={handleSaveSinglePointForm}
                    onHandleNext={handleNext}
                    id={currentItem.id}
                    options={currentItem.options}
                    disableForm={false}
                    disableText={true}
                    disableButtons={true} />;

            case 'SingleCheckForm':
                return <SelectSingleCheckBox
                    data={currentItem}
                    onHandleNext={handleNext}
                    onSaveForm={handleSaveSingleCheckForm}
                    id={currentItem.id}
                    options={currentItem.options}
                    disableForm={false}
                    disableText={true}
                    disableButtons={true} />;

            case 'MultiScalePoint':
                return <SelectMultiScalePoint
                    data={currentItem}
                    onHandleNext={handleNext}
                    onSaveForm={handleSaveMultiScalePointForm}
                    id={currentItem.id}
                    options={currentItem.options}
                    disableForm={false}
                    disableText={true}
                    disableButtons={true} />;

            case 'MultiScaleCheckBox':
                return <SelectMultiScaleCheckBox
                    data={currentItem}
                    onHandleNext={handleNext}
                    onSaveForm={handleSaveSingleCheckForm}
                    id={currentItem.id}
                    options={currentItem.options}
                    disableForm={false}
                    disableText={true}
                    disableButtons={true} />;

            case 'MultiSpreadsheet':
                return <SelectMultiSpreadsheet
                    data={currentItem}
                    onHandleNext={handleNext}
                    onSaveForm={handleSaveSingleCheckForm}
                    id={currentItem.id}
                    options={currentItem.options}
                    disableForm={false}
                    disableText={true}
                    disableButtons={true} />;
            default:
                return null;
        }
    }

    console.log(surveyData.surveyForms, 'surveyForms');
    return (
        <div className=" flex justify-center items-center h-screen">
            {( surveyData.surveyResponses > 1) && (<h1 className=' font-bold text-blue-500 text-xl'>Survey response trial has exceeded. Please contact host</h1>)}            

            {(introduction && surveyData.surveyResponses <= 1)  &&(<div className=" flex flex-col">
                <h1 className=' font-bold text-blue-500 text-xl'>Hello, welcome to the survey!</h1>

                {/* <TextField variant='standard' >
                    <h2>{surveyData.surveyTitle}</h2>
                </TextField> */}
                <Button 
                    variant='contained'

                    onClick={handleChangeIntroduction}>
                    Start Survey
                </Button>
            </div>)}
            {(surveyData.surveyForms && !introduction) && renderCurrentComponent()}

        </div>
    )
}

export default UserSubmitSurvey



