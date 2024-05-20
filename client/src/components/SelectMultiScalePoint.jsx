import React, { useState, useEffect } from 'react';
import { TextField, CssBaseline, Container, Box, Stack, Radio, Button } from '@mui/material';
import { uid } from 'uid';
import ClearIcon from '@mui/icons-material/Clear';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const initialFormData = {
  id: uid(5),
  question: '',
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
      <Container sx={{ display: { xs: "none", md: "block" } }} >
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
            label={!disableText ? "Type Your Form Question" : ''}
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
                    align="left"
                    sx={{ width: 'auto ' }}
                  ><h1 className=' text-white'>HeadingIdForRowAndColumn</h1></TableCell>
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
                        {!disableButtons && (<Button
                          size='small'
                          color='error'
                          onClick={() => handleDeleteColumn(column.id)}
                        >
                          <ClearIcon
                            fontSize='small'
                          />
                        </Button>)}
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.options.map((row, rowIndex) => (
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ width: '30%' }}>
                      <TextField
                        id="standard-basic"
                        label={!disableText ? "Type Your Sub Question" : ''}
                        variant="standard"
                        name='rowQuestion'
                        value={row.rowQuestion}
                        onChange={(e) => setFormData({ ...formData, options: formData.options.map((item) => item.id === row.id ? { ...item, rowQuestion: e.target.value } : item) })}
                        InputProps={{
                          readOnly: disableText,
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
                        />
                      </TableCell>
                    )}
                    <TableCell align="center">
                      {!disableButtons && (<Button
                        variant='outlined'
                        color='error'
                        onClick={() => handleDeleteRow(row.id)}>
                        <ClearIcon
                          fontSize='small'
                        />
                      </Button>)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
      </Container>
      <Container
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
            label={!disableText ? "Type Your Form Question" : ''}
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
              <Accordion key={row.id}>
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

      </Container>
    </React.Fragment>
  )
}

export default SelectMultiScalePoint;



