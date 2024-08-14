import React, { useState, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import { uid } from 'uid';
import { styled } from '@mui/material/styles';
import { backendUrl } from '../utils/backendUrl';
import { axiosWithAuth } from '../utils/customAxios';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Grid from '@mui/material/Grid';

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


const SelectMultipleImage = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {

    const [formData, setFormData] = useState({
        id: id,
        question: '',
        formMandate: false,
        options: [
            { id: uid(5), value: '',imageURL:'',isChecked: false },
            { id: uid(5), value: '',imageURL:'',isChecked: false  },

        ],
        selectedValue: [],
        formType: 'SelectMultipleImageForm'
    });
    const [files, setFiles] = useState([]);
    console.log(files, 'files in select one image form');
    const [debouncedValue, setDebouncedValue] = useState('');


    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(formData);
        onSaveForm(formData);
        // onSaveIndicator('Saved')
      }, 1000); // 500ms delay

      // Cleanup function to cancel the timeout if value changes before delay
      return () => {
        // onSaveIndicator('Not Saaved')
        clearTimeout(handler);
      };
    }, [formData]);

    const handleAddOptions = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { id: uid(5), value: '',imageURL:'',isChecked: false }]
        })
    }


    const handleDeleteOptions = (id) => {
        // console.log(id,'id in delete');
        const newOptions = formData.options.filter(option => option.id !== id);
        // console.log(newOptions,'newOptions');
        setFormData({ ...formData, options: newOptions });
    }

   const handleImageUpload = async (event,id) => {
    const file = event.target.files[0];
    console.log(file, 'file');

    try{
        if (file) {
            console.log(file,'fileeeeee');
            const awsId = uid(5);
            const fileData = new FormData();
            fileData.append('s3', file)
            const fileResp = await axiosWithAuth.post(`${backendUrl}/api/s3/upload-image/${awsId}`, fileData)
            console.log(fileResp, 'file response');
            const getUrlFromAWS = await axiosWithAuth.get(`${backendUrl}/api/s3/get-image/${awsId}`)
            console.log(getUrlFromAWS, 'file get data');
            const filesUrl = getUrlFromAWS.data.files
            console.log(filesUrl, 'filesUrl');
            const newOptions = formData.options.map((option, index) => {
                if (option.id === id) {
                    return { ...option, imageURL: filesUrl[0] }
                }
                return option

            })
            setFormData({ ...formData, options: newOptions })
        }
    }
    catch(err){
        console.log(err);
    }
   }

   

    const handleSaveForm = async() => {
        try {
           
            console.log('save handleSaveForm');
            onSaveForm(formData);
            onHandleNext()
        }
        catch (err) {
            console.log(err, 'error in save form');
            
        }
    }

    // const handleMandateForm = () => {
    //   console.log('mandate handleMandateForm');
    //   setFormData({ ...formData, formMandate: true })
    // }

    useEffect(() => {
        // console.log(data,'data in select one choice form');
        if (options) {
            setFormData(data)
        }
        else {
            setFormData({ ...formData, id })
        }
    }, [data])
    // console.log(id,'id in select one choice form');
    console.log(formData, 'formData in select one IMAGE form');
    console.log(disableForm, 'disableForm in select one IMAGE form');
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
                        <TextField fullWidth id="standard-basic" label={!disableText ? "Insert input" : ''} variant="standard" size='small' required name='question' value={formData.question}
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
                    <Button onClick={(event)=> 
                    {
                      const newOptions = formData.options.map((opt) => {
                        if (opt.id === option.id) {
                          return { ...opt, isChecked: !opt.isChecked };
                        }
                        return opt;
                      });
                      const selectedValue = newOptions.filter((opt) => opt.isChecked).map((opt) => {
                        return (
                            { question: formData.question, answer: option.value, value: '', index: '' }
                        )
                      });
                        setFormData({ ...formData, options: newOptions, selectedValue });}
                     }>
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
                            objectFit: 'contain',
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
                            {/* {!disableButtons && <Button
              variant='contained'
              color="primary"
              onClick={handleMandateForm}>
               Mandate This Form
            </Button>} */}
                        </Stack>
                    </Box>
                </Container>
            </React.Fragment>

    )
}

export default SelectMultipleImage

