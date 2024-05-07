import React, { useState, useEffect } from 'react';
import { TextField, CssBaseline, Container, Box, Stack, Radio, Button } from '@mui/material';
import { uid } from 'uid';

const initialFormData = {
  id: uid(5),
  question: '',
  options: [
    {
      id: uid(5),
      rowQuestion: '',
      columns: [
        { id: uid(5), value: '' },
        { id: uid(5), value: '' },
      ],
    },
  ],
  columnTextField: [
    { id: uid(5), value: '' },
    { id: uid(5), value: '' },
  ],
  selectedValue: [{ question: '', answer: '', value: '' }],
  formType: 'MultiScalePoint',
};

const SelectMultiScalePoint = ({ onSaveForm, data, id, options }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (options) {
      setFormData(data);
    } else {
      setFormData({ ...formData, id });
    }
  }, [data]);

  const handleAddColumn = () => {
    setFormData({
      ...formData,
      columnTextField: [...formData.columnTextField, { id: uid(5), value: '' }],
      options: formData.options.map((row) => ({ ...row, columns: [...row.columns, { id: uid(5), value: '' }] })),
    });
  };

  const handleAddRow = () => {
    setFormData({
      ...formData,
      options: [...formData.options, {
        id: uid(5),
        rowQuestion: '',
        columns: formData.columnTextField.map((column) => ({ id: uid(5), value: '' })),

      }],
      selectedValue: [...formData.selectedValue, { question: '', answer: '', value: '' }],
    });
  };

  const handleSaveForm = () => {
    console.log('save handleSaveForm', formData);
    onSaveForm(formData);
  };

  const handleRadioChange = (rowIndex, columnIndex) => {
    const newSelectedValue = [...formData.selectedValue];
    newSelectedValue[rowIndex].value = columnIndex;

    newSelectedValue[rowIndex].question = formData.options[rowIndex].rowQuestion;

    console.log();

    newSelectedValue[rowIndex].answer = formData.columnTextField[columnIndex].value;
    setFormData({ ...formData, selectedValue: newSelectedValue });
  };

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
          />
          <Stack spacing={2} direction='row'>
            {formData.columnTextField.map((column) => (
              <TextField id="standard-basic" label="Standard" variant="standard" key={column.id} name='columnTextField' value={column.value}
                onChange={(e) => setFormData({ ...formData, columnTextField: formData.columnTextField.map((item) => item.id === column.id ? { ...item, value: e.target.value } : item) })}
              />
            ))}
          </Stack>

          <Stack spacing={2} className='w-full'>
            {formData.options.map((row, rowIndex) => (
              <Stack direction="row" spacing={2} key={row.id}>
                <TextField id="standard-basic" label="Standard" variant="standard" name='rowQuestion' value={row.rowQuestion}
                  onChange={(e) => setFormData({ ...formData, options: formData.options.map((item) => item.id === row.id ? { ...item, rowQuestion: e.target.value } : item) })}
                />
                <Stack direction="row" spacing={12}>
                  {row.columns.map((column, columnIndex) => {
                    console.log('column', column, 'columnIndex', columnIndex, 'rowIndex', rowIndex, 'formData.selectedValue[rowIndex]', formData.selectedValue[rowIndex], 'selectedValue', formData.selectedValue);
                    return (
                      <Radio
                        disabled
                        key={column.id}
                        checked={formData.selectedValue[rowIndex].value === columnIndex}
                        onChange={() => handleRadioChange(rowIndex, columnIndex)}
                      />
                    )
                  })
                  }
                </Stack>
              </Stack>
            ))}
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button onClick={handleAddColumn}>Add Column</Button>
            <Button onClick={handleAddRow}>Add Row</Button>
            <Button onClick={handleSaveForm}>Done Editing</Button>
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default SelectMultiScalePoint;
