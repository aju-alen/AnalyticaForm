import React, { useState, useEffect } from 'react'
import { TextField, CssBaseline, Container, Box, Stack, Button, Checkbox } from '@mui/material';
import { uid } from 'uid';
import ClearIcon from '@mui/icons-material/Clear';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const initialFormData = {
    id: uid(5),
    question: '',
    formMandate: false,
    options: [
        {
            id: "ak52b",
            rowQuestion: '',
            columns: [
                { id: "a9m41", value: '', checked: false },
                { id: "n9hn0", value: '', checked: false },
            ],
        },
    ],
    columnTextField: [
        { id: "a9m41", value: '' },
        { id: "n9hn0", value: '' },
    ],
    selectedValue: [

    ],
    formType: 'MultiScaleCheckBox',
};

const SelectMultiScaleCheckBox = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [debouncedValue, setDebouncedValue] = useState('');
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(formData);
            onSaveForm(formData);
            // onSaveIndicator('Saved')
        }, 2000); // 500ms delay

        // Cleanup function to cancel the timeout if value changes before delay
        return () => {
            // onSaveIndicator('Not Saaved')
            clearTimeout(handler);
        };
    }, [formData]);


    const handleAddColumn = () => {
        const genNewUid = uid(5);
        setFormData({
            ...formData,
            columnTextField: [...formData.columnTextField, { id: genNewUid, value: '' }],
            options: formData.options.map((row) => ({ ...row, columns: [...row.columns, { id: genNewUid, value: '' }] })),
        });
    };

    const handleDeleteColumn = (id) => {
        console.log(formData, 'formData before deleting');
        const newColumnTextField = formData.columnTextField.filter(column => column.id !== id);
        const newOptions = formData.options.map((row) => ({ ...row, columns: row.columns.filter(column => column.id !== id) }));
        setFormData({ ...formData, columnTextField: newColumnTextField, options: newOptions });
    }

    const handleAddRow = () => {
        const genRowUid = uid(5);
        setFormData({
            ...formData,
            options: [...formData.options, {
                id: genRowUid,
                rowQuestion: '',
                columns: formData.columnTextField.map((column) => ({ id: column.id, value: '' })),

            }],
        });
    };

    const handleDeleteRow = (id) => {
        const newOptions = formData.options.filter(row => row.id !== id);
        const newSelectedValue = formData.selectedValue.filter(row => row.id !== id);
        setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue });
    }

    const handleCheckBoxChange = (rowID, columnID, colIdx) => {
        let newSelectedValue = [...formData.selectedValue];

        const question = formData.options.find((item) => item.id === rowID).rowQuestion;
        const answer = formData.columnTextField.find(item => item.id === columnID).value;

        const index = newSelectedValue.findIndex((item) => item.rowId === rowID && item.colId === columnID);
        console.log(colIdx, 'index in checkbox change');

        if (index === -1) {
            newSelectedValue.push({ rowId: rowID, colId: columnID, value: true, question: question, answer: answer, index: colIdx + 1 });
        }
        else {
            newSelectedValue.splice(index, 1);
        }

        setFormData({ ...formData, selectedValue: newSelectedValue });
    }

    const handleSaveForm = () => {
        console.log('save handleSaveForm', formData);

        onSaveForm(formData);
        onHandleNext();
    };

    const handleMandateForm = () => {
        console.log('mandate handleMandateForm');
        setFormData({ ...formData, formMandate: true })
    }

    useEffect(() => {
        if (options) {
            setFormData(data);
        } else {
            setFormData({ ...formData, id });
        }
    }, [data]);

    console.log(formData, 'formData in multi scale point');

    return (
        <React.Fragment>
            <CssBaseline />
            <Container sx={{ display: { xs: "", md: "block" } }} maxWidth='xl' >
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
                    <TextField
                        fullWidth
                        multiline
                        id="standard-basic"
                        label={!disableText ? "Insert input" : ''} variant="standard"
                        name='question'
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        InputProps={{
                            readOnly: disableText,
                        }}
                    />

                    <div style={{ width: '100%' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        colSpan={1}
                                    >
                                    </TableCell>
                                    {formData.columnTextField.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            sx={{ width: 'auto ', overflowX: 'auto', position: 'relative', }} >

                                            <Box
                                                sx={{

                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    '&:hover .delete-button': {
                                                        visibility: 'visible',
                                                    },
                                                }}
                                            >
                                                <TextField
                                                    key={column.id}
                                                    id="standard-basic"
                                                    placeholder={!disableText ? "Type Your Response Here" : ''}
                                                    variant="standard"
                                                    name='columnTextField'
                                                    value={column.value}
                                                    onChange={(e) => setFormData({ ...formData, columnTextField: formData.columnTextField.map((item) => item.id === column.id ? { ...item, value: e.target.value } : item) })}
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
                                                        minWidth: { xs: 100, md: 200 },
                                                    }}
                                                    fullWidth
                                                    multiline
                                                />
                                                {!disableButtons && (
                                                    <HighlightOffIcon fontSize="small" className="delete-button"
                                                        color="error"
                                                        variant="text"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '0%',
                                                            left: '0%',
                                                            right: '0%',
                                                            bottom: '0%',
                                                            visibility: 'hidden',
                                                            transition: 'visibility 0.1s ease-in-out',

                                                        }}
                                                        onClick={() => handleDeleteColumn(column.id)} />

                                                )}
                                            </Box>
                                        </TableCell>
                                    ))}

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formData.options.map((row) => (
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ width: '30%' }}>

                                            <TextField
                                                id="standard-basic"
                                                multiline
                                                placeholder={!disableText ? "Type Your Sub Question" : ''}
                                                variant="standard"
                                                name='rowQuestion'
                                                value={row.rowQuestion}
                                                onChange={(e) => setFormData({ ...formData, options: formData.options.map((item) => item.id === row.id ? { ...item, rowQuestion: e.target.value } : item) })}
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
                                                    minWidth: { xs: 100, md: 200 },
                                                }}

                                            />

                                        </TableCell>
                                        {row.columns.map((column, idx) => (
                                            <TableCell key={column.id} align='center' >
                                                <Checkbox
                                                    disabled={disableForm}
                                                    key={column.id}
                                                    onChange={() => handleCheckBoxChange(row.id, column.id, idx)}
                                                    checked={formData.selectedValue.some((item) => item.rowId === row.id && item.colId === column.id)}
                                                    size='small'
                                                />

                                            </TableCell>


                                        ))}
                                        <TableCell align="center">
                                            {!disableButtons && (<Button
                                                variant='text'
                                                color='error'
                                                onClick={() => handleDeleteRow(row.id)}>
                                                <HighlightOffIcon fontSize="small" />
                                            </Button>)}
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {!disableButtons && (<Button
                            variant='outlined'
                            color="primary"
                            size='small'
                            onClick={handleAddRow}>Add Row</Button>)}
                    </div>





                    <Stack direction="row" spacing={2}>

                        {!disableButtons && (<Button
                            variant='outlined'
                            color="primary"
                            size='small'
                            onClick={handleAddColumn}>Add Column</Button>)}

                        {disableButtons && <Button
                            variant='contained'
                            color="success"
                            onClick={handleSaveForm}>
                            Next Question
                        </Button>}

                        {!disableButtons && <Button
                            variant='contained'
                            color="primary"
                            onClick={handleMandateForm}>
                            Mandate This Form
                        </Button>}


                    </Stack>
                </Box>
            </Container>
        </React.Fragment>

    )
}

export default SelectMultiScaleCheckBox