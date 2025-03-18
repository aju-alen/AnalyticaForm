import React, { useState, useEffect } from 'react';
import { TextField, CssBaseline, Container, Box, Stack, Radio, Button } from '@mui/material';
import { uid } from 'uid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTheme, useMediaQuery } from '@mui/material';
import Divider from '@mui/material/Divider';


const iconMapping = {
  SentimentVeryDissatisfiedIcon: <SentimentVeryDissatisfiedIcon
    color='error'
    sx={{ 
      fontSize: { xs: 24, sm: 32, md: 40 },
      ":hover": { backgroundColor: '#99FFDF' }, 
      borderRadius: 3, 
      p: { xs: 0.3, sm: 0.4, md: 0.5 }
    }}
  />,

  SentimentDissatisfiedIcon: <SentimentDissatisfiedIcon 
    color='warning'
    sx={{ 
      fontSize: { xs: 24, sm: 32, md: 40 }, 
      ":hover": { backgroundColor: '#99FFDF' }, 
      borderRadius: 3, 
      p: { xs: 0.3, sm: 0.4, md: 0.5 }
    }}
  />,

  SentimentSatisfiedIcon: <SentimentSatisfiedIcon
    sx={{ 
      fontSize: { xs: 24, sm: 32, md: 40 }, 
      color: '#FFFF2B', 
      ":hover": { backgroundColor: '#99FFDF' }, 
      borderRadius: 3, 
      p: { xs: 0.3, sm: 0.4, md: 0.5 }
    }}
  />,

  SentimentSatisfiedAltIcon: <SentimentSatisfiedAltIcon
    sx={{ 
      fontSize: { xs: 24, sm: 32, md: 40 }, 
      color: 'yellowgreen', 
      ":hover": { backgroundColor: '#99FFDF' }, 
      borderRadius: 3, 
      p: { xs: 0.3, sm: 0.4, md: 0.5 }
    }}
  />,

  SentimentVerySatisfiedIcon: <SentimentVerySatisfiedIcon
    color='success'
    sx={{ 
      fontSize: { xs: 24, sm: 32, md: 40 }, 
      ":hover": { backgroundColor: '#99FFDF' }, 
      borderRadius: 3, 
      p: { xs: 0.3, sm: 0.4, md: 0.5 }
    }}
  />,
};

const initialFormData = {
  id: uid(5),
  question: '',
  quilText:'',
  options: [
    {
      id: "az56j",
      rowQuestion: '',
      columns: [
        { id: "a1f4d", value: 'VBad', icon: "VD" },
        { id: "a2k9m", value: 'Bad', icon: "DD" },
        { id: "a2n3m", value: 'Neutral', icon: "NN" },
        { id: "a2ll1", value: 'Good', icon: "SS" },
        { id: "a28c0", value: 'Perfect', icon: "VS" },
      ],
    },
  ],
  columnTextField: [
    { id: "a1f4d", value: 'VBad', icon: "VD" },
    { id: "a2k9m", value: 'Bad', icon: "DD" },
    { id: "a2n3m", value: 'Neutral', icon: "NN" },
    { id: "a2ll1", value: 'Good', icon: "SS" },
    { id: "a28c0", value: 'Perfect', icon: "VS" },
  ],
  selectedValue: [{ id: "az56j", question: '', answer: '', value: '', index: '' }],
  formType: 'SmileyRatingForm',
};

const SmileyRating = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext }) => {
  const [formData, setFormData] = useState(initialFormData);
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
    }, 2000); // 500ms delay

    // Cleanup function to cancel the timeout if value changes before delay
    return () => {
      // onSaveIndicator('Not Saaved')
      clearTimeout(handler);
    };
  }, [formData]);

   useEffect(() => {
    if (options) {
      setFormData(data);
    } else {
      setFormData({ 
        ...formData, 
        id,
        quilText: data?.quilText || '',
        question: data?.question || ''
      });
    }
  }, [data]);

  const handleAddColumn = () => {
    const genNewUid = uid(5);
    setFormData({
      ...formData,
      columnTextField: [...formData.columnTextField, { id: genNewUid, value: '' }],
      options: formData.options.map((row) => ({ ...row, columns: [...row.columns, { id: genNewUid, value: '' }] })),
    });
  };

  const handleDeleteColumn = (id) => {
    console.log(formData, 'formData before deleting');
    const newColumnTextField = formData.columnTextField.filter(column => column.id !== id);
    const newOptions = formData.options.map((row) => ({ ...row, columns: row.columns.filter(column => column.id !== id) }));
    setFormData({ ...formData, columnTextField: newColumnTextField, options: newOptions });
  }

  const handleAddRow = () => {
    const genRowUid = uid(5);
    setFormData({
      ...formData,
      options: [...formData.options, {
        id: genRowUid,
        rowQuestion: '',
        columns: formData.columnTextField.map((column) => ({ id: column.id, value: '' })),

      }],
      selectedValue: [...formData.selectedValue, { id: genRowUid, question: '', answer: '', value: '', index: '' }],
    });
  };

  const handleDeleteRow = (id) => {
    const newOptions = formData.options.filter(row => row.id !== id);
    const newSelectedValue = formData.selectedValue.filter(row => row.id !== id);
    setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue });
  }


  const handleSaveForm = () => {
    console.log('save handleSaveForm', formData);
    onSaveForm(formData);
    onHandleNext();
  };

  const handleRadioChange = (rowIndex, columnIndex) => {
    const newSelectedValue = [...formData.selectedValue];
    newSelectedValue[rowIndex].value = columnIndex;
    newSelectedValue[rowIndex].index = columnIndex + 1;


    newSelectedValue[rowIndex].question = formData.options[rowIndex].rowQuestion;

    newSelectedValue[rowIndex].answer = formData.columnTextField[columnIndex].value;
    setFormData({ ...formData, selectedValue: newSelectedValue });
  };
  console.log(formData, 'formData in select one choice form updatedddd');

  return (
    <React.Fragment>
      <CssBaseline />
      <Container  >
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
          p: 2, // Increased padding for inner content
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
          <Container sx={{ display: { xs: "none", md: "block" } }} maxWidth='xl' >
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
                theme="bubble"
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
                sx={{ minWidth: 650 }}
                aria-label="simple table">
                <TableHead>

                  <TableRow>
                    <TableCell
                      colSpan={1}
                    ></TableCell>
                    {formData.columnTextField.map((column) => (

                      <TableCell
                        key={column.id}
                        sx={{ 
                          width: 'auto',
                          overflowX: 'auto',
                          position: 'relative',
                          p: { xs: 1, sm: 2, md: 2 }  // Adjust padding for different screen sizes
                        }}
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
                          {column.icon === 'VD' ? iconMapping.SentimentVeryDissatisfiedIcon : column.icon === 'DD' ? iconMapping.SentimentDissatisfiedIcon : column.icon === 'NN' ? iconMapping.SentimentSatisfiedIcon : column.icon === 'SS' ? iconMapping.SentimentSatisfiedAltIcon : iconMapping.SentimentVerySatisfiedIcon}
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
                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                              },
                              '& .MuiInput-underline:before': {
                                borderBottom: 'none',
                              },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                borderBottom: 'none',
                              },
                              minWidth: { xs: 60, sm: 80, md: 100 },
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

            <Stack direction="row" spacing={2}  sx={{
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

          <Container sx={{ display: { xs: "block", md: "none" }, px: { xs: 1, sm: 2 } }} maxWidth='xl' >
            <TextField
              fullWidth
              size="small"
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                },
                mb: 2
              }}
              id="standard-basic"
              label={!disableText ? "Insert input" : ''}
              variant="standard"
              name='question'
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              InputProps={{
                readOnly: disableText,
              }}
              multiline
            />
            {formData.options.map((row, rowIndex) => (
              <Accordion 
                key={row.id}
                sx={{
                  mb: 1,
                  '& .MuiAccordionSummary-root': {
                    minHeight: { xs: 48, sm: 56 }
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={!disableText ? "Type Your Sub Question" : ''}
                    variant="standard"
                    value={row.rowQuestion}
                    onChange={(e) => setFormData({
                      ...formData,
                      options: formData.options.map((item) => 
                        item.id === row.id ? { ...item, rowQuestion: e.target.value } : item
                      )
                    })}
                    InputProps={{ readOnly: disableText }}
                  />
                </AccordionSummary>
                
                {formData.columnTextField.map((column, columnIndex) => (
                  <AccordionDetails 
                    key={column.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 1,
                      borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                    }}
                  >
                    <Radio
                      disabled={disableForm}
                      checked={formData.selectedValue[rowIndex].value === columnIndex}
                      onChange={() => handleRadioChange(rowIndex, columnIndex)}
                      size="small"
                    />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: { xs: 1, sm: 2 },
                      flex: 1
                    }}>
                      {column.icon === 'VD' ? iconMapping.SentimentVeryDissatisfiedIcon : column.icon === 'DD' ? iconMapping.SentimentDissatisfiedIcon : column.icon === 'NN' ? iconMapping.SentimentSatisfiedIcon : column.icon === 'SS' ? iconMapping.SentimentSatisfiedAltIcon : iconMapping.SentimentVerySatisfiedIcon}
                      <TextField
                        variant="standard"
                        size="small"
                        value={column.value}
                        sx={{
                          flex: 1,
                          '& .MuiInputBase-root': {
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }
                        }}
                        id="standard-basic"
                        placeholder={!disableText ? "Type Your Response Here" : ''}
                        name='columnTextField'
                        onChange={(e) => setFormData({ ...formData, columnTextField: formData.columnTextField.map((item) => item.id === column.id ? { ...item, value: e.target.value } : item) })}
                        InputProps={{
                          readOnly: disableText,
                        }}
                      />
                    </Box>
                  </AccordionDetails>
                ))}
              </Accordion>
            ))}
          </Container>
          <Stack 
            direction="row" 
            spacing={2}
            sx={{
              mt: 2,
              px: { xs: 1, sm: 2 },
              justifyContent: 'center'
            }}
          >
            {disableButtons && (
              <Button
                variant='contained'
                color="success"
                size="small"
                fullWidth
                sx={{ maxWidth: { sm: 200 } }}
                onClick={handleSaveForm}
              >
                Next Question
              </Button>
            )}
          </Stack>
        </Box>
        
      </Container>

    </React.Fragment>
  )
}

export default SmileyRating;

