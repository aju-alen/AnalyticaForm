import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { Button, Stack } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { uid } from 'uid';
import { axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
// import rekognition from '../utils/aws-config';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const SelectOneImage = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {
  const [formData, setFormData] = useState({
    id: id,
    question: '',
    formMandate: false,
    options: [
      { id: uid(5), value: '', imageURL: null },
      { id: uid(5), value: '', imageURL: null }
    ],
    selectedValue: [{ question: '', answer: '', value: '', index: '' }],
    formType: 'SelectOneImageForm'
  });
  const [userId, setUserId] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(formData);
      onSaveForm(formData);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [formData]);

  useEffect(() => {
      const local = JSON.parse(localStorage.getItem('userAccessToken'));
      console.log(userId, 'userId in CreateNewSurvey');
      setUserId(local);
      
  }, []);

  const handleAddOptions = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: uid(5), value: '', imageURL: null }]
    });
  };

  const handleSelectAnswer = (event,answer) => {
    setFormData({
        ...formData,
        selectedValue: [{ question: formData.question, answer: answer, value: '', index: '' }]
        });
  }

  const handleImageUpload = async (event, id) => {
    const file = event.target.files[0];
    console.log(file, 'file');

    try {
      if (file) {
        console.log(file, 'fileeeeee');
        const awsId = uid(5);
        const fileData = new FormData();
        fileData.append('s3', file);
        const fileResp = await axiosWithAuth.post(`${backendUrl}/api/s3/upload-image/${awsId}`, fileData);
        console.log(fileResp, 'file response');
        const getUrlFromAWS = await axiosWithAuth.get(`${backendUrl}/api/s3/get-image/${awsId}`);
        console.log(getUrlFromAWS, 'file get data');
        const filesUrl = getUrlFromAWS.data.files[0];
        console.log(filesUrl, 'filesUrl');




        const getPathFromUrl = (filesUrl) => {
          const parts = filesUrl.split('/');
          const index = parts.findIndex(part => part === 'imageForm');
          if (index !== -1) {
            return parts.slice(index).join('/');
          }
          return '';
        };
        
        const relativePath = getPathFromUrl(filesUrl);
        console.log(relativePath,'fileImageNameeeee'); // Outp





        // Update form data with image URL
        const newOptions = formData.options.map((option, index) => {
          if (option.id === id) {
            return { ...option, imageURL: filesUrl };
          }
          return option;
        });
        setFormData({ ...formData, options: newOptions });

        // Analyze the uploaded image using AWS Rekognition
        const params = {
          Image: {
            S3Object: {
              Bucket: import.meta.env.VITE_BUCKET_NAME,
              Name: relativePath,
            },
          },
          MaxLabels: 10,
          MinConfidence: 75,
        };

        // try {
        //   const result = await rekognition.detectLabels(params).promise();
        //   console.log('Rekognition Response:', result); // Log the result
        //   const boolean = result.Labels.some(label => label.Name === 'Nudity' || label.Name === 'Suggestive' || label.Name === "Underwear" || label.Name === "Lingerie" || label.Name === "Bra" );
          
        //   console.log(boolean, 'boolean');
        //   if (boolean) {
        //     alert('We suspect this image might be against our Terms & Condition. You can continue with the image but it will be reviewed by our team.');
        //     console.log(awsId, 'awsId');
        //     console.log(filesUrl, 'filesUrl');
        //     console.log(userId, 'userId');
        //     const email = userId.email;
        //     const id = userId.id;
        //     const firstName = userId.firstName;
            
            
        //     const sendEmail = await axiosWithAuth.post(`${backendUrl}/api/send-email/report-nsfw`,{awsId,filesUrl,email,id,firstName});
        //     return;
        //   }
        // } catch (err) {
        //   console.error('Rekognition Error:', err); // Log the error
        //   alert('Error analyzing image: ' + err.message);
        //   console.log(sendEmail,'sendEmail');

        // }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteOptions = (id) => {
    const newOptions = formData.options.filter(option => option.id !== id);
    setFormData({ ...formData, options: newOptions });
  };

  const handleSaveForm = () => {
    onSaveForm(formData);
    onHandleNext();
  };

  

  useEffect(() => {
    if (options) {
      setFormData(data);
    } else {
      setFormData({ ...formData, id });
    }
  }, [data]);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='xl'>
        <Box sx={{
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexGrow: 1,
          height: "100%",
          mt: { xs: 4, md: 0 },
          width: '100%',
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)',
          borderRadius: 2,
          p: 2,
          overflowX: 'auto',
          border: '2px solid #f0fbf0',
          transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
          position: 'relative',
          backgroundColor: '#F4F3F6',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '0%',
            transform: 'translateX(-50%)',
            height: '100%',
            width: '12px',
            bgcolor: '#1976d2',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          },
          '&:hover::before': {
            opacity: 1,
          },
          '&:hover': {
            boxShadow: '0px 1px rgba(0, 0, 0, 0.2)',
            transform: 'scale(0.98)',
            backgroundColor: '#F4FFF8',
          },
        }}>
          <TextField fullWidth id="standard-basic" label={!disableText ? "Insert input" : ''} variant='standard' size='small' required name='question' value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            InputProps={{
              readOnly: disableText,
            }}
          />
          <Stack spacing={1} sx={{ width: '94%', marginRight: 'auto' }}>
            <Grid container spacing={2}>
              {formData.options.map((option, index) => {
                console.log(option, 'optionnnnnnnnnnnnnn');
                
                return(
                <Grid item xs={6} key={option.id}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      '&:hover .delete-button': {
                        visibility: 'visible',
                      },
                      '&:hover .upload-button': {
                        visibility: 'visible',
                      },
                    }}
                  >
                    <Button onClick={(event)=>handleSelectAnswer(event,option.value)}>
                    <Stack spacing={1} width='100%'>
                      <Box
                        component="div"
                        sx={{
                          position: 'relative',
                          width: '100%',
                        }}
                      >
                        <Box
                          component="img"
                          sx={{
                            width: '100%',
                            height: '100%',
                            maxHeight: 300,
                            minHeight: 300,
                            objectFit: 'fill',
                            borderRadius: 1,
                            display: 'block' 
                          }}
                          src={option.imageURL || 'https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'}
                          alt="Uploaded"
                        />
                        {disableForm &&<Button
                          className="upload-button"
                          component='label'
                          variant='contained'
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            visibility: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                          }}
                        >
                          Upload Image
                          <VisuallyHiddenInput
                            type='file'
                             accept="image/png, image/jpeg"
                            onChange={(event) => handleImageUpload(event, option.id)}
                          />
                        </Button>}
                      </Box>
                      <TextField
                        fullWidth
                        id="standard-basic"
                        placeholder={!disableText ? "Type Your Response Here" : ''}
                        variant="standard"
                        name={option.text}
                        value={option.value}
                        sx={{
                          '& .MuiInputBase-root': {
                            fontSize: '0.8rem',
                          },
                          '& .MuiInput-underline:before': {
                            borderBottom: 'none',
                          },
                          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottom: 'none',
                          },
                        }}
                        onChange={(e) => {
                          const newOptions = formData.options.map((opt) => {
                            if (opt.id === option.id) {
                              return { ...opt, value: e.target.value };
                            }
                            return opt;
                          });
                          setFormData({ ...formData, options: newOptions });
                        }}
                        InputProps={{
                          readOnly: disableText,
                        }}
                      />
                    </Stack>
                    </Button>
                    {!disableButtons && (
                      <Button
                        className="delete-button"
                        color="error"
                        variant="text"
                        sx={{
                          position: 'absolute',
                          left: '100%',
                          visibility: 'hidden',
                          transition: 'visibility 0.1s ease-in-out',
                        }}
                        onClick={() => handleDeleteOptions(option.id)}
                      >
                        <HighlightOffIcon fontSize="small" />
                      </Button>
                    )}
                  </Box>
                </Grid>)
})}
            </Grid>
            {!disableButtons && (
              <Button
                sx={{ width: '70%' }}
                onClick={handleAddOptions}
                variant='outlined'
                color="primary"
                size="small"
              >
                Add new row
              </Button>
            )}
          </Stack>
          <Stack spacing={2} direction='row'>
            {disableButtons && <Button
              variant='contained'
              color="success"
              onClick={handleSaveForm}>
              Next Question
            </Button>}
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default SelectOneImage;
