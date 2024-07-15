import React, { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import { uid } from 'uid';
import theme from '../utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
const dateArray = Array.from({ length: 31 }, (_, i) => i + 1);
const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const yearArray = Array.from({ length: 100 }, (_, i) => 1970 + i);


const DateTime = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {
    const [month, setMonth] = React.useState('');
    const [date, setDate] = React.useState('');
    const [year, setYear] = React.useState('');

    const [formData, setFormData] = useState({
        id: id,
        question: '',
        formMandate: false,
        options: [
            { id: uid(5), value: '' },
            { id: uid(5), value: '' }

        ],
        selectedValue: [{ question: '', answer: '', value: '', index: '' }],
        formType: 'DateTimeForm'
    });

    const handleChangeMonth = (event) => {
        setMonth(event.target.value);
        setFormData({ ...formData, selectedValue: [{ question: '', answer: `${date}-${event.target.value}-${year}`, value:'', index: '' }] })
    };

    const handleChangeDate = (event) => {
        setDate(event.target.value);
        setFormData({ ...formData, selectedValue: [{ question: '', answer: `${event.target.value}-${month}-${year}`, value:'', index: '' }]})
    };

    const handleChangeYear = (event) => {
        setYear(event.target.value);
        setFormData({ ...formData, selectedValue: [{ question: '', answer: `${date}-${month}-${event.target.value}`, value:'', index: '' }]})
    };


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
    console.log(formData,'formdata in DateTime form');
    console.log(date, 'date',month,'month',year,'year');

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
                            onChange={(e) => {
                                setFormData({ ...formData, question: e.target.value })
                            }}
                            InputProps={{
                                readOnly: disableText,
                            }}
                        />
                        <Stack spacing={4} direction='row'  dis>
                        <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Date</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={date}
                                        label="Age"
                                        onChange={handleChangeDate}
                                        variant='standard'
                                        disabled={disableForm}
                                    >
                                        {dateArray.map((date) => (`${date}`.length === 1 ? `0${date}` : `${date}`)).map((date) => (
                                            <MenuItem value={date}>{date}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                </Box>
                                
                                <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Month</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={month}
                                        label="Age"
                                        onChange={handleChangeMonth}
                                        variant='standard'
                                        disabled={disableForm}
                                    >
                                        {monthArray.map((month) => (
                                            <MenuItem value={month}>{month}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                </Box>

                                <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Year</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={year}
                                        label="Age"
                                        onChange={handleChangeYear}
                                        variant='standard'
                                        disabled={disableForm}
                                    >
                                        {yearArray.map((year) => (
                                            <MenuItem value={year}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                </Box>
                            
                        </Stack>

                        <Stack spacing={2} direction='row'>

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

export default DateTime