import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Radio from '@mui/material/Radio';





const SelectOneChoiceForm = () => {
  const [formData, setFormData] = useState({
    question: '',
    options: [{ id: 1, text: '' }],
    selectedValue: ''
  });
  const handleChange = (event) => {
    console.log(event, 'radio event');
    // setSelectedValue(event.target.value);
  };

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
          <TextField fullWidth id="standard-basic" label="Standard" variant="standard" name='' value='' />

          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Radio onChange={handleChange} value={999} />
              <TextField fullWidth id="standard-basic" label="Standard" variant="standard" name='' value='' />
            </Stack>
          </Stack>
        </Box>
      </Container>
    </React.Fragment>

  )
}

export default SelectOneChoiceForm