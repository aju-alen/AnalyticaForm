import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../utils/backendUrl';
import { useParams } from 'react-router-dom';
import SelectSingleCheckBox from '../components/SelectSingleCheckBox';
import SelectSingleRadio from '../components/SelectSingleRadio';
import SelectMultiScalePoint from '../components/SelectMultiScalePoint';
import { Button } from '@mui/material';

const UserSubmitSurvey = () => {
    const { surveyId } = useParams();
    const [surveyData, setSurveyData] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSaveSinglePointForm = (formData) => {
        console.log(formData, 'formData in the parent');

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
    

    const handleNext = (num) => {
        setCurrentIndex(prevIndex => prevIndex + 1);
    };

    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/survey/get-one-survey/customer/${surveyId}`);
                setSurveyData(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchSurveyData();
    }, [surveyId]);

    return (
        <div className="">
            <h1>{surveyData.surveyTitle}</h1>
            {surveyData.surveyForms && surveyData.surveyForms.length > 0 && (
                <>

                    {surveyData.surveyForms[currentIndex].formType === 'SinglePointForm' && (
                        <SelectSingleRadio
                            data={surveyData.surveyForms[currentIndex]}
                            id={surveyData.surveyForms[currentIndex].id}
                            options={surveyData.surveyForms[currentIndex].options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true}
                            onSaveForm={handleSaveSinglePointForm}
                            onHandleNext={handleNext}
                        />
                    )}

                    {surveyData.surveyForms[currentIndex].formType === 'SingleCheckForm' && (
                        <SelectSingleCheckBox
                            data={surveyData.surveyForms[currentIndex]}
                            id={surveyData.surveyForms[currentIndex].id}
                            options={surveyData.surveyForms[currentIndex].options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true}
                            onSaveForm={handleSaveSingleCheckForm}
                            onHandleNext={handleNext}   

                        />
                    )}

                    {surveyData.surveyForms[currentIndex].formType === 'MultiScalePoint' && (
                        <SelectMultiScalePoint
                            data={surveyData.surveyForms[currentIndex]}
                            id={surveyData.surveyForms[currentIndex].id}
                            options={surveyData.surveyForms[currentIndex].options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true}
                            // onSaveForm={handleSaveForm}
                        />
                    )}
                    <Button onClick={handleNext}>Next</Button>
                </>
            )}
        </div>
    );
};

export default UserSubmitSurvey;
