import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import Radio from '@mui/material/Radio';
import ClearIcon from '@mui/icons-material/Clear';
import { uid } from 'uid';





const SelectSingleRadio = ({ onSaveForm, data, id, options,disableForm,disableText,disableButtons,onHandleNext }) => {
  const [formData, setFormData] = useState({
    id: id,
    question: '',
    formMandate: false,
    options: [
      { id: uid(5), value: '' },
      { id: uid(5), value: '' }

    ],
    selectedValue: [{ question: '', answer: '', value: '' }],
    formType: 'SinglePointForm'
  });

  const handleAddOptions = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: uid(5), value: '' }]
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

  const handleMandateForm = () => {
    console.log('mandate handleMandateForm');
    setFormData({ ...formData, formMandate: true })
  }

  const handleRadioChange = (id) => {
    const newOptions = formData.options.map((option) => {
      if (option.id === id) {

        setFormData({ ...formData, selectedValue: [{ answer: option.value, question: formData.question }] })

      }
    })
  }

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
          boxShadow: 3,
          borderRadius: 1,
          p: 2,
        }} >
          <TextField fullWidth id="standard-basic" label={!disableText?"Type Your Form Question" : ''} variant="standard" name='question' value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            InputProps={{
              readOnly: disableText,
            }}
          />

          <Stack spacing={2}>
            {formData.options.map((option) => (
              <Stack direction="row" spacing={2} key={option.id}>
                <TextField
                  fullWidth
                  id="standard-basic"
                  label={!disableText?"Type Your Response Here" : ''}
                  variant="standard"
                  name={option.text}
                  value={option.value}
                  onChange={(e) => {
                    const newOptions = formData.options.map((opt) => {
                      if (opt.id === option.id) {
                        return { ...opt, value: e.target.value }
                      }
                      return opt
                    })
                    setFormData({ ...formData, options: newOptions })
                  }}
                  InputProps={{
                    readOnly: disableText,
                  }}
                />
                <Radio
                  disabled={disableForm}
                  onChange={() => handleRadioChange(option.id)}
                  checked={formData.selectedValue[0].answer === option.value} />


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
              {!disableButtons? 'Save This Form' : 'Next Question'}
            </Button>
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

export default SelectSingleRadio

