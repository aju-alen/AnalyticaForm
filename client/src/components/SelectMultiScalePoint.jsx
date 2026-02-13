import React, { useState, useEffect } from 'react';
import { TextField, CssBaseline, Container, Box, Stack, Radio, Button, Typography, InputLabel, useTheme, useMediaQuery } from '@mui/material';
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
import Divider from '@mui/material/Divider';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const initialFormData = {
  id: uid(5),
  question: '',
  quilText: '',
  formMandate: false,
  options: [
    {
      id: "az56j",
      rowQuestion: '',
      columns: [
        { id: "a1f4d", value: '' },
        { id: "a2k9m", value: '' },
      ],
    },
  ],
  columnTextField: [
    { id: "a1f4d", value: '' },
    { id: "a2k9m", value: '' },
  ],
  selectedValue: [{ id: "az56j", question: '', answer: '', value: '', index: '' }],
  formType: 'MultiScalePoint',
};

const SelectMultiScalePoint = ({ onSaveForm, registerFormData, data, id, options, disableForm, disableText, disableButtons, onHandleNext }) => {
  const [formData, setFormData] = useState(initialFormData);

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
  
  // Keep parent ref updated so auto-save always has latest (Response, sub question, etc.)
  useEffect(() => {
    if (typeof registerFormData === 'function' && id) {
      registerFormData(id, formData);
    }
  }, [formData, id, registerFormData]);

  // Debounced save to parent state so auto-save can run (600ms after last change)
  useEffect(() => {
    const handler = setTimeout(() => {
      onSaveForm(formData);
    }, 600);

    return () => clearTimeout(handler);
  }, [formData, onSaveForm]);

   // Update the useEffect for data initialization
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


  const handleAddColumn = () => {
    const genNewUid = uid(5);
    setFormData({
      ...formData,
      columnTextField: [...formData.columnTextField, { id: genNewUid, value: '' }],
      options: formData.options.map((row) => ({ ...row, columns: [...row.columns, { id: genNewUid, value: '' }] })),
    });
  };

  const handleDeleteColumn = (id) => {
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
    onSaveForm(formData);
    onHandleNext();
  };

  const handleMandateForm = () => {
    setFormData(prev => ({ ...prev, formMandate: true }));
  }

  const handleRadioChange = (rowIndex, columnIndex) => {
    const newSelectedValue = [...formData.selectedValue];
    newSelectedValue[rowIndex].value = columnIndex;
    newSelectedValue[rowIndex].index = columnIndex + 1;


    newSelectedValue[rowIndex].question = formData.options[rowIndex].rowQuestion;

    newSelectedValue[rowIndex].answer = formData.columnTextField[columnIndex].value;
    setFormData(prev => ({ ...prev, selectedValue: newSelectedValue }));
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='xl'>
        <Box sx={{
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          flexGrow: 1,
          mt: { xs: 2, sm: 3, md: 0 },
          width: '100%',
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)',
          borderRadius: 2,
          p: { xs: 1, sm: 2 },
          overflowX: 'hidden',
          border: '2px solid #f0fbf0',
          backgroundColor: '#F4F3F6',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '12px',
            bgcolor: '#1976d2',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          },
          '&:hover::before': {
            opacity: 1,
          },
          '&:hover': {
            boxShadow: '0px 1px rgba(0, 0, 0, 0.2)',
            transform: 'scale(0.98)',
            backgroundColor: '#F4FFF8',
          },
        }}>
          {/* Question / editor section – constrained so it doesn't overlap */}
          <Box sx={{
            width: '100%',
            flexShrink: 0,
            mb: 2,
            minHeight: 0,
            '& .ql-toolbar': { borderRadius: '4px 4px 0 0' },
            '& .ql-container': { border: '0px solid rgba(0, 0, 0, 0.23)', borderRadius: '0 0 4px 4px' },
            '& .ql-editor': {
              minHeight: 60,
              maxHeight: 200,
              overflowY: 'auto',
            },
          }}>
            {!disableText && (
              <InputLabel shrink={false} sx={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.6)', mb: 1, display: 'block' }}>
                Insert input *
              </InputLabel>
            )}
            <ReactQuill
              theme="snow"
              value={formData.quilText}
              onChange={handleQuillChange}
              readOnly={disableText}
              modules={modules}
              formats={formats}
              className="ql-container ql-snow"
              style={{ width: '100%', borderRadius: '4px' }}
            />
            <Divider sx={{ mt: 2 }} />
          </Box>

          {/* Desktop/Tablet View – table separate below question */}
          <Box sx={{ display: { xs: 'none', sm: 'block' }, width: '100%', mt: 1, minWidth: 0, overflowX: 'auto' }}>
            <Table sx={{ minWidth: { sm: 500, md: 650 } }}>
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
                          alignItems: 'center',
                          width: '100%',
                          '&:hover .delete-button': {
                            visibility: 'visible',
                          },
                        }}
                      >
                        <TextField
                          key={column.id}
                          id="standard-basic"
                          placeholder={!disableText ? "Type Your Response Here" : ''} variant="standard"
                          name='columnTextField'
                          value={column.value}
                          onChange={(e) => setFormData({ ...formData, columnTextField: formData.columnTextField.map((item) => item.id === column.id ? { ...item, value: e.target.value } : item) })}
                          InputProps={{
                            readOnly: disableText,
                          }}
                          sx={{
                            '& .MuiInputBase-root': {
                              fontSize: '0.9rem',
                            },
                            '& .MuiInput-underline:before': {
                              borderBottom: 'none',
                            },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                              borderBottom: 'none',
                            },
                            minWidth: { xs: 100, md: 200 },
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
                            fontSize: '0.9rem',
                          },
                          '& .MuiInput-underline:before': {
                            borderBottom: 'none',
                          },
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
            {!disableButtons && (
              <Button variant="outlined" color="primary" size="small" onClick={handleAddRow} sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 100 }}>
                Add Row
              </Button>
            )}
          </Box>

          {/* Mobile View */}
          <Box sx={{ display: { xs: 'block', sm: 'none' }, width: '100%', mt: 1, minWidth: 0 }}>
            {formData.options.map((row, rowIndex) => (
              <Accordion
                key={row.id}
                sx={{
                  mb: 1,
                  '& .MuiAccordionSummary-content': {
                    margin: '8px 0',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    {row.rowQuestion?.trim() || `Question ${rowIndex + 1}`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1 }}>
                  <Stack spacing={2}>
                    {formData.columnTextField.map((column, columnIndex) => (
                      <Box key={column.id} sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1,
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                      }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {column.value}
                        </Typography>
                        <Radio
                          disabled={disableForm}
                          checked={formData.selectedValue[rowIndex].value === columnIndex}
                          onChange={() => handleRadioChange(rowIndex, columnIndex)}
                          size="small"
                        />
                      </Box>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2 }}
            sx={{ mt: 2, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {!disableButtons && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleAddColumn}
                sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 120 }}
              >
                Add Column
              </Button>
            )}
            {disableButtons && (
              <Button variant="contained" color="success" onClick={handleSaveForm} fullWidth={isMobile}>
                Next Question
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default SelectMultiScalePoint;


