import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { uid } from 'uid';



const SelectSingleCheckBox = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext }) => {
  const [formData, setFormData] = React.useState({
    id: id,
    question: '',
    options: [
      { id: uid(5), value: '' },
      { id: uid(5), value: '' }

    ],
    selectedValue: [],
    formType: 'SingleCheckForm'
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

  const handleCheckboxChange = (id) => {
    const newOptions = formData.options.map((option) => {
      if (option.id === id) {
        if (formData.selectedValue.map((item) => item.id).includes(option.id)) {
          const newSelectedValue = formData.selectedValue.filter((item) => item.id !== option.id);
            console.log(newSelectedValue, 'newSelectedValue in checkbox');
          setFormData({ ...formData, selectedValue: newSelectedValue })
        } else {
          setFormData({ ...formData, selectedValue: [...formData.selectedValue, {...option,question:formData.question,answer:option.value}] })

        }
      }
    })
  };

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
          bgcolor: 'yellow',
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
          <TextField
            fullWidth id="standard-basic"
            label="Standard"
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
                    label="Standard"
                    variant="standard"
                    value={opt.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: formData.options.map((item) =>
                          item.id === opt.id
                            ? { ...item, value: e.target.value }
                            : item
                        ),
                      })
                    }
                    InputProps={{
                      readOnly: disableText,
                    }}
                  />
                  {!disableButtons && (<button onClick={() => handleDeleteOptions(opt.id)}>Delete</button>)}
                </Stack>
              )
            })}

          </Stack>
          {!disableButtons && (<button onClick={handleAddOptions}>Add</button>)}

          {<button onClick={handleSaveForm}>Done Editing</button>}

        </Box>
      </Container>
    </React.Fragment>

  )
}

export default SelectSingleCheckBox