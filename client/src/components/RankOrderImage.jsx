import React, { useState, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import { uid } from 'uid';
import theme from '../utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
import { backendUrl } from '../utils/backendUrl';
import { axiosWithAuth } from '../utils/customAxios';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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



const RankOrderImage = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {

    const [formData, setFormData] = useState({
        id: id,
        question: '',
        formMandate: false,
        options: [
            { id: 'jk190', value: '',imageURL:'',isChecked: false,rowQuestion:'' },
            { id: '9rn46', value: '',imageURL:'',isChecked: false,rowQuestion:''   },

        ],
        selectedValue: [
            { id: 'jk190', question: '', answer: '', value: '', index: '' },
            { id: '9rn46', question: '', answer: '', value: '', index: ''   },

        ],
        formType: 'RankOrderImageForm'
    });
    const [files, setFiles] = useState([]);
    console.log(files, 'files in select one image form');
    const [debouncedValue, setDebouncedValue] = useState('');


    // useEffect(() => {
    //   const handler = setTimeout(() => {
    //     setDebouncedValue(formData);
    //     onSaveForm(formData);
    //     // onSaveIndicator('Saved')
    //   }, 1000); // 500ms delay

    //   // Cleanup function to cancel the timeout if value changes before delay
    //   return () => {
    //     // onSaveIndicator('Not Saaved')
    //     clearTimeout(handler);
    //   };
    // }, [formData]);

    const handleAddOptions = () => {
        const id = uid(5);
        setFormData({
            ...formData,
            options: [...formData.options, { id: id, value: '',imageURL:'',isChecked: false,rowQuestion:'' }],
            selectedValue: [...formData.selectedValue, { id: id, question: '', answer: '', value: '', index: '' }]
        })
    }

    const handleChangeIssue = (event) => {
        setFiles(prev => [...prev, event.target.files]);
    }

    const handleDeleteOptions = (id) => {
        // console.log(id,'id in delete');
        const newOptions = formData.options.filter(option => option.id !== id);
        // console.log(newOptions,'newOptions');
        setFormData({ ...formData, options: newOptions });
    }

    const handleChange = (e,id) => {
        console.log(id,'id in handleChange');
        console.log(e.target.value, 'e.target.value');
        const newSelectedValue = formData.selectedValue.map((opt) => {
            if (opt.id === id) {
                return { ...opt, answer: e.target.value }
            }
            return opt
        })
        setFormData({ ...formData, selectedValue: newSelectedValue })
    };

    const handleUploadImageAWS = async () => {
        try{
            const awsId = uid(5);
            const fileData = new FormData();
            console.log(files, 'finalfiles');
            for (const file of files) {
                console.log(file[0], 'file in submit');
                fileData.append('s3Image', file[0])
                console.log(fileData, 'file data inside');
            }
            console.log(fileData, 'file data');
            const fileResp = await axiosWithAuth.post(`${backendUrl}/api/s3/upload-image/${awsId}`, fileData)
            console.log(fileResp, 'file response');
            const getUrlFromAWS = await axiosWithAuth.get(`${backendUrl}/api/s3/get-image/${awsId}`)
            console.log(getUrlFromAWS, 'file get data');
            const filesUrl = getUrlFromAWS.data.files
            console.log(filesUrl, 'filesUrl');
            const newOptions = formData.options.map((option, index) => {
                return { ...option, imageURL: filesUrl[index] }
            })
            setFormData({ ...formData, options: newOptions })
        }
        catch(err){
            console.log(err,'error in upload image');

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
        <ThemeProvider theme={theme}>
            <React.Fragment>
                <CssBaseline />
                <Container maxWidth="lg">
                    <Box sx={{
                        bgcolor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexGrow: 1,
                        height: "100%",
                        mt: { xs: 4, md: 8 },
                        width: '100%',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)', // Updated box shadow for a subtle effect
                        borderRadius: 8, // Increased border radius for rounded corners
                        p: 3, // Increased padding for inner content
                        overflowX: 'auto',
                        border: '2px solid #f0f0f0', // Added border for more distinction
                        transition: 'box-shadow 0.3s ease-in-out', // Added transition effect for box shadow
                        '&:hover': {
                            boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.3)', // Updated box shadow on hover
                        },
                    }} >
                        <TextField fullWidth id="standard-basic" label={!disableText ? "Insert input" : ''} variant="standard" name='question' value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            InputProps={{
                                readOnly: disableText,
                            }}
                        />
                        <Stack spacing={2} direction='row'>
                            {formData.options.map((option) => {
                                console.log(option, 'option in select one image form');
                                return(
                                    <div>
                                 






                                <Stack  spacing={2} key={option.id}>
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
                                        value={option.rowQuestion}
                                        onChange={(e) => {
                                            const newOptions = formData.options.map((opt) => {
                                                if (opt.id === option.id) {
                                                    return { ...opt, rowQuestion: e.target.value }
                                                }
                                                return opt
                                            })

                                            const newSelectedValue = formData.selectedValue.map((opt) => {
                                                if (opt.id === option.id) {
                                                    return { ...opt, question: e.target.value }
                                                }
                                                return opt
                                            }
                                            )
                                            setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue })
                                            
                                        }}
                                        InputProps={{
                                            readOnly: disableText,
                                        }}
                                    />

                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={option.value}
                                        label="Age"
                                        onChange={(e)=>handleChange(e,option.id)}
                                        // disabled={disableForm}
                                    >
                                        {formData.options.map((option, idx) => (
                                            <MenuItem key={option.id} value={`Column ${idx + 1}`}
                                            disabled={formData.selectedValue.find((opt) => opt.answer === idx + 1) ? true : false}
                                            >Column {idx + 1}</MenuItem>
                                        ))
                                        }

                                    </Select>   


                                    {!disableButtons && (<Button
                                        color='error'
                                        variant='outlined'
                                        onClick={() => handleDeleteOptions(option.id)}>
                                        <ClearIcon
                                            fontSize='small'
                                        />
                                    </Button>)}
                                    

                                </Stack>
                                
                                </div>
                                )
})
                            }
                        </Stack>
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
        </ThemeProvider>

    )
}

export default RankOrderImage



