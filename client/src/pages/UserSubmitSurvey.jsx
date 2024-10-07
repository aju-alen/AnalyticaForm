import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../utils/backendUrl'
import { useParams,useNavigate } from 'react-router-dom'
import SelectSingleCheckBox from '../components/SelectSingleCheckBox'
import SelectSingleRadio from '../components/SelectSingleRadio'
import IntroductionForm from '../components/IntroductionForm'
import SelectMultiScalePoint from '../components/SelectMultiScalePoint'
import { Button, TextField,Box,Typography, Stack, AppBar,Toolbar} from '@mui/material'
import SelectMultiScaleCheckBox from '../components/SelectMultiScaleCheckBox'
import GoogleRecaptcha from '../components/GoogleRecaptcha'
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
import DateTime from '../components/DateTime'
import Calender from '../components/Calender'
import RankOrder from '../components/RankOrder'
import ConstantSum from '../components/ConstantSum'
import NumericSlider from '../components/NumericSlider'
// import SelectOneImage from '../components/SelectOneImage'
import SEO from '../components/SEO'
import SelectMultipleImage from '../components/SelectMultipleImage'
import PickAndRank from '../components/PickAndRank'
import RankOrderImage from '../components/RankOrderImage'
import PresentationText from '../components/PresentationText'
import SectionHeading from '../components/SectionHeading'
import SectionSubHeading from '../components/SectionSubHeading'
import MapForm from '../components/MapForm'
import { axiosWithAuth } from '../utils/customAxios'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { LinkPreview } from '@dhaiwat10/react-link-preview';

const UserSubmitSurvey = () => {
    const { surveyId,surveyTitle } = useParams();
    const navigate = useNavigate();

    const [openDrawer, setOpenDrawer] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
      setOpenDrawer(newOpen);
    };

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
    const [startDate, setStartDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


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

    const handleSaveForm = async (e) => {
        e.preventDefault();

        try {
            //response time calculation
            const finishedDate = Date.now();
            const timeSpent = finishedDate - startDate;
            const timeSpentInSeconds = Math.round((finishedDate - startDate) / 1000);
            const minutes = Math.floor(timeSpentInSeconds / 60);
            const seconds = timeSpentInSeconds % 60;
            const timeSpentString = `${minutes}m ${seconds}s`;
            //
            console.log(finishedDate, 'finishedDate',startDate,'startDate');
            const mandatoryFields = surveyData.surveyForms.filter(form => form.formMandate);
            console.log(mandatoryFields, 'mandatoryFields');

            mandatoryFields.filter(form => {
                console.log(form, 'form');
            })

            const skippedMandatoryFields = mandatoryFields.filter((form) => {
                // Check if 'selectedValue' exists and has items
                if (form.selectedValue && form.selectedValue.length > 0) {
                  // Check if any item in 'selectedValue' has an empty 'answer'
                  return form.selectedValue.some((value) => value.answer === '');
                }
                // If 'selectedValue' is empty, consider this form as skipped
                return true;
              });
            console.log(skippedMandatoryFields, 'skippedMandatoryFields');
            

            if (skippedMandatoryFields.length > 0  ) {
                alert('Please fill the mandatory fields');
                // Optionally, you can set the currentIndex to the first skipped mandatory field index
                setCurrentIndex(surveyData.surveyForms.findIndex(form => form === skippedMandatoryFields[0]));
                return;
            }
            const introduction = surveyData.surveyIntroduction === null ? false : true;
            console.log(introduction, 'introduction');
            console.log(surveyData.surveyForms, 'surveyData--surveyForm');
            
            const data = surveyData.surveyForms.map(form =>
            ({
                formType: form.formType,
                question: form.question,
                selectedValue: form.selectedValue.map(option => option),

            })).filter(ans => ans.formType !== "IntroductionForm");

            const formQuestions = surveyData.surveyForms.map(form => {

                if (form.formType === "CommentBoxForm") {
                    console.log(form, 'form in CommentBoxForm');
                    return {
                        'Comment Box': form.options.map(option => {
                            console.log(option, 'option CommentBoxForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)

                    }
                }

                else if (form.formType === "SingleRowTextForm") {
                    console.log(form, 'form in SingleRowText');
                    return {
                        'Single Row Text': form.options.map(option => {
                            console.log(option, 'option SingleRowText');
                            return option.question;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)

                    }
                }
                else if (form.formType === "EmailAddressForm") {
                    console.log(form, 'form in EmailAddressForm');
                    return {
                        'Email Address': form.options.map(option => {
                            console.log(option, 'option EmailAddressForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)

                    }
                }

                else if (form.formType === "ContactInformationForm") {
                    console.log(form, 'form in ContactInformationForm');
                    return {
                        'Contact Information': form.options.map(option => {
                            console.log(option, 'option ContactInformationForm');
                            return option.placeholder;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)

                    }
                }

                else if (form.formType === "StarRatingForm") {
                    console.log(form, 'form in StarRatingForm');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            console.log(option, 'option StarRatingForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)

                    }
                }

                else if (form.formType === "PickAndRankForm") {
                    console.log(form, 'form in PickAndRankForm');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.selectedValue.map(option => {
                            console.log(option, 'option StarRatingForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)

                    }
                }

                else if (form.formType === "DateTimeForm") {
                    console.log(form, 'form in DateTimeForm');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            console.log(option, 'option DateTimeForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "DateTimeForm" || index === 0)

                    }
                }

                else if (form.formType === "SmileyRatingForm" || form.formType === "ThumbUpDownForm") {
                    console.log(form, 'form in SmileyRatingForm');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            if (form.formType === "SinglePointForm") {
                                // Return an array with a single null for SinglePointForm
                                return null;
                            }
                            return option.rowQuestion;
                        }).filter((item, index) => form.formType !== "SinglePointForm" || index === 0)
                    };
                }


                else if (form.formType === 'SelectDropDownForm') {

                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            if (form.formType === "SelectDropDownForm") {
                                // Return an array with a single null for SinglePointForm
                                return null;
                            }
                            return option.rowQuestion;
                        }).filter((item, index) => form.formType !== "SelectDropDownForm" || index === 0)
                    };
                }

                else if (form.formType === "ThumbUpDownForm") {
                    console.log(form, 'form in SmileyRatingForm');
                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            console.log(option, 'option SmileyRatingForm');
                            return option.question;

                        }).filter((item, index) => form.formType !== "ThumbUpDownForm" || index === 0)

                    }
                }

                else if (form.formType === 'SelectDropDownForm') {

                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            if (form.formType === "SelectDropDownForm") {
                                // Return an array with a single null for SinglePointForm
                                return null;
                            }
                            return option.rowQuestion;
                        }).filter((item, index) => form.formType !== "SelectDropDownForm" || index === 0)
                    };
                }
                else if (form.formType === 'GoogleRecaptchaForm') {

                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            if (form.formType === "GoogleRecaptchaForm") {
                                // Return an array with a single null for SinglePointForm
                                return null;
                            }
                            return option.rowQuestion;
                        }).filter((item, index) => form.formType !== "GoogleRecaptchaForm" || index === 0)
                    };
                }

                else if (form.formType === 'CalenderForm') {

                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
                            if (form.formType === "CalenderForm") {
                                // Return an array with a single null for SinglePointForm
                                return null;
                            }
                            return option.rowQuestion;
                        }).filter((item, index) => form.formType !== "CalenderForm" || index === 0)
                    };
                }
                else if (form.formType === 'IntroductionForm') {
                    return null;
                }

                else if (form.formType !== "MultiScaleCheckBox") {

                    return {
                        [form.subheading ? form.subheading : form.question]: form.options.map(option => {
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
            }).filter(ans=>ans!==null).flat(); // Flatten the array since MultiScaleCheckBox returns an array of objects

            console.log(formQuestions, 'formQuestions');
            const finalData = {
                userResponse: data,
                userName: formData.userName,
                userEmail: formData.userEmail,
                formQuestions: formQuestions,
                introduction: introduction,
                userTimeSpent: timeSpentString


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
                setStartDate(Date.now());
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchSurveyData();
    }, [])

    useEffect(() => {
        const checkIfUserViewedSurvey = async () => {
            try{
                const viewedSurvey = await axiosWithAuth.put(`${backendUrl}/api/survey/update-user-view/${surveyId}`);
                console.log(viewedSurvey, 'viewedSurvey');
            }
            catch(err){
                console.log(err);
            }
        }
        checkIfUserViewedSurvey();
    }, []);
    console.log(surveyData, 'surveyData');


    const renderCurrentComponent = () => {
        const currentItem = surveyData?.surveyForms[currentIndex];

        if (!currentItem) {
            return (
                <div className="">
                    <h1 className=' font-bold text-blue-500 text-2xl text-center mb-2'>Thank You for your response</h1>
                    {(!responseSubmitted && !isLoading) && <h1 className=' font-bold text-blue-500 text-md mb-2 text-center'>Please enter your details. You can still proceed if you wish not to enter the details.  </h1>}

                    {!responseSubmitted &&
                        <div className=" text-center">
                            <form onSubmit={handleSaveForm} className='flex flex-col gap-5 mx-2'>

                            <TextField
                                label='Please Enter your name'
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            ></TextField>
                            <TextField
                                type='email'
                                label='Please Enter your Email Id'
                                value={formData.userEmail}
                                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                            ></TextField>
                            <div className=" mt-4">
                                <Button
                                    variant='contained'

                                    type="submit" >Submit Response</Button>
                            </div>
                            </form>
                        </div>
                    }
                    {(isLoading)  && 
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: '100vh' }}>
                <CircularProgress />
            </Box>
         }
                    {(responseSubmitted && !isLoading) && <h1 className=' font-bold text-blue-500 text-md mb-2'>Response submitted! You can now leave this page</h1>}
                </div>
            ); // Handle case when currentIndex is out of bounds
        }

        const hasMandatoryFields = currentItem.formMandate && currentItem.selectedValue.length === 0;

        console.log(currentItem, 'currentItem--in--mandate field');
        console.log(currentItem.selectedValue.length, 'skippedFields--in--mandate field');
        console.log(hasMandatoryFields, 'hasMandatoryFields--in--mandate field');
        
        
        

        if (hasMandatoryFields && skippedFields.includes(currentItem.id)) {
            // Show alert if mandatory fields are not filled and not skipped
            alert('Please fill the mandatory fields');
            return null; // Do not render the form until mandatory fields are filled
        }

        switch (currentItem.formType) {
            case 'SinglePointForm':
                return (
                    <div className=" w-11/12 h-4/6">
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
            case 'IntroductionForm':
                return (
                    <div className=" w-full h-5/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        <IntroductionForm
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
            case 'MapForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        <MapForm
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
                    <div className=" w-11/12 h-4/6">
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
                return (
                    // <div className=' w-full'>
                    <div className=" w-11/12 h-4/6">
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

            case 'DateTimeForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <DateTime
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

            case 'GoogleRecaptchaForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <GoogleRecaptcha
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

            case 'CalenderForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <Calender
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

            case 'RankOrderForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <RankOrder
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

            case 'ConstantSumForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <ConstantSum
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

            case 'SelectOneImageForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <SelectOneImage
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
            case 'SelectMultipleImageForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <SelectMultipleImage
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

            case 'RankOrderImageForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <RankOrderImage
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

            case 'PresentationTextForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <PresentationText
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

            case 'SectionHeadingForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <SectionHeading
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

            case 'SectionSubHeadingForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <SectionSubHeading
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

            case 'NumericSliderForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <NumericSlider
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

            case 'PickAndRankForm':
                return (
                    <div className=" w-11/12 h-4/6">
                        {currentIndex !== 0 && <Button onClick={handlePrevious} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}

                        {currentIndex === 0 && <Button onClick={handleGoToIntro} className=''>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </Button>}


                        <PickAndRank
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
                    <div className=" w-full h-4/6">
                    {/* <div className=" w-full"> */}
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
                    <div className=" w-full h-4/6">
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

    
    
    
    console.log(surveyData, 'surveyForms-forms');
    return (
        <ThemeProvider theme={theme}>
              <SEO
          title={surveyData.surveyTitle}
          description="Dubai Analytica Survey Page"
          name="Dubai Analytica"
          type="Web Form"
          surveyImage='https://i.postimg.cc/X7fPCLRg/Untitled-design.png'
          surveyUrl="https://www.dubaianalytica.com/user-survey/clxl91ta500018xf57ty8g6fl"
          schema={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${surveyData.surveyTitle}`,
            "description": "A page to gather user survey responses",
            "url": "https://www.dubaianalytica.com/user-survey/clxl91ta500018xf57ty8g6fl"
          }}
        />
        <LinkPreview url='https://www.dubaianalytica.com/user-survey/clxl91ta500018xf57ty8g6fl' width='400px' />
            <CssBaseline />
            <div className=" flex justify-center items-center h-screen">
                {(surveyData.surveyResponses > 500) && (<h1 className=' font-bold text-blue-500 text-xl'> This survey has exceeded it's alloted responses. Please contact host.</h1>)}

                {(introduction && welcomePage && surveyData.surveyResponses <= 500) && (<div className=" flex flex-col">
                    <h1 className=' font-bold text-blue-500 text-xl text-center'>Hello, welcome to the survey!</h1>


                    {/* <TextField variant='standard' >
                    <h2>{surveyData.surveyTitle}</h2>
                </TextField> */}
                    <Button
                        variant='contained'

                        onClick={handleChangeIntroduction}>
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
                        sx={{ width: { xs: '50%', md: '10%' }, margin: 'auto' }}

                        onClick={handleChangeIntroduction}>
                        Start Survey
                    </Button>
                </div>)
                }
                {(surveyData.surveyForms && !introduction) && renderCurrentComponent()}

            </div>
            <AppBar position="fixed" sx={{ display: { xs: "none", md: "block" } }} >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body2" color="inherit">
            Powered by 
            <Button onClick={()=>navigate('/')} variant='text' sx={{color:'white'}}>
            Dubai Analytica
            </Button>
          </Typography>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="body2" color="inherit">
              Create Your Own Survey
            </Typography>
            <Button variant='contained' color='warning' onClick={() => navigate('/login')}>
              Create Survey
            </Button>
          </Stack>
          <Button variant="body2" color="inherit" onClick={handleClickOpen}>
            Report Abuse
          </Button>
        </Toolbar>
      </AppBar>

            <AppBar position="fixed" sx={{ display: { xs: "", md: "none" } }} >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body2" color="inherit">
            Powered by 
            <Button onClick={()=>navigate('/')} variant='text' sx={{color:'white'}}>
            Dubai Analytica
            </Button>
          </Typography>

          <Button
              variant="text"
              color="error"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ minWidth: '30px', p: '4px' }}
            >
               <MenuIcon />

             </Button>

             <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>

<Box
     sx={{
       minWidth: '60dvw',
       p: 2,
       backgroundColor: 'background.paper',
       flexGrow: 1,
     }}
   >
     
      <Divider />
      
        

        <MenuItem>
           <Button variant="body2" color="inherit" onClick={() => navigate('/login')}>
              Create Your Own Survey
            </Button>
    </MenuItem>

        <MenuItem>
           <Button variant="body2" color="inherit" onClick={handleClickOpen}>
            Report Abuse
          </Button>
    </MenuItem>
        
    </Box>
  </Drawer>
        </Toolbar>
      </AppBar>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            const comment = formJson.comment;
            console.log(email, comment,'email, comment');
            const reportAbuse = axiosWithAuth.post(`${backendUrl}/api/send-email/report-abuse/${surveyId}`, {email, comment});
            handleClose();
          },
        }}
      >
        <DialogTitle >Dubai Analytica Report Abuse</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Thank you for taking the time to report the misuse of Dubai Analytica surveys!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="comment"
            name="comment"
            label="Give us the detail of the abuse"
            type="text"
            fullWidth
            variant='filled'
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Send Report</Button>
        </DialogActions>
      </Dialog>
        </ThemeProvider >
    )
}

export default UserSubmitSurvey



