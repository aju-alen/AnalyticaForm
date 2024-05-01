import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { nanoid } from 'nanoid';




const SelectMultiPoint = ({onSaveForm}) => {
  const [formData, setFormData] = React.useState({
    id: nanoid(),
    question: '',
    options: [
      { id: 0, value: '' },
      { id: 1, value: '' }

    ],
    selectedValue: []
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
          <TextField fullWidth id="standard-basic" label="Standard" variant="standard"  value={formData.question} onChange={(e) => setFormData({...formData,question:e.target.value}) } />
          <Stack spacing={2}>
            {formData.options.map((opt) => (
               <Stack direction="row" spacing={2} key={opt.id}>
               <Checkbox disabled />
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
               />
             </Stack>
            ))}
           
          </Stack>
          <button onClick={handleAddOptions}>Add</button>
          <button onClick={handleSaveForm}>Done Editing</button>
        </Box>
      </Container>
    </React.Fragment>

  )
}

export default SelectMultiPoint