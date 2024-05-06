import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Radio from '@mui/material/Radio';
import { uid } from 'uid';


const SelectMultiScalePoint = () => {
    const [formData, setFormData] = React.useState({
        
        question: '',
        options: [
          { id: uid(5), value: '' },
          { id: uid(5), value: '' }
    
        ],
        selectedValue: [],
        formType: 'SingleCheckForm'
        });

    return (
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth="lg">
            <Box sx={{
              bgcolor: 'green',
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
              <TextField fullWidth id="standard-basic" label="Standard" variant="standard" name='question' 
              />
    
              <Stack spacing={2}>
              
      <Stack direction="row" spacing={2} >
        <Radio disabled/>
        <TextField
          fullWidth
          id="standard-basic"
          label="Standard"
          variant="standard"
          
          
        />
          <button >Delete</button>
      </Stack>
                </Stack>
              <button >Add</button>
              <button >Done Editing</button>
             
            </Box>
          </Container>
        </React.Fragment>
    
      )
}

export default SelectMultiScalePoint