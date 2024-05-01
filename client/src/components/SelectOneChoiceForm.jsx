import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Radio from '@mui/material/Radio';
import { nanoid } from 'nanoid';





const SelectOneChoiceForm = ({onSaveForm}) => {
  const [formData, setFormData] = useState({
    id: nanoid(),
    question: '',
    options: [
      { id: 0, value: '' },
      { id: 1, value: '' }

    ],
    selectedValue: ''
  });
  
  const handleAddOptions = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: formData.options.length, value: '' }]
    })
  }
  
  const handleSaveForm = () => {
    onSaveForm(formData);

  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{
          bgcolor: 'orange',
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

          <Stack spacing={2}>
          {formData.options.map((option) => (
  <Stack direction="row" spacing={2} key={option.id}>
    <Radio disabled/>
    <TextField
      fullWidth
      id="standard-basic"
      label="Standard"
      variant="standard"
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
    />
  </Stack>
))
}
            </Stack>
          <button onClick={handleAddOptions}>Add</button>
          <button onClick={handleSaveForm}>Done Editing</button>
        </Box>
      </Container>
    </React.Fragment>

  )
}

export default SelectOneChoiceForm

// {formData.options.map((option) => (
//   <Stack direction="row" spacing={2} key={option.id}>
//     <Radio
//       value={option.value}
//       onChange={(e) => setFormData({ ...formData, selectedValue: e.target.value })}
//       checked={formData.selectedValue === option.value}/>
    

//     <TextField
//       fullWidth
//       id="standard-basic"
//       label="Standard"
//       variant="standard"
//       name={option.text}
//       value={option.value}
//       onChange={(e) => {
//         const newOptions = formData.options.map((opt) => {
//           if (opt.id === option.id) {
//             return { ...opt, value: e.target.value }
//           }
//           return opt
//         })
//         setFormData({ ...formData, options: newOptions })
//       }}
//     />
//   </Stack>
// ))
// }