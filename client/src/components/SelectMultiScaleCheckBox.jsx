import React, { useState, useEffect } from 'react'
import { TextField, CssBaseline, Container, Box, Stack, Button, Checkbox } from '@mui/material';
import { uid } from 'uid';
import ClearIcon from '@mui/icons-material/Clear';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const initialFormData = {
    id: uid(5),
    question: '',
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
            <Container maxWidth="lg">
                <Box sx={{
                    bgcolor: '',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    height: "100%",
                    mt: { xs: 4, md: 8 },
                    width: '100%',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Updated box shadow for a subtle effect
                    borderRadius: 8, // Increased border radius for rounded corners
                    p: 3, // Increased padding for inner content
                    overflowX: 'auto',
                }} >
                    <TextField
                        fullWidth id="standard-basic"
                        label={!disableText ? "Type Your Form Question" : ''} variant="standard"
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
                                        align="left"
                                        sx={{ width: 'auto ' }}
                                    ><h1 className=' text-white'>HeadingIdForRowAndColumn</h1></TableCell>
                                    {formData.columnTextField.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            sx={{ width: 'auto ', overflowX: 'auto', }}>
                                            <Stack direction="column" spacing={2} >
                                                <TextField
                                                    key={column.id}
                                                    id="standard-basic"
                                                    label={!disableText ? "Type Your Response Here" : ''}
                                                    variant="standard"
                                                    name='columnTextField'
                                                    value={column.value}
                                                    onChange={(e) => setFormData({ ...formData, columnTextField: formData.columnTextField.map((item) => item.id === column.id ? { ...item, value: e.target.value } : item) })}
                                                    InputProps={{
                                                        readOnly: disableText,
                                                    }}
                                                    fullWidth
                                                    multiline
                                                />
                                                {!disableButtons && (<Button
                                                    size='small'
                                                    color='error'
                                                    onClick={() => handleDeleteColumn(column.id)}
                                                >
                                                    <ClearIcon
                                                        fontSize='small'
                                                    />
                                                </Button>)}
                                            </Stack>
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
                                                label={!disableText ? "Type Your Sub Question" : ''}
                                                variant="standard"
                                                name='rowQuestion'
                                                value={row.rowQuestion}
                                                onChange={(e) => setFormData({ ...formData, options: formData.options.map((item) => item.id === row.id ? { ...item, rowQuestion: e.target.value } : item) })}
                                                InputProps={{
                                                    readOnly: disableText,
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
                                                />

                                            </TableCell>


                                        ))}
                                        <TableCell align="center">
                                            {!disableButtons && (<Button
                                                variant='outlined'
                                                color='error'
                                                onClick={() => handleDeleteRow(row.id)}>
                                                <ClearIcon
                                                    fontSize='small'
                                                />
                                            </Button>)}
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>





                    <Stack direction="row" spacing={2}>

                        {!disableButtons && (<Button
                            variant='outlined'
                            color="primary"
                            size='small'
                            onClick={handleAddColumn}>Add Column</Button>)}

                        <Button
                            variant='contained'
                            color="success"
                            onClick={handleSaveForm}>
                            {!disableButtons ? 'Save This Form' : 'Next Question'}
                        </Button>

                        {!disableButtons && (<Button
                            variant='outlined'
                            color="primary"
                            size='small'
                            onClick={handleAddRow}>Add Row</Button>)}
                    </Stack>
                </Box>
            </Container>
        </React.Fragment>

    )
}

export default SelectMultiScaleCheckBox