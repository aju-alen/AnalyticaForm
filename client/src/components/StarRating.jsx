import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import Radio from '@mui/material/Radio';
import ClearIcon from '@mui/icons-material/Clear';
import { uid } from 'uid';
import theme from '../utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';




const StarRating = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {
    const [formData, setFormData] = useState({
        id: id,
        question: '',
        formMandate: false,
        options: [
            { id: '1pgr9', value: '',question:'' },


        ],
        selectedValue: [{id:'1pgr9', question: '', answer: '', value: '', index: '' }],
        formType: 'StarRatingForm'
    });

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
        const id = uid(5)
        setFormData({
            ...formData,
            options: [...formData.options, { id, value: '' }],
            selectedValue: [...formData.selectedValue, {id, question: '', answer: '', value: '', index: '' }]
        })
    }

    const handleDeleteOptions = (id) => {
        // console.log(id,'id in delete');
        const newOptions = formData.options.filter(option => option.id !== id);
        // console.log(newOptions,'newOptions');
        setFormData({ ...formData, options: newOptions });
    }

    const handleSaveForm = () => {
        console.log('save handleSaveForm');
        onSaveForm(formData);
        onHandleNext()
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
    console.log(formData, 'formData in select one choice form');
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

                        <Stack spacing={2}>
                            {formData.options.map((option) => (
                                <Stack direction="row" spacing={2} key={option.id}>
                                    <Rating
                                        name="simple-controlled"
                                        value={option.value}
                                        onChange={(event, newValue) => {
                                            const newOptions = formData.options.map((opt) => {
                                                if (opt.id === option.id) {
                                                    return { ...opt, value: newValue }
                                                }
                                                return opt
                                            })
                                            const newSelectedValue = formData.selectedValue.map((opt) => {
                                                if (opt.id === option.id) {
                                                    return { ...opt, answer: newValue }
                                                }
                                                return opt
                                            })
                                            setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue })
                                        }}
                                        disabled={disableForm}
                                    />
                                    <TextField
                                        fullWidth
                                        id="standard-basic"
                                        label={!disableText ? "Type Your Response Here" : ''}
                                        variant="standard"
                                        name={option.text}
                                        value={option.question}
                                        onChange={(e) => {
                                            const newOptions = formData.options.map((opt) => {
                                                if (opt.id === option.id) {
                                                    return { ...opt, question: e.target.value }
                                                }
                                                return opt
                                            })
                                            const newSelectedValue = formData.selectedValue.map((opt) => {
                                                if (opt.id === option.id) {
                                                    return { ...opt, question: e.target.value }
                                                }
                                                return opt
                                            })
                                            setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue })
                                        }}
                                        InputProps={{
                                            readOnly: disableText,
                                        }}
                                    />



                                    {!disableButtons && (<Button
                                        color='error'
                                        variant='outlined'
                                        onClick={() => handleDeleteOptions(option.id)}>
                                        <ClearIcon
                                            fontSize='small'
                                        />
                                    </Button>)}


                                </Stack>
                            ))
                            }
                        </Stack>
                        <Stack spacing={2} direction='row'>
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

export default StarRating