import React, { useState, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack,Grid} from '@mui/material';
import { uid } from 'uid';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
import { backendUrl } from '../utils/backendUrl';
import { axiosWithAuth } from '../utils/customAxios';
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
            { id: uid(5), value: '',imageURL:'https://archive.org/download/placeholder-image/placeholder-image.jpg' },
            { id: uid(5), value: '',imageURL:'https://archive.org/download/placeholder-image/placeholder-image.jpg' },

        ],
        selectedValue: [{ question: '', answer: '', value: '', index: '' }],
        formType: 'SelectOneImageForm'
    });
    const [files, setFiles] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
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
            options: [...formData.options, { id: uid(5), value: '',imageURL:'https://archive.org/download/placeholder-image/placeholder-image.jpg' }]
        })
    }

    const handleChangeIssue = (event, id) => {
        console.log(event.target.files, 'event in change issue', id, 'id in change issue');
        
        const file = event.target.files[0];
        if (file) {
          const imageURL = URL.createObjectURL(file);
          const newOptions = formData.options.map((option) => {
            if (option.id === id) {
              return { ...option, imageURL: imageURL };
            }
            return option;
          });
      
          setFormData({ ...formData, options: newOptions });
      
          // Wrap the file with additional metadata including the id
          const newFile = { file, id };
      
          setFiles((prevFiles) => {
            // Check if the file with the given id already exists
            const fileExists = prevFiles.some(fileObj => fileObj.id === id);
      
            if (fileExists) {
              // Replace the existing file with the new file
              return prevFiles.map(fileObj => 
                fileObj.id === id ? newFile : fileObj
              );
            } else {
              // Add the new file to the list
              return [...prevFiles, newFile];
            }
          });
      
          console.log(file, 'file in change issue');
        }
      };

    const handleDeleteOptions = (id) => {
        // console.log(id,'id in delete');
        const newOptions = formData.options.filter(option => option.id !== id);
        // console.log(newOptions,'newOptions');
        setFormData({ ...formData, options: newOptions });
    }

    const handleUploadImageAWS = async () => {
        try {
            const awsId = uid(5);
            const fileData = new FormData();
            console.log(files, 'finalfiles');
            for (const file of files) {
                fileData.append('s3', file.file); // Append file
                fileData.append('id', 15664); // Append id separately
            }
    
            const fileResp = await axiosWithAuth.post(`${backendUrl}/api/s3/upload-image/${awsId}`, fileData);
            console.log(fileResp, 'file response');
    
            const getUrlFromAWS = await axiosWithAuth.get(`${backendUrl}/api/s3/get-image/${awsId}`);
            console.log(getUrlFromAWS, 'file get data');
    
            const filesUrl = getUrlFromAWS.data.files;
            console.log(filesUrl, 'filesUrl');
    
            const newOptions = formData.options.map((option, index) => {
                return { ...option, imageURL: filesUrl[index] };
            });
            setFormData({ ...formData, options: newOptions });
        } catch (err) {
            console.log(err, 'error in upload image');
        }
    };

    const handleSaveForm = async() => {
        try {
            const updatedOptions = formData.options.map((option) => {
                if (option.imageURL.startsWith('blob:')) {
                  return { ...option, imageURL: 'https://archive.org/download/placeholder-image/placeholder-image.jpg' };
                }
                return option;
              });
              
              setFormData({ ...formData, options: updatedOptions });
           
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
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)', // Updated box shadow for a subtle effect
                    borderRadius: 2, // Increased border radius for rounded corners
                    p: 2, // Increased padding for inner content
                    overflowX: 'auto',
                    border: '2px solid #f0fbf0', // Added border for more distinction
                    transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out', // Added transition effect for box shadow and transform
                    position: 'relative', // Make sure the box is positioned relative for the pseudo-element
                    backgroundColor: '#F4F3F6',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '0%', // Set initial left position for the line
                        transform: 'translateX(-50%)',
                        height: '100%',
                        width: '12px', // Adjust the width of the line
                        bgcolor: '#1976d2', // Change to your desired color
                        opacity: 0, // Initially hidden
                        transition: 'opacity 0.3s ease-in-out', // Smooth transition for the line
                    },

                    '&:hover::before': {
                        opacity: 1, // Make the lines visible on hover
                    },
                    '&:hover': {
                        boxShadow: '0px 1px rgba(0, 0, 0, 0.2)', // Updated box shadow on hover
                        transform: 'scale(0.98)', // Slightly scale down the box to create an inward effect
                        backgroundColor: '#F4FFF8',
                    },
                }}>
                        <TextField fullWidth id="standard-basic" label={!disableText ? "Insert input" : ''} variant="standard" name='question' value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            InputProps={{
                                readOnly: disableText,
                            }}
                        />
                        <Grid container spacing={2} >
            {formData.options.map((option) => (
                <Grid item xs={6} key={option.id} textAlign='center' >
                   {disableButtons? (<Button
                        onClick={() => {
                            const selectedValue = formData.selectedValue.map((value) => {
                                return { ...value, question: formData.question, answer: option.value, value: option.value, index: option.id };
                            });
                            setFormData({ ...formData, selectedValue: selectedValue });
                        }}
                    >
                        <Stack spacing={2}>
                            <Box
                                component="img"
                                sx={{
                                    height: 233,
                                    width: 350,
                                    maxHeight: { xs: 233, md: 167 },
                                    maxWidth: { xs: 350, md: 250 },
                                }}
                                alt="The house from the offer."
                                src={option.imageURL}
                            />
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                onChange={handleChangeIssue}
                            >
                                Upload Image
                                <VisuallyHiddenInput type="file" />
                            </Button>
                            <TextField
                                fullWidth
                                id="standard-basic"
                                label={!disableText ? "Type Your Response Here" : ''}
                                variant="standard"
                                name={option.text}
                                value={option.value}
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
                            {!disableButtons && (
                                <Button
                                    color="error"
                                    variant="outlined"
                                    onClick={() => handleDeleteOptions(option.id)}
                                >
                                    <ClearIcon fontSize="small" />
                                </Button>
                            )}
                        </Stack>
                    </Button>):(
                       
                        <Stack spacing={2} textAlign='center' sx={{
                            margin: '12px',
                        }}>
                            <Box
                                component="img"
                                sx={{
                                    height: 233,
                                    width: 350,
                                }}
                                alt="The house from the offer."
                                src={option.imageURL}
                            />
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                onChange={(event)=>handleChangeIssue(event,option.id)}
                                sx={{
                                    width: '50%',
                                }}
                            >
                                Upload Image
                                <VisuallyHiddenInput type="file" />
                            </Button>
                            <TextField
                                fullWidth
                                id="standard-basic"
                                label={!disableText ? "Type Your Response Here" : ''}
                                variant="standard"
                                name={option.text}
                                value={option.value}
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
                            {!disableButtons && (
                                <Button
                                    color="error"
                                    variant="outlined"
                                    onClick={() => handleDeleteOptions(option.id)}
                                >
                                    <ClearIcon fontSize="small" />
                                </Button>
                            )}
                        </Stack>
                    
                    )}
                </Grid>
            ))}
        </Grid>
                        <Stack spacing={2} direction='row'>
                            {!disableButtons && (
                                <Button
                                    onClick={handleUploadImageAWS}
                                    variant='outlined'
                                    color="primary"
                                    size="small"
                                >Save Image</Button>
                            )}
                            {!disableButtons && (
                                <Button
                                    onClick={handleAddOptions}
                                    variant='outlined'
                                    color="primary"
                                    size="small"
                                >Add new row</Button>
                            )}

                            <Button
                                variant='contained'
                                color="success"
                                onClick={handleSaveForm}>
                                {!disableButtons ? 'Save This Form' : 'Next Question'}
                            </Button>
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

export default SelectOneImage