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

const initialFormData = {
  id: uid(5),
  question: '',
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

const SelectMultiScalePoint = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [debouncedValue, setDebouncedValue] = useState('');
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
      setFormData({ ...formData, id });
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

  const handleMandateForm = () => {
    console.log('mandate handleMandateForm');
    setFormData({ ...formData, formMandate: true })
  }

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
      <Container sx={{ display: { xs: "", md: "block" } }} maxWidth='xl' >
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
          <TextField
            fullWidth
            multiline
            id="standard-basic"
            label={!disableText ? "Insert input" : ''}
            variant="standard"
            name='question'
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            InputProps={{
              readOnly: disableText,
            }}
          />
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

          <Stack direction="row" spacing={2}>

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

            {!disableButtons && <Button
              variant='contained'
              color="primary"
              onClick={handleMandateForm}>
               Mandate This Form
            </Button>}

          </Stack>
        </Box>
      </Container>
      {/* <Container
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box sx={{
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexGrow: 1,
          height: "100%",
          mt: { xs: 4, md: 8 },
          width: '100%',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Updated box shadow for a subtle effect
          borderRadius: 8, // Increased border radius for rounded corners
          p: 3, // Increased padding for inner content
          overflowX: 'auto',
        }} >
          <TextField
            fullWidth
            id="standard-basic"
            label={!disableText ? "Insert input" : ''}
            variant="standard"
            name='question'
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            InputProps={{
              readOnly: disableText,
            }}
          />
          <div style={{ width: '100%' }}>
            {formData.options.map((row, rowIndex) => (
              <Accordion key={row.id} sx={{
                overflowX: 'auto',
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
                              <Stack direction="column" spacing={2} >
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
                                  fullWidth
                                  multiline
                                />
                              </Stack>
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
                              <Radio
                                disabled={disableForm}
                                key={column.id}
                                checked={formData.selectedValue[rowIndex].value === columnIndex}
                                onChange={() => handleRadioChange(rowIndex, columnIndex)}
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
          </div>
          <Stack direction="row" spacing={2}>
            {!disableButtons && (<Button
              variant='outlined'
              color="primary"
              size='small'
              onClick={handleAddColumn}>Add Column</Button>)}
            <Button
              variant='contained'
              color="success"
              onClick={handleSaveForm}>
              {!disableButtons ? 'Save This Form' : 'Next Question'}
            </Button>
            {!disableButtons && (<Button
              variant='outlined'
              color="primary"
              size='small'
              onClick={handleAddRow}>Add Row</Button>)}
          </Stack>
        </Box>

      </Container> */}
    </React.Fragment>
  )
}

export default SelectMultiScalePoint;



