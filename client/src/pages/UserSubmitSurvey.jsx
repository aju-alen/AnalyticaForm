import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../utils/backendUrl'
import { useParams } from 'react-router-dom'
import SelectSingleCheckBox from '../components/SelectSingleCheckBox'
import SelectSingleRadio from '../components/SelectSingleRadio'
import SelectMultiScalePoint from '../components/SelectMultiScalePoint'
import { Button, TextField } from '@mui/material'
import SelectMultiScaleCheckBox from '../components/SelectMultiScaleCheckBox'
import SelectDropdownMenu from '../components/SelectDropdownMenu'
import SelectMultiSpreadsheet from '../components/SelectMultiSpreadsheet'
import CommentBox from '../components/CommentBox'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import theme from '../utils/theme'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SingleRowText from '../components/SingleRowText';
import EmailAddress from '../components/EmailAddress'
import ContactInformation from '../components/ContactInformation'
import StarRating from '../components/StarRating'
import SmileyRating from '../components/SmileyRating'
import ThumbsUpDown from '../components/ThumbsUpDown'
import SliderText from '../components/SliderText'

const UserSubmitSurvey = () => {
    const { surveyId } = useParams();
    const [surveyData, setSurveyData] = React.useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [introduction, setIntroduction] = useState(true)
    const [welcomePage, setWelcomePage] = useState(true)
    const [responseSubmitted, setResponseSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        userEmail: '',
        userName: '',
    });
    const [skippedFields, setSkippedFields] = useState([]);


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
    const handlePrevious = () => {
        if (currentIndex === 0) {
            return;
        }
        setCurrentIndex(prevIndex => prevIndex - 1);
    }

    const handleGoToIntro = () => {
        setIntroduction(true);
        setWelcomePage(false);
    }

    const handleChangeWelcome = () => {
        // setIntroduction(false);
        setWelcomePage(false);
    }
    const handleChangeIntroduction = () => {
        setIntroduction(false);
        setWelcomePage(false);
    }

    const handleSaveForm = async () => {
        try {
            const mandatoryFields = surveyData.surveyForms.filter(form => form.formMandate);
            console.log(mandatoryFields, 'mandatoryFields');
            
            mandatoryFields.filter(form => {
                console.log(form,'form');
            })

            const skippedMandatoryFields = mandatoryFields.filter(form => form.selectedValue[0]?.answer === '' || form.selectedValue.length === 0);
            console.log(skippedMandatoryFields, 'skippedMandatoryFields');


            if (skippedMandatoryFields.length > 0) {
                alert('Please fill the mandatory fields');
                // Optionally, you can set the currentIndex to the first skipped mandatory field index
                setCurrentIndex(surveyData.surveyForms.findIndex(form => form === skippedMandatoryFields[0]));
                return;
            }
            const introduction = surveyData.surveyIntroduction === null ? false : true;
            console.log(introduction, 'introduction');
            const data = surveyData.surveyForms.map(form =>
            ({
                formType: form.formType,
                question: form.question,
                selectedValue: form.selectedValue.map(option => option),

            }));

            const formQuestions = surveyData.surveyForms.map(form => {

                if (form.formType === "CommentBoxForm"){
                    console.log(form, 'form in CommentBoxForm');
                    return {
                        'Comment Box': form.options.map(option => {
                            console.log(option, 'option CommentBoxForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)
                        
                    }
                }

                else if (form.formType === "SingleRowTextForm"){
                    console.log(form, 'form in SingleRowText');
                    return {
                        'Single Row Text': form.options.map(option => {
                            console.log(option, 'option SingleRowText');
                            return option.question;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)
                        
                    }
                }
                else if (form.formType === "EmailAddressForm"){
                    console.log(form, 'form in EmailAddressForm');
                    return {
                        'Email Address': form.options.map(option => {
                            console.log(option, 'option EmailAddressForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)
                        
                    }
                }

                else if (form.formType === "ContactInformationForm"){
                    console.log(form, 'form in ContactInformationForm');
                    return {
                        'Contact Information': form.options.map(option => {
                            console.log(option, 'option ContactInformationForm');
                            return option.placeholder;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)
                        
                    }
                }

                else if (form.formType === "StarRatingForm"){
                    console.log(form, 'form in StarRatingForm');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            console.log(option, 'option StarRatingForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)
                        
                    }
                }

                else if (form.formType === "SmileyRatingForm"){
                    console.log(form, 'form in SmileyRatingForm');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            console.log(option, 'option SmileyRatingForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "SmileyRatingForm" || index === 0)
                        
                    }
                }

                
                else if (form.formType === 'SelectDropDownForm') {
                    console.log(form, 'form in row question');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            console.log(option, 'option');
                            if (form.formType === "SelectDropDownForm") {
                                // Return an array with a single null for SinglePointForm
                                return null;
                            }
                            return option.rowQuestion;
                        }).filter((item, index) => form.formType !== "SelectDropDownForm" || index === 0)
                    };
                }

                else if (form.formType === "ThumbUpDownForm"){
                    console.log(form, 'form in SmileyRatingForm');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            console.log(option, 'option SmileyRatingForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "ThumbUpDownForm" || index === 0)
                        
                    }
                }

                else if (form.formType === 'SelectDropDownForm') {
                    console.log(form, 'form in row question');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            console.log(option, 'option');
                            if (form.formType === "SelectDropDownForm") {
                                // Return an array with a single null for SinglePointForm
                                return null;
                            }
                            return option.rowQuestion;
                        }).filter((item, index) => form.formType !== "SelectDropDownForm" || index === 0)
                    };
                }

               else if (form.formType !== "MultiScaleCheckBox") {
                    console.log(form, 'form in row question');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            console.log(option, 'option');
                            if (form.formType === "SinglePointForm") {
                                // Return an array with a single null for SinglePointForm
                                return null;
                            }
                            return option.rowQuestion;
                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)
                    };
                } else if (form.formType === "MultiScaleCheckBox") {
                    return form.options.map(option => {
                        return {
                            [form.question + " " + option.rowQuestion]: form.columnTextField.map(column => column.value)
                        };
                    });
                }
            }).flat(); // Flatten the array since MultiScaleCheckBox returns an array of objects

            console.log(formQuestions, 'formQuestions');
            const finalData = {
                userResponse: data,
                userName: formData.userName,
                userEmail: formData.userEmail,
                formQuestions: formQuestions,
                introduction: introduction

            }
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

        const hasMandatoryFields = currentItem.formMandate && currentItem.selectedValue.length === 0;

        if (hasMandatoryFields && skippedFields.includes(currentItem.id)) {
            // Show alert if mandatory fields are not filled and not skipped
            alert('Please fill the mandatory fields');
            return null; // Do not render the form until mandatory fields are filled
        }

        switch (currentItem.formType) {
            case 'SinglePointForm':
                return (
                    <div className=' w-full'>
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        <SelectSingleRadio
                            data={currentItem}
                            onSaveForm={handleSaveSinglePointForm}
                            onHandleNext={handleNext}
                            id={currentItem.id}
                            options={currentItem.options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true} />
                    </div>
                );
                case 'SelectDropDownForm':
                    return (
                        <div className=' w-full'>
                            {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                                <KeyboardBackspaceIcon fontSize='large' />
                            </Button>}
    
                            {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                                <KeyboardBackspaceIcon fontSize='large' />
                            </Button>}
    
                            <SelectDropdownMenu
                                data={currentItem}
                                onSaveForm={handleSaveSinglePointForm}
                                onHandleNext={handleNext}
                                id={currentItem.id}
                                options={currentItem.options}
                                disableForm={false}
                                disableText={true}
                                disableButtons={true} />
                        </div>
                    );

            case 'SingleCheckForm':
                return  (
                    <div className=' w-full'>
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                 <SelectSingleCheckBox
                    data={currentItem}
                    onHandleNext={handleNext}
                    onSaveForm={handleSaveSingleCheckForm}
                    id={currentItem.id}
                    options={currentItem.options}
                    disableForm={false}
                    disableText={true}
                    disableButtons={true} />;
                    </div>
                );

            case 'CommentBoxForm':
                return (
                    <div className=" w-11/12 h-4/6">
                          {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <CommentBox
                            data={currentItem}
                            onHandleNext={handleNext}
                            onSaveForm={handleSaveMultiScalePointForm}
                            id={currentItem.id}
                            options={currentItem.options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true} />
                    </div>
                );

            case 'SingleRowTextForm':
                return (
                    <div className=" w-11/12 h-4/6">
                          {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <SingleRowText
                            data={currentItem}
                            onHandleNext={handleNext}
                            onSaveForm={handleSaveMultiScalePointForm}
                            id={currentItem.id}
                            options={currentItem.options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true} />
                    </div>
                );

                case 'EmailAddressForm':
                return (
                    <div className=" w-11/12 h-4/6">
                          {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <EmailAddress
                            data={currentItem}
                            onHandleNext={handleNext}
                            onSaveForm={handleSaveMultiScalePointForm}
                            id={currentItem.id}
                            options={currentItem.options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true} />
                    </div>
                );

                case 'ContactInformationForm':
                return (
                    <div className=" w-11/12 h-4/6">
                          {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <ContactInformation
                            data={currentItem}
                            onHandleNext={handleNext}
                            onSaveForm={handleSaveMultiScalePointForm}
                            id={currentItem.id}
                            options={currentItem.options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true} />
                    </div>
                );
                case 'StarRatingForm':
                return (
                    <div className=" w-11/12 h-4/6">
                          {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <StarRating
                            data={currentItem}
                            onHandleNext={handleNext}
                            onSaveForm={handleSaveMultiScalePointForm}
                            id={currentItem.id}
                            options={currentItem.options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true} />
                    </div>
                );

                case 'SmileyRatingForm':
                return (
                    <div className=" w-11/12 h-4/6">
                          {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <SmileyRating
                            data={currentItem}
                            onHandleNext={handleNext}
                            onSaveForm={handleSaveMultiScalePointForm}
                            id={currentItem.id}
                            options={currentItem.options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true} />
                    </div>
                );
            
                case 'ThumbUpDownForm':
                return (
                    <div className=" w-11/12 h-4/6">
                          {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <ThumbsUpDown
                            data={currentItem}
                            onHandleNext={handleNext}
                            onSaveForm={handleSaveMultiScalePointForm}
                            id={currentItem.id}
                            options={currentItem.options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true} />
                    </div>
                );

                case 'SliderTextForm':
                return (
                    <div className=" w-11/12 h-4/6">
                          {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <SliderText
                            data={currentItem}
                            onHandleNext={handleNext}
                            onSaveForm={handleSaveMultiScalePointForm}
                            id={currentItem.id}
                            options={currentItem.options}
                            disableForm={false}
                            disableText={true}
                            disableButtons={true} />
                    </div>
                );
            
                case 'MultiScalePoint':
                    return (
                        <div className=" w-11/12 h-4/6">
                              {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                                <KeyboardBackspaceIcon fontSize='large' />
                            </Button>}
    
                            {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                                <KeyboardBackspaceIcon fontSize='large' />
                            </Button>}
    
    
                            <SelectMultiScalePoint
                                data={currentItem}
                                onHandleNext={handleNext}
                                onSaveForm={handleSaveMultiScalePointForm}
                                id={currentItem.id}
                                options={currentItem.options}
                                disableForm={false}
                                disableText={true}
                                disableButtons={true} />
                        </div>
                    );

            case 'MultiScaleCheckBox':
                return (
                <div className=" w-11/12 h-4/6">
                      {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                <SelectMultiScaleCheckBox
                    data={currentItem}
                    onHandleNext={handleNext}
                    onSaveForm={handleSaveSingleCheckForm}
                    id={currentItem.id}
                    options={currentItem.options}
                    disableForm={false}
                    disableText={true}
                    disableButtons={true} />
                </div>
                );

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
        <ThemeProvider theme={theme}>
      <CssBaseline />
        <div className=" flex justify-center items-center h-screen">
            {(surveyData.surveyResponses > 500) && (<h1 className=' font-bold text-blue-500 text-xl'> This survey has exceeded it's alloted responses. Please contact host.</h1>)}

            {(introduction && welcomePage && surveyData.surveyResponses <= 500 ) && (<div className=" flex flex-col">
                <h1 className=' font-bold text-blue-500 text-xl text-center'>Hello, welcome to the survey!</h1>


                {/* <TextField variant='standard' >
                    <h2>{surveyData.surveyTitle}</h2>
                </TextField> */}
                <Button
                    variant='contained'

                    onClick={handleChangeWelcome}>
                    Start Survey
                </Button>
            </div>)}

            {(introduction && !welcomePage) && (<div className=" flex flex-col">
                <h1 className=' font-bold text-blue-700 text-xl text-center'>Introduction</h1>
                <div className="px-4 py-2 overflow-scroll w-screen mx-auto ">
                    {surveyData.surveyIntroduction ? (
                        <p className="text-justify  text-md md:text-md text-black  whitespace-pre-wrap w-4/5 mx-auto">
                            {surveyData.surveyIntroduction}
                        </p>
                    ) : null}
                </div>
                <Button
                    variant='contained'
                    sx={{width:{xs:'50%',md:'10%'}, margin:'auto'}}

                    onClick={handleChangeIntroduction}>
                    Start Survey
                </Button>
            </div>)
            }
            {(surveyData.surveyForms && !introduction) && renderCurrentComponent()}

        </div>
        </ThemeProvider >
    )
}

export default UserSubmitSurvey



