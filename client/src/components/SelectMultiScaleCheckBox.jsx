import React, { useState, useEffect } from 'react'
import { TextField, CssBaseline, Container, Box, Stack, Button, Checkbox } from '@mui/material';
import { uid } from 'uid';

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

    const handleCheckBoxChange = (rowID, columnID) => {
        let newSelectedValue = [...formData.selectedValue];

        const question = formData.options.find((item) => item.id === rowID).rowQuestion;
        const answer = formData.columnTextField.find(item => item.id === columnID).value;

        const index = newSelectedValue.findIndex((item) => item.rowId === rowID && item.colId === columnID);

        if (index === -1) {
            newSelectedValue.push({ rowId: rowID, colId: columnID, value: true, question: question, answer: answer });
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
                    bgcolor: 'lightblue',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    height: "100%",
                    mt: { xs: 4, md: 8 },
                    width: '100%',
                    boxShadow: 3,
                    borderRadius: 1,
                    p: 2,
                }} >
                    <TextField fullWidth id="standard-basic" label="Standard" variant="standard" name='question' value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        InputProps={{
                            readOnly: disableText,
                        }}
                    />
                    <Stack spacing={2} direction='row'>
                        {formData.columnTextField.map((column) => (
                            <Stack direction="column" spacing={2} key={column.id}>
                                <TextField id="standard-basic" label="Standard" variant="standard" key={column.id} name='columnTextField' value={column.value}
                                    onChange={(e) => setFormData({ ...formData, columnTextField: formData.columnTextField.map((item) => item.id === column.id ? { ...item, value: e.target.value } : item) })}
                                    InputProps={{
                                        readOnly: disableText,
                                    }}
                                />
                                <Button
                                    size='small'
                                    onClick={() => handleDeleteColumn(column.id)}
                                >Delete Column</Button>
                            </Stack>
                        ))}
                    </Stack>

                    <Stack spacing={2} className='w-full'>
                        {formData.options.map((row, rowIndex) => (
                            <Stack direction="row" spacing={2} key={row.id}>
                                <TextField id="standard-basic" label="Standard" variant="standard" name='rowQuestion' value={row.rowQuestion}
                                    onChange={(e) => setFormData({ ...formData, options: formData.options.map((item) => item.id === row.id ? { ...item, rowQuestion: e.target.value } : item) })}
                                    InputProps={{
                                        readOnly: disableText,
                                    }}
                                />
                                <Stack direction="row" spacing={12}>
                                    {row.columns.map((column, columnIndex) => {
                                        return (
                                            <Checkbox
                                                disabled={disableForm}
                                                key={column.id}
                                                onChange={() => handleCheckBoxChange(row.id, column.id)}
                                                checked={formData.selectedValue.some((item) => item.rowId === row.id && item.colId === column.id)}
                                            />
                                        )
                                    })
                                    }
                                </Stack>
                                <Button onClick={() => handleDeleteRow(row.id)}>Delete Row</Button>
                            </Stack>
                        ))}
                    </Stack>

                    <Stack direction="row" spacing={2}>

                        {!disableButtons && (<Button onClick={handleAddColumn}>Add Column</Button>)}

                        {!disableButtons && (<Button onClick={handleAddRow}>Add Row</Button>)}
                        {<Button onClick={handleSaveForm}>Done Editing</Button>}
                    </Stack>
                </Box>
            </Container>
        </React.Fragment>

    )
}

export default SelectMultiScaleCheckBox