import React, { useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../utils/backendUrl'
import { useParams } from 'react-router-dom'
import SelectSingleCheckBox from '../components/SelectSingleCheckBox'
import SelectSingleRadio from '../components/SelectSingleRadio'
import SelectMultiScalePoint from '../components/SelectMultiScalePoint'


const UserSubmitSurvey = () => {
    const { surveyId } = useParams();
    const [surveyData, setSurveyData] = React.useState({});

    const handleSaveSingleCheckForm = (formData) => {}
    const handleSaveSinglePointForm = (formData) => {}
    const handleSaveMultiScalePointForm = (formData) => {}


    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                const surveyData = await axios.get(`${backendUrl}/api/survey/get-one-survey/customer/${surveyId}`);
                setSurveyData(surveyData.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchSurveyData();
    }, [])
    console.log(surveyData, 'surveyData');
    return (
        <div className="">
            <h1>{surveyData.surveyTitle}</h1>
            {surveyData.surveyForms && surveyData.surveyForms.map((item) =>{
                console.log(item, 'item');
                return (
                    <div key={item.id}>
    
                        {item.formType === 'SingleCheckForm' && (
                           <SelectSingleCheckBox  onSaveForm={handleSaveSingleCheckForm} data={item} id={item.id} options={item.options} disableForm={true}/>
                        )}
                        {item.formType === 'SinglePointForm' && (
                            <SelectSingleRadio  onSaveForm={handleSaveSinglePointForm} data={item} id={item.id} options={item.options} disableForm={true} />
                        )}
                        {item.formType === 'MultiScalePoint' && (
                            <SelectMultiScalePoint  onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} />
                        )}
                    </div>
                )
            }
            ) }
        </div>
    )
}

export default UserSubmitSurvey