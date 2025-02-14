import React, { useState, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Divider, Stack } from '@mui/material';
import { uid } from 'uid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Slider from '@mui/material/Slider';





const ConstantSum = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {

    const [formData, setFormData] = useState({
        id: id,
        question: '',
        formMandate: false,
        options: [
            { id: 'as3lo', value: '', rowQuestion: '' },
            { id: 'bll07', value: '', rowQuestion: '' },

        ],
        selectedValue: [
            { id: 'as3lo', question: '', answer: '', value: '', index: '' },
            { id: 'bll07', question: '', answer: '', value: '', index: '' }
        ],
        formType: 'ConstantSumForm'
    });
    const [value, setValue] = React.useState(30);
    const [sum, setSum] = React.useState(0);

    const handleSliderChange = (event, id) => {
        const newValue = event.target.value;

        const currentSum = formData.selectedValue.reduce((sum, opt) => sum + Number(opt.answer), 0);
        const oldValue = formData.selectedValue.find(opt => opt.id === id).answer;
        const newSum = currentSum - oldValue + newValue;

        if (newSum > 100) {
            console.log('Sum exceeds 100');
            return; // Prevent update if new sum exceeds 100
        }

        const newSelectedValue = formData.selectedValue.map((opt) => {
            if (opt.id === id) {
                return { ...opt, answer: newValue,index: newValue };
            }
            return opt;
        });

        const newOptions = formData.options.map((opt) => {
            if (opt.id === id) {
                return { ...opt, value: newValue };
            }
            return opt;
        });

        setFormData({ ...formData, selectedValue: newSelectedValue, options: newOptions });
    };

    const handleInputChange = (event, id) => {
        const newValue = Number(event.target.value);

        const currentSum = formData.selectedValue.reduce((sum, opt) => sum + Number(opt.answer), 0);
        const oldValue = formData.selectedValue.find(opt => opt.id === id).answer;
        const newSum = currentSum - oldValue + newValue;

        if (newSum > 100) {
            console.log('Sum exceeds 100');
            return; // Prevent update if new sum exceeds 100
        }

        const newSelectedValue = formData.selectedValue.map((opt) => {
            if (opt.id === id) {
                return { ...opt, answer: newValue,index: newValue };
            }
            return opt;
        });

        const newOptions = formData.options.map((opt) => {
            if (opt.id === id) {
                return { ...opt, value: newValue };
            }
            return opt;
        });

        setFormData({ ...formData, selectedValue: newSelectedValue, options: newOptions });
    };


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
        const id = uid(5);
        setFormData({
            ...formData,
            options: [...formData.options, { id: id, value: '' }],
            selectedValue: [...formData.selectedValue, { id: id, question: '', answer: '', value: '', index: '' }]
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
    console.log(formData, 'formData in constantSum form');


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
                    <TextField fullWidth id="standard-basic" size='small' label={!disableText ? "Insert input" : ''} variant="standard" name='question' value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        InputProps={{
                            readOnly: disableText,
                        }}
                        multiline
                    />

                    <Stack spacing={6} sx={{
                        width: '90%',
                        marginY: '1rem',
                        marginX: 'auto',
                    }} >
                        {formData.options.map((option) => (
                            <Stack direction="row" key={option.id}>

                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: { xs: 'column', md: 'row' },
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        '&:hover .delete-button': {
                                            visibility: 'visible',
                                        },
                                    }}
                                >

                                    <TextField
                                        fullWidth
                                        id="standard-basic"
                                        multiline
                                        placeholder={!disableText ? "Type Your Response Here" : ''}
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
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                fontSize: '0.8rem',
                                            },
                                            '& .MuiInput-underline:before': {
                                                borderBottom: 'none',
                                            },
                                            // '& .MuiInput-underline:after': {
                                            //   borderBottom: 'none',
                                            // },
                                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                borderBottom: 'none',
                                            },
                                            width: { xs: '100%', md: '30%' },
                                        }}
                                    />
                                    <Slider
                                        value={typeof value === 'number' ? option.value : 0}
                                        onChange={(event) => handleSliderChange(event, option.id)}
                                        aria-labelledby="input-slider"
                                        disabled={disableForm}
                                        sx={{
                                            width: { xs: '100%', md: '50%' },
                                        }}
                                        size='medium'
                                    />
                                    <TextField
                                        fullWidth
                                        type="number"
                                        size='small'
                                        value={formData.selectedValue.find(opt => opt.id === option.id).answer}
                                        onChange={(event) => handleInputChange(event, option.id)}
                                        inputProps={{ min: 0, max: 100 }}
                                        disabled={disableForm}
                                        sx={{
                                            width: { xs: '30%', md: '20%' },
                                        }}
                                    />
                                    <Divider orientation="horizontal" flexItem />




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
                            </Stack>
                        ))
                        }
                    </Stack>

                    <Stack spacing={2} direction='row'  sx={{
                            marginTop: '1rem',
                        }}>
                        {!disableButtons && (
                            <Button
                                onClick={handleAddOptions}
                                variant='outlined'
                                color="primary"
                                size="small"
                            >Add new row</Button>
                        )}

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

export default ConstantSum