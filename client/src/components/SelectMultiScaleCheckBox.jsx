import React, { useState, useEffect } from 'react'
import { TextField, CssBaseline, Container, Box, Stack, Button, Checkbox,useTheme, useMediaQuery } from '@mui/material';
import { uid } from 'uid';
import ClearIcon from '@mui/icons-material/Clear';
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



const initialFormData = {
    id: uid(5),
    question: '',
    quilText: '',
    formMandate: false,
    options: [
        {
            id: "ak52b",
            rowQuestion: '',
            columns: [
                { id: "a9m41", value: '', checked: false },
                { id: "n9hn0", value: '', checked: false },
            ],
        },
    ],
    columnTextField: [
        { id: "a9m41", value: '' },
        { id: "n9hn0", value: '' },
    ],
    selectedValue: [

    ],
    formType: 'MultiScaleCheckBox',
};

const SelectMultiScaleCheckBox = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [debouncedValue, setDebouncedValue] = useState('');
    const [boldFields, setBoldFields] = useState(new Set());

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
        });
    };

    const handleDeleteRow = (id) => {
        const newOptions = formData.options.filter(row => row.id !== id);
        const newSelectedValue = formData.selectedValue.filter(row => row.id !== id);
        setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue });
    }

    const handleCheckBoxChange = (rowID, columnID, colIdx) => {
        let newSelectedValue = [...formData.selectedValue];

        const question = formData.options.find((item) => item.id === rowID).rowQuestion;
        const answer = formData.columnTextField.find(item => item.id === columnID).value;

        const index = newSelectedValue.findIndex((item) => item.rowId === rowID && item.colId === columnID);
        console.log(colIdx, 'index in checkbox change');

        if (index === -1) {
            newSelectedValue.push({ rowId: rowID, colId: columnID, value: true, question: question, answer: answer, index: colIdx + 1 });
        }
        else {
            newSelectedValue.splice(index, 1);
        }

        setFormData({ ...formData, selectedValue: newSelectedValue });
    }

    const handleSaveForm = () => {
        console.log('save handleSaveForm', formData);

        onSaveForm(formData);
        onHandleNext();
    };

    const handleMandateForm = () => {
        console.log('mandate handleMandateForm');
        setFormData({ ...formData, formMandate: true })
    }

    const handleBoldToggle = (id) => {
        const newBoldFields = new Set(boldFields);
        if (newBoldFields.has(id)) {
            newBoldFields.delete(id);
        } else {
            newBoldFields.add(id);
        }
        setBoldFields(newBoldFields);
    };

     // Update the useEffect for data initialization
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


    console.log(formData, 'formData in multi scale point');

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth='xl' >
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
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)',
                    borderRadius: { xs: 1, md: 2 },
                    p: { xs: 1, md: 2 },
                    overflowX: 'auto',
                    border: '2px solid #f0fbf0',
                    transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
                    position: 'relative',
                    backgroundColor: '#F4F3F6',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '0%',
                        transform: 'translateX(-50%)',
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
                    <Container sx={{ display: { xs: 'none', md: "block" } }} maxWidth='xl' >
                    <Box sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        '&:hover .format-button': {
                            visibility: 'visible',
                        },
                    }}>
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
                        
                    </Box>

                    <div style={{ width: '100%' }}>
                        <Table sx={{ 
                            minWidth: { xs: 300, md: 650 },
                            '& .MuiTableCell-root': {
                                px: { xs: 1, md: 2 },
                                py: { xs: 1, md: 2 }
                            }
                        }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        colSpan={1}
                                    >
                                    </TableCell>
                                    {formData.columnTextField.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            sx={{ width: 'auto ', overflowX: 'auto', position: 'relative', }} >

                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    '&:hover .delete-button': {
                                                        visibility: 'visible',
                                                    },
                                                    '&:hover .format-button': {
                                                        visibility: 'visible',
                                                    },
                                                }}
                                            >
                                                <TextField
                                                    key={column.id}
                                                    id="standard-basic"
                                                    placeholder={!disableText ? "Type Your Response Here" : ''}
                                                    variant="standard"
                                                    name='columnTextField'
                                                    value={column.value}
                                                    onChange={(e) => setFormData({ ...formData, columnTextField: formData.columnTextField.map((item) => item.id === column.id ? { ...item, value: e.target.value } : item) })}
                                                    InputProps={{
                                                        readOnly: disableText,
                                                    }}
                                                    sx={{
                                                        '& .MuiInputBase-root': {
                                                            fontSize: { xs: '1rem', md: '0.9rem' },
                                                            fontWeight: boldFields.has(column.id) ? 'bold' : 'normal',
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
                            <TableBody>
                                {formData.options.map((row) => (
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        key={row.id}
                                    >
                                        <TableCell component="th" scope="row" sx={{ width: { xs: '100%', md: '30%' }, minWidth: { xs: 150, md: 200 } }}>
                                            <Box sx={{
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                '&:hover .format-button': {
                                                    visibility: 'visible',
                                                },
                                            }}>
                                                <TextField
                                                    id="standard-basic"
                                                    multiline
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
                                                            fontSize: { xs: '1rem', md: '0.9rem' },
                                                            fontWeight: boldFields.has(row.id) ? 'bold' : 'normal',
                                                        },
                                                        '& .MuiInput-underline:before': {
                                                            borderBottom: 'none',
                                                        },
                                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                            borderBottom: 'none',
                                                        },
                                                        minWidth: { xs: 100, md: 200 },
                                                    }}
                                                />
                                               
                                            </Box>
                                        </TableCell>
                                        {row.columns.map((column, idx) => (
                                            <TableCell key={column.id} align='center' >
                                                <Checkbox
                                                    disabled={disableForm}
                                                    key={column.id}
                                                    onChange={() => handleCheckBoxChange(row.id, column.id, idx)}
                                                    checked={formData.selectedValue.some((item) => item.rowId === row.id && item.colId === column.id)}
                                                    size='small'
                                                />
                                            </TableCell>
                                        ))}
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





                    </Container>
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={{ xs: 1, sm: 2 }}
                        sx={{
                            marginTop: '1rem',
                            width: '100%',
                            '& .MuiButton-root': {
                                width: { xs: '100%', sm: 'auto' }
                            }
                        }}>

                        {!disableButtons && (<Button
                            variant='outlined'
                            color="primary"
                            size='small'
                            onClick={handleAddColumn}>Add Column</Button>)}

                        {disableButtons && <Button
                            variant='contained'
                            color="success"
                            onClick={handleSaveForm}>
                            Next Question
                        </Button>}

                        {/* {!disableButtons && <Button
                            variant='contained'
                            color="primary"
                            onClick={handleMandateForm}>
                            Mandate This Form
                        </Button>} */}


                    </Stack>

                    <Container sx={{ display: { xs: '', md: "none" } }} maxWidth='xl' >
                    <Box sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        '&:hover .format-button': {
                            visibility: 'visible',
                        },
                    }}>
                        <TextField
                            fullWidth
                            multiline
                            id="standard-basic"
                            label={!disableText ? "Insert input" : ''} variant="standard"
                            name='question'
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            InputProps={{
                                readOnly: disableText,
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    fontSize: { xs: '1rem', md: '1.3rem' },
                                    fontWeight: boldFields.has('question') ? 'bold' : 'normal',
                                },
                                width: '100%',
                                mx: { xs: 1, md: 2 }
                            }}
                        />
                        
                    </Box>
                         {formData.options.map((row, rowIndex) => (
              <Accordion sx={{
                width: '100%',
                '& .MuiAccordionSummary-content': {
                    margin: { xs: '8px 0', md: '12px 0' }
                },
                '& .MuiAccordionDetails-root': {
                    padding: { xs: 1, md: 2 }
                }
              }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div className=" w-full">
                    <h3>{row.rowQuestion}</h3>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="">
                    <Table
                      sx={{ minWidth: 650 }}
                      aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          {formData.columnTextField.map((column) => (
                            <TableCell
                              key={column.id}
                              sx={{ width: 'auto ', overflowX: 'auto', }}>
                              <Box sx={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                '&:hover .format-button': {
                                    visibility: 'visible',
                                },
                              }}>
                                <TextField
                                  key={column.id}
                                  id="standard-basic"
                                  label={!disableText ? "Type Your Response Here" : ''} variant="standard"
                                  name='columnTextField'
                                  value={column.value}
                                  onChange={(e) => setFormData({ ...formData, columnTextField: formData.columnTextField.map((item) => item.id === column.id ? { ...item, value: e.target.value } : item) })}
                                  InputProps={{
                                    readOnly: disableText,
                                  }}
                                  sx={{
                                    '& .MuiInputBase-root': {
                                      fontSize: { xs: '1rem', md: '0.9rem' },
                                      fontWeight: boldFields.has(column.id) ? 'bold' : 'normal',
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
                               
                              </Box>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          {row.columns.map((column, columnIndex) =>
                            <TableCell key={column.id} align='center' >
                              <Checkbox
                                                    disabled={disableForm}
                                                    key={column.id}
                                                    onChange={() => handleCheckBoxChange(row.id, column.id, columnIndex)}
                                                    checked={formData.selectedValue.some((item) => item.rowId === row.id && item.colId === column.id)}
                                                    size='small'
                                                />
                            </TableCell>
                          )}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </AccordionDetails>
                </Accordion>
                ))}
                    <div style={{ width: '100%' }}>
                       
                        {!disableButtons && (<Button
                            variant='outlined'
                            color="primary"
                            size='small'
                            onClick={handleAddRow}>Add Row</Button>)}
                    </div>





                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={{ xs: 1, sm: 2 }}
                        sx={{
                            marginTop: '1rem',
                            width: '100%',
                            '& .MuiButton-root': {
                                width: { xs: '100%', sm: 'auto' }
                            }
                        }}>

                        {!disableButtons && (<Button
                            variant='outlined'
                            color="primary"
                            size='small'
                            onClick={handleAddColumn}>Add Column</Button>)}

                        {disableButtons && <Button
                            variant='contained'
                            color="success"
                            onClick={handleSaveForm}>
                            Next Question
                        </Button>}

                        {/* {!disableButtons && <Button
                            variant='contained'
                            color="primary"
                            onClick={handleMandateForm}>
                            Mandate This Form
                        </Button>} */}


                    </Stack>
                    </Container>
                </Box>
            </Container>
        </React.Fragment>

    )
}

export default SelectMultiScaleCheckBox