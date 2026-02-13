import React, { useState, useEffect } from 'react'
import { uid } from 'uid'
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack,Radio, useTheme, useMediaQuery } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';



const iconMapping = {
  ThumbDown: <ThumbDownIcon
    color='error'
    sx={{ 
      fontSize: {xs: 30, sm: 40, md: 50},
      ":hover": { backgroundColor: '#99FFDF' }, 
      borderRadius: 3, 
      p: {xs: 0.5, md: 1}
    }}
  />,

  ThumbUp: <ThumbUpIcon 
    color='success'
    sx={{ 
      fontSize: {xs: 30, sm: 40, md: 50},
      ":hover": { backgroundColor: '#99FFDF' }, 
      borderRadius: 3, 
      p: {xs: 0.5, md: 1}
    }}
  />,
};



const ThumbsUpDown = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {

  const [formData, setFormData] = useState({
    id: uid(5),
  question: '',
  options: [
    {
      id: "azun9",
      rowQuestion: '',
      columns: [
        { id: "a1f4d", value: 'Love It',icon:"LI"},
    { id: "a2k9m", value: 'Hate It',icon:"HI"},
      ],
    },
  ],
  columnTextField: [
    { id: "a1f4d", value: 'Love It',icon:"LI" },
    { id: "a2k9m", value: 'Hate It',icon:"HI" },
   
  ],
  selectedValue: [{ id: "azun9", question: '', answer: '', value: '', index: '' }],
    formType: 'ThumbUpDownForm'
  });
  const [debouncedValue, setDebouncedValue] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const toolbarSetting = disableText ? false : {
    container: isMobile && !disableText ? [
      // Mobile toolbar configuration
      ['bold', 'italic', 'underline'],
      ['clean']
      ] :  [
        // Desktop toolbar configuration
        ['bold', 'italic', 'underline', 'strike'],
        ['clean']
      ]
  }
  // Customize toolbar options based on screen size
  const modules = {
    toolbar: toolbarSetting,
    clipboard: {
      matchVisual: false
    }
  };

  // Allowed formats
  const formats = [
    'bold', 'italic', 'underline', 'strike',
  ];

  // Helper function to clean HTML content
  const cleanHTMLContent = (htmlString) => {
    if (!htmlString) return '';
    
    // Create a temporary div
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // Get text content and clean up whitespace
    let cleanText = tempDiv.textContent || tempDiv.innerText || '';
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    
    return cleanText;
  };

  // Update the ReactQuill onChange handler
  const handleQuillChange = (content) => {
    setFormData({
      ...formData,
      quilText: content, // Store the HTML formatted text
      question: cleanHTMLContent(content) // Store the clean text
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(formData);
      onSaveForm(formData);
      // onSaveIndicator('Saved')
    }, 1000); // 500ms delay

    // Cleanup function to cancel the timeout if value changes before delay
    return () => {
      // onSaveIndicator('Not Saaved')
      clearTimeout(handler);
    };
  }, [formData]);

  const handleSaveForm = () => {
    console.log('save handleSaveForm');
    onSaveForm(formData);
    onHandleNext()
  }

  // const handleMandateForm = () => {
  //   console.log('mandate handleMandateForm');
  //   setFormData({ ...formData, formMandate: true })
  // }

  const handleAddRow = () => {
    const genRowUid = uid(5);
    setFormData({
      ...formData,
      options: [...formData.options, {
        id: genRowUid,
        rowQuestion: '',
        columns: formData.columnTextField?.map((column) => ({ id: column.id, value: '' })),

      }],
      selectedValue: [...formData.selectedValue, { id: genRowUid, question: '', answer: '', value: '', index: '' }],
    });
  };

  const handleRadioChange = (rowIndex, columnIndex) => {
    const newSelectedValue = [...formData.selectedValue];
    newSelectedValue[rowIndex].value = columnIndex;
    newSelectedValue[rowIndex].index = columnIndex + 1;


    newSelectedValue[rowIndex].question = formData.options[rowIndex].rowQuestion;

    newSelectedValue[rowIndex].answer = formData.columnTextField[columnIndex].value;
    setFormData({ ...formData, selectedValue: newSelectedValue });
  };

  useEffect(() => {
    if (options) {
      setFormData(data);
    } else {
      setFormData({ 
        ...formData, 
        id,
        quilText: data?.quilText || '',
        question: data?.question || '',
        formMandate: data?.formMandate ?? formData?.formMandate
      });
    }
  }, [data]);
  // console.log(id,'id in smiley rating');
  console.log(formData, 'formData in ThumbUpDown form');

  return (
    <React.Fragment>
    <CssBaseline />
    <Container maxWidth="xl" sx={{ px: {xs: 1, sm: 2, md: 3} }}>
      <Box sx={{
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexGrow: 1,
        height: "100%",
        mt: { xs: 4, md: 0 },
        width: '100%',
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)', // Updated box shadow for a subtle effect
        borderRadius: 2, // Increased border radius for rounded corners
        p: { xs: 1, sm: 1.5, md: 2 },
        overflowX: 'auto',
        border: '2px solid #f0fbf0', // Added border for more distinction
        transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out', // Added transition effect for box shadow and transform
        position: 'relative', // Make sure the box is positioned relative for the pseudo-element
        backgroundColor: '#F4F3F6',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '0%', // Set initial left position for the line
          transform: 'translateX(-50%)',
          height: '100%',
          width: '12px', // Adjust the width of the line
          bgcolor: '#1976d2', // Change to your desired color
          opacity: 0, // Initially hidden
          transition: 'opacity 0.3s ease-in-out', // Smooth transition for the line
        },

        '&:hover::before': {
          opacity: 1, // Make the lines visible on hover
        },
        '&:hover': {
          boxShadow: '0px 1px rgba(0, 0, 0, 0.2)', // Updated box shadow on hover
          transform: 'scale(0.98)', // Slightly scale down the box to create an inward effect
          backgroundColor: '#F4FFF8',
        },
      }}>
        <Container sx={{ 
          display: { xs: "none", md: "block" },
          px: { md: 2, lg: 3 }
        }} maxWidth='xl'>
             <div style={{ marginBottom: '20px', width: '100%' }}>
              {!disableText && (
                <label style={{ 
                  fontSize: '0.75rem', 
                  color: 'rgba(0, 0, 0, 0.6)', 
                  marginBottom: '8px',
                  display: 'block' 
                }}>
                  Insert input *
                </label>
              )}
             <ReactQuill
                theme="snow"
                value={formData.quilText}
                onChange={handleQuillChange}
                readOnly={disableText}
                modules={modules}
                formats={formats}
                className={`ql-container ql-snow`}
                style={{
                  width: '100%',
                  border: '0px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                }}
              />
              <Divider />
            </div>
         
         <div style={{ width: '100%' }}>
            <Table
              sx={{ 
                minWidth: { md: 650, lg: 800 },
                "& .MuiTableCell-root": {
                  px: { md: 1, lg: 2 },
                  py: { md: 1, lg: 1.5 }
                }
              }}
              aria-label="simple table">
              <TableHead>

                <TableRow>
                  <TableCell
                    colSpan={1}
                  ></TableCell>
                  {formData.columnTextField.map((column) => (
                      
                    <TableCell
                      key={column.id}
                      sx={{ width: 'auto ', overflowX: 'auto', position: 'relative', }}
                    >

                      <Box
                        sx={{

                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          width: '100%',
                          '&:hover .delete-button': {
                            visibility: 'visible',
                          },
                        }}
                      >
                         { column.icon === 'LI' ? iconMapping.ThumbUp : iconMapping.ThumbDown}
                        <TextField
                          key={column.id}
                          id="standard-basic"
                          placeholder={!disableText ? "Type Your Response Here" : ''} variant="standard"
                          name='columnTextField'
                          value={column.value}
                          onChange={(e) => setFormData({ ...formData, columnTextField: formData.columnTextField.map((item) => item.id === column.id ? { ...item, value: e.target.value } : item) })}
                          InputProps={{
                            readOnly: disableText,
                            inputProps: {
                              style: { textAlign: 'center' }, // Center the text
                            },
                          }}
                          sx={{
                            '& .MuiInputBase-root': {
                              fontSize: '0.8rem',
                            },
                            '& .MuiInput-underline:before': {
                              borderBottom: 'none',
                            },
                            // '& .MuiInput-underline:after': {
                            //   borderBottom: 'none',
                            // },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                              borderBottom: 'none',
                            },
                            minWidth: { xs: 100, md: 100 },
                          }}
                          fullWidth
                          multiline
                        />

                        {!disableButtons && (
                          <HighlightOffIcon fontSize="small" className="delete-button"
                            color="error"
                            variant="text"
                            sx={{
                              position: 'absolute',
                              top: '0%',
                              left: '0%',
                              right: '0%',
                              bottom: '0%',
                              visibility: 'hidden',
                              transition: 'visibility 0.1s ease-in-out',

                            }}
                            onClick={() => handleDeleteColumn(column.id)} />

                        )}
                      </Box>
                    </TableCell>

                  ))}
                </TableRow>
              </TableHead>
              <TableBody >
                {formData.options.map((row, rowIndex) => (
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    key={row.id}
                  >


                    <TableCell component="th" scope="row" sx={{ width: '30%' }}>
                      <TextField
                        id="standard-basic"
                        placeholder={!disableText ? "Type Your Sub Question" : ''}
                        variant="standard"
                        name='rowQuestion'
                        value={row.rowQuestion}
                        onChange={(e) => setFormData({ ...formData, options: formData.options.map((item) => item.id === row.id ? { ...item, rowQuestion: e.target.value } : item) })}
                        InputProps={{
                          readOnly: disableText,
                        }}
                        sx={{
                          '& .MuiInputBase-root': {
                            fontSize: '0.8rem',
                          },
                          '& .MuiInput-underline:before': {
                            borderBottom: 'none',
                          },
                          // '& .MuiInput-underline:after': {
                          //   borderBottom: 'none',
                          // },
                          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottom: 'none',
                          },
                          minWidth: { xs: 100, md: 200 },
                        }}
                        multiline
                      />
                    </TableCell>

                    {row.columns.map((column, columnIndex) =>
                      <TableCell key={column.id} align='center' >
                        <Radio
                          disabled={disableForm}
                          key={column.id}
                          checked={formData.selectedValue[rowIndex].value === columnIndex}
                          onChange={() => handleRadioChange(rowIndex, columnIndex)}
                          size='small'
                        />
                      </TableCell>
                    )}
                    <TableCell align="center">
                      {!disableButtons && (<Button
                        variant='text'
                        color='error'
                        onClick={() => handleDeleteRow(row.id)}>
                        <HighlightOffIcon fontSize="small" />
                      </Button>)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!disableButtons && (<Button
              variant='outlined'
              color="primary"
              size='small'
              onClick={handleAddRow}>Add Row</Button>)}
          </div>
       
            <Stack spacing={2} direction='row'  sx={{
                            marginTop: '1rem',
                        }}>
            {disableButtons && <Button
              variant='contained'
              color="success"
              onClick={handleSaveForm}>
              Next Question
            </Button>}
            </Stack>
            </Container>
            <Container sx={{ 
              display: { xs: "block", md: "none" },
              px: { xs: 1, sm: 2 }
            }} maxWidth='xl'>
            <TextField fullWidth id="standard-basic" label={!disableText ? "Insert input" : ''} variant="standard" name='question' value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              InputProps={{
                readOnly: disableText,
              }}
              multiline
            />
            {formData.options.map((row, rowIndex) => (

               <Accordion sx={{
                 my: { xs: 1, sm: 1.5 },
                 "& .MuiAccordionSummary-content": {
                   fontSize: { xs: '0.875rem', sm: '1rem' }
                 }
               }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {row.rowQuestion}
        </AccordionSummary>
              
              {formData.columnTextField.map((column, columnIndex) =>(
        <AccordionDetails sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          '&:hover .delete-button': {
            visibility: 'visible',
          },
        }} >
          <Radio
                          disabled={disableForm}
                          key={column.id}
                          checked={formData.selectedValue[rowIndex].value === columnIndex}
                          onChange={() => handleRadioChange(rowIndex, columnIndex)}
                          size='small'
                        />
          <Box 
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          width: '100%',
                          '&:hover .delete-button': {
                            visibility: 'visible',
                          },
                        }}
          >
          { column.icon === 'LI' ? iconMapping.ThumbUp : iconMapping.ThumbDown}
          <TextField
                          key={column.id}
                          id="standard-basic"
                          placeholder={!disableText ? "Type Your Response Here" : ''} variant="standard"
                          name='columnTextField'
                          value={column.value}
                          onChange={(e) => setFormData({ ...formData, columnTextField: formData.columnTextField.map((item) => item.id === column.id ? { ...item, value: e.target.value } : item) })}
                          InputProps={{
                            readOnly: disableText,
                            inputProps: {
                              style: { textAlign: 'center' }, // Center the text
                            },
                          }}
                          sx={{
                            '& .MuiInputBase-root': {
                              fontSize: '0.8rem',
                            },
                            '& .MuiInput-underline:before': {
                              borderBottom: 'none',
                            },
                            // '& .MuiInput-underline:after': {
                            //   borderBottom: 'none',
                            // },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                              borderBottom: 'none',
                            },
                            minWidth: { xs: 100, md: 100 },
                          }}
                          fullWidth
                          multiline
                        />
                        </Box>
          </AccordionDetails>
              ))}

      </Accordion>))}
      <Stack spacing={2} direction='row'  sx={{
                            marginTop: '1rem',
                        }}>
            {disableButtons && <Button
              variant='contained'
              color="success"
              onClick={handleSaveForm}>
              Next Question
            </Button>}
            </Stack>

            </Container>
          </Box>
        </Container>
      </React.Fragment>


  );
}

export default ThumbsUpDown


