import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import { uid } from 'uid';



const SelectSingleCheckBox = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext }) => {
  const [formData, setFormData] = React.useState({
    id: id,
    question: '',
    options: [
      { id: uid(5), value: '', rowQuestion: '' },
      { id: uid(5), value: '', rowQuestion: '' }

    ],
    selectedValue: [],
    formType: 'SingleCheckForm'
  });

  // const [debouncedValue, setDebouncedValue] = React.useState('');

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedValue(formData);
  //     onSaveForm(formData);
  //   }, 1000); // 500ms delay

  //   // Cleanup function to cancel the timeout if value changes before delay
  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [formData]);

  const handleAddOptions = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: uid(5), value: '', rowQuestion: '' }]
    })
  }

  const handleDeleteOptions = (id) => {
    // console.log(id,'id in delete');
    const newOptions = formData.options.filter(option => option.id !== id);
    // console.log(newOptions,'newOptions');
    setFormData({ ...formData, options: newOptions });
  }

  const handleCheckboxChange = (id) => {
    const newOptions = formData.options.map((option, idx) => {
      if (option.id === id) {
        if (formData.selectedValue.map((item) => item.id).includes(option.id)) {
          const newSelectedValue = formData.selectedValue.filter((item) => item.id !== option.id);
          console.log(newSelectedValue, 'newSelectedValue in checkbox');
          setFormData({ ...formData, selectedValue: newSelectedValue })
        } else {
          setFormData({ ...formData, selectedValue: [...formData.selectedValue, { ...option, question: formData.question, answer: option.value, index: idx + 1 }] })

        }
      }
    })
  };

  // const handleMandateForm = () => {
  //   console.log('mandate handleMandateForm');
  //   setFormData({ ...formData, formMandate: true })
  // }

  const handleSaveForm = () => {
    console.log('save handleSaveForm');
    onSaveForm(formData);
    onHandleNext()
  }
  useEffect(() => {
    console.log(data, 'data in select one choice form');
    if (options) {
      setFormData(data)
    }
    else {
      setFormData({ ...formData, id })
    }
  }, [data])
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
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Updated box shadow for a subtle effect
          borderRadius: 8, // Increased border radius for rounded corners
          p: 3, // Increased padding for inner content
        }} >
          <TextField
            fullWidth id="standard-basic"
            label={!disableText ? "Insert input" : ''}
            variant="standard"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            InputProps={{
              readOnly: disableText,
            }}
          />
          <Stack spacing={2}>
            {formData.options.map((opt) => {
              console.log(formData.selectedValue.includes(opt.id), 'selectedValue');
              return (
                <Stack direction="row" spacing={2} key={opt.id}>
                   <Checkbox
                    disabled={disableForm}
                    checked={formData.selectedValue.map((item) => item.id).includes(opt.id)}
                    onChange={() => handleCheckboxChange(opt.id)}

                  />
                  <TextField
                    fullWidth
                    id="standard-basic"
                    label={!disableText ? "Type Your Response Here" : ''}
                    variant="standard"
                    value={opt.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: formData.options.map((item) =>
                          item.id === opt.id
                            ? { ...item, value: e.target.value, rowQuestion: e.target.value }
                            : item
                        ),
                      })
                    }
                    InputProps={{
                      readOnly: disableText,
                    }}
                  />
                 

                  {!disableButtons && (<Button
                    color='error'
                    variant='outlined'
                    onClick={() => handleDeleteOptions(opt.id)}><ClearIcon
                      fontSize='small'
                    /></Button>)}
                </Stack>
              )
            })}

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

  )
}

export default SelectSingleCheckBox