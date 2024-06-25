import React, {useEffect, useState} from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';



const SurveyIntro = ({disableText,disableButtons,onSaveForm,data}) => {
    const [surveyIntroduction,setSurveyIntroduction ] = useState('');
    const handleSaveForm = () => {
        console.log('save handleSaveForm');
        onSaveForm(surveyIntroduction);
        onHandleNext()
      }

      useEffect(() => {
        setSurveyIntroduction(data)
      }
        , [data])
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
          <TextField fullWidth id="standard-basic" label={!disableText?"Type Your Form Introduction" : ''} variant="standard" name='question' value={surveyIntroduction}
            onChange={(e) => setSurveyIntroduction(e.target.value)}
            InputProps={{
              readOnly: disableText,
            }}
            multiline
          />
           <Button
              variant='contained'
              color="success"
              onClick={handleSaveForm}>
              {!disableButtons? 'Save This Form' : 'Next Question'}
            </Button>
          </Box>    
        </Container>
        </React.Fragment>

  )
}

export default SurveyIntro