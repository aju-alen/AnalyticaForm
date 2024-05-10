import React, { useState, useEffect } from 'react';
import { TextField, CssBaseline, Container, Box, Stack, Radio, Button } from '@mui/material';
import { uid } from 'uid';

const initialFormData = {
  id: uid(5),
  question: '',
  options: [
    {
      id: "az56j",
      rowQuestion: '',
      columns: [
        { id: "a1f4d", value: '' },
        { id: "a2k9m", value: '' },
      ],
    },
  ],
  columnTextField: [
    { id: "a1f4d", value: '' },
    { id: "a2k9m", value: '' },
  ],
  selectedValue: [{ id: "az56j", question: '', answer: '', value: '' }],
  formType: 'MultiScalePoint',
};

const SelectMultiScalePoint = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (options) {
      setFormData(data);
    } else {
      setFormData({ ...formData, id });
    }
  }, [data]);

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
      selectedValue: [...formData.selectedValue, { id: genRowUid, question: '', answer: '', value: '' }],
    });
  };

  const handleDeleteRow = (id) => {
    const newOptions = formData.options.filter(row => row.id !== id);
    const newSelectedValue = formData.selectedValue.filter(row => row.id !== id);
    setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue });
  }


  const handleSaveForm = () => {
    console.log('save handleSaveForm', formData);
    onSaveForm(formData);
    onHandleNext();
  };

  const handleRadioChange = (rowIndex, columnIndex) => {
    const newSelectedValue = [...formData.selectedValue];
    newSelectedValue[rowIndex].value = columnIndex;

    newSelectedValue[rowIndex].question = formData.options[rowIndex].rowQuestion;

    newSelectedValue[rowIndex].answer = formData.columnTextField[columnIndex].value;
    setFormData({ ...formData, selectedValue: newSelectedValue });
  };
  console.log(formData, 'formData in select one choice form updatedddd');

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{
          bgcolor: 'lightgreen',
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
                      <Radio
                        disabled={disableForm}
                        key={column.id}
                        checked={formData.selectedValue[rowIndex].value === columnIndex}
                        onChange={() => handleRadioChange(rowIndex, columnIndex)}
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

export default SelectMultiScalePoint;
