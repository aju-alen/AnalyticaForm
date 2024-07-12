import React, { useState, useEffect } from 'react'
import { uid } from 'uid'
import { TextField, CssBaseline, Container, Box, Stack, Radio, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles'
import theme from '../utils/theme'
import ClearIcon from '@mui/icons-material/Clear'





const CommentBox = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {
    const [formData, setFormData] = useState({
        id: id,
        question: '',
        formMandate: false,
        options: [
            { question: '', id: uid(5), value: '' },

        ],
        selectedValue: [{ question: '', answer: '', value: '', index: '' }],
        formType: 'CommentBoxForm'
    });

    const [debouncedValue, setDebouncedValue] = useState('');

    const handleAddOptions = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { question: '', id: uid(5), value: '' }],
            selectedValue: [...formData.options, { question: '', answer: '', value: '', index: '' }]
        })
    }



    const handleDeleteOptions = (id) => {
        // console.log(id,'id in delete');
        const newOptions = formData.options.filter(option => option.id !== id);
        const newSelectedValue = formData.selectedValue.filter(option => option.index !== id);
        // console.log(newOptions,'newOptions');
        setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue });
    }

    const handleSaveForm = () => {
        console.log('save handleSaveForm');
        onSaveForm(formData);
        onHandleNext()
    }

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
    console.log(formData, 'formData in comment box form');
    return (
        <ThemeProvider theme={theme}>
            <React.Fragment>
                <CssBaseline />
                <Container sx={{ display: { xs: "none", md: "block" } }} >
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

                        {formData.options.map((option, idx) => {
                            console.log(JSON.stringify(option), 'option.question');

                            return (
                                <div className='w-full'>
                                    <Stack spacing={2} direction='row'>
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            label={!disableText ? "Insert input" : ''}
                                            variant="standard"
                                            name='question'
                                            value={option.question}
                                            onChange={(e) => setFormData({
                                                ...formData, options: formData.options.map((item, index) => {
                                                    if (option.id === item.id) {
                                                        return { ...item, question: e.target.value }
                                                    }
                                                    return item
                                                })
                                                ,
                                                selectedValue: formData.options.map((item, index) => {
                                                    if (option.id === item.id) {
                                                        return { ...item, question: e.target.value }
                                                    }
                                                    return item
                                                })
                                            })}
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

                                    <Container
                                        maxWidth='sm'
                                    >
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            label={!disableText ? "Comments" : ''}
                                            variant='filled'
                                            name='question'
                                            value={option.value}
                                            onChange={(e) => setFormData({
                                                ...formData, options: formData.options.map((item, index) => {
                                                    console.log(item, 'item in inner map');
                                                    if (option.id === item.id) {
                                                        return { ...item, value: e.target.value,answer:e.target.value }
                                                    }
                                                    return item
                                                })
                                                ,
                                                selectedValue: formData.options.map((item, index) => {
                                                    console.log(item, 'item in inner map');
                                                    if (option.id === item.id) {
                                                        console.log('when ID is same in inner map');
                                                        return { ...item, answer: e.target.value }
                                                    }
                                                    return item
                                                })
                                            })}
                                            InputProps={{
                                                readOnly: !disableText,
                                            }}
                                            multiline
                                            rows={2}
                                        />
                                    </Container>
                                </div>
                            )

                        })}
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

export default CommentBox