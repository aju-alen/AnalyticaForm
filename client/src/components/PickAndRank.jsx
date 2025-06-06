import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { uid } from 'uid';
import { DndContext } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import DraggableContainer from './DraggableContainer';
import DroppableContainer from './DroppableContainer';





const SelectSingleRadio = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext,onSaveIndicator }) => {
  const [isBold, setIsBold] = useState(false);
  const [formData, setFormData] = useState({
    id: id,
    question: '',
    formMandate: false,
    options: [
      { id: uid(5), value:'',container:'draggable' },
      { id: uid(5), value:'',container:'draggable' },
      { id: uid(5), value:'',container:'draggable' },
      { id: uid(5), value:'',container:'draggable' },

    ],
    selectedValue: [],
    formType: 'PickAndRankForm'
  });
  const [items, setItems] = useState([
    { id: 'item-1', text: 'Item 1', container: 'draggable' },
    { id: 'item-2', text: 'Item 2', container: 'draggable' },
    { id: 'item-3', text: 'Item 3', container: 'draggable' },
    { id: 'item-4', text: 'Item 4', container: 'droppable' }, // Example pre-existing item in droppable
  ]);

  const handleDragEnd = (event) => {
    
    const { active, over } = event;
    console.log(event,'event in handleDragEnd');

    if (over) {
      setFormData((prevFormData) => {
        console.log(prevFormData.options, 'options in handleDragEnd');
        
        const oldIndex = prevFormData.options.findIndex(option => option.id === active.id);
        const newIndex = prevFormData.options.findIndex(option => option.id === over.id);

        console.log(oldIndex, 'oldIndex in handleDragEnd');
        console.log(newIndex, 'newIndex in handleDragEnd');
        
    
        let updatedOptions;
    
        if (prevFormData.options[oldIndex].container === 'draggable' && over.id === 'droppable') {
            updatedOptions = prevFormData.options.map((option) => 
                option.id === active.id ? { ...option, container: 'droppable' } : option
            );
        } else if (prevFormData.options[oldIndex].container === 'droppable' && over.id !== 'droppable') {
            updatedOptions = arrayMove(prevFormData.options, oldIndex, newIndex);
        } else {
            updatedOptions = prevFormData.options;
        }
    
        return {
            ...prevFormData,
            options: updatedOptions,
            selectedValue: updatedOptions.filter((option) => option.container === 'droppable').map((option,idx) => ({ answer: option.value, question: JSON.stringify(idx + 1)}))
        };
    });
    }
  };

  const draggableItems = formData.options.filter(item => item.container === 'draggable');
  const droppableItems = formData.options.filter(item => item.container === 'droppable');

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

  const handleAddOptions = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: uid(5), value: '' }]
    })
  }

  const handleDeleteOptions = (id) => {
    // console.log(id,'id in delete');
    const newOptions = formData.options.filter(option => option.id !== id);
    // console.log(newOptions,'newOptions');
    setFormData({ ...formData, options: newOptions });
  }

  const handleSaveForm = () => {
    console.log('save handleSaveForm');
    onSaveForm(formData);
    onHandleNext()
  }

  // const handleMandateForm = () => {
  //   console.log('mandate handleMandateForm');
  //   setFormData({ ...formData, formMandate: true })
  // }

  const handleRadioChange = (id) => {
    const newOptions = formData.options.map((option, idx) => {
      if (option.id === id) {

        setFormData({ ...formData, selectedValue: [{ answer: option.value, question: formData.question, index: idx + 1 }] })

      }
    })
  }

  useEffect(() => {
    // console.log(data,'data in select one choice form');
    if (options) {
      setFormData(data)
    }
    else {
      setFormData({ ...formData, id })
    }
  }, [data])
  // console.log(id,'id in select one choice form');
  console.log(formData, 'formData in select one choice form');
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='xl'>
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
  backgroundColor:'#F4F3F6',
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
    backgroundColor:'#F4FFF8',
  },
}}>
          <TextField fullWidth id="standard-basic" label={!disableText ? "Insert input" : ''} variant='standard' size='small' required name='question' value={formData.question}
            sx={{
              '& .MuiInputBase-root': {
                fontWeight: isBold? 'bold' : 'normal',
              }
            }}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}

            InputProps={{
              readOnly: disableText,
            }}
          />


{ !disableForm &&
 <DndContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <DraggableContainer items={draggableItems} />
        <DroppableContainer items={droppableItems} />
      </div>
  </DndContext>}
  
   {disableForm && <Stack spacing={1} sx={{
            width: '20%',
            marginRight: 'auto',
          }} >
            {formData.options.map((option) => (
             <Stack direction="row" spacing={2} key={option.id}>
              
               <Box
               sx={{
                 position: 'relative',
                 display: 'flex',
                 alignItems: 'center',
                 width: '100%',
                 '&:hover .delete-button': {
                   visibility: 'visible',
                 },
               }}
             >
               <TextField
  fullWidth
  id="standard-basic"
  placeholder={!disableText ? "Type Your Response Here" : ''}
  variant="standard"
  name={option.text}
  value={option.value}
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
  }}
  onChange={(e) => {
    const newOptions = formData.options.map((opt) => {
      if (opt.id === option.id) {
        return { ...opt, value: e.target.value };
      }
      return opt;
    });
    setFormData({ ...formData, options: newOptions });
  }}
  InputProps={{
    readOnly: disableText,
  }}
/>
               {!disableButtons && (
                 <Button
                   className="delete-button"
                   color="error"
                   variant="text"
                   sx={{
                     position: 'absolute',
                     left: '100%',
                     visibility: 'hidden',
                     transition: 'visibility 0.1s ease-in-out',

                   }}
                   onClick={() => handleDeleteOptions(option.id)}
                 >
                   <HighlightOffIcon fontSize="small" />
                 </Button>
               )}
             </Box>
             
           </Stack>
            ))
            }
            {!disableButtons && (
              <Button
                sx={{
                  width: '70%',
                }}
                onClick={handleAddOptions}
                variant='outlined'
                color="primary"
                size="small"
              >Add new row</Button>
            )}
          </Stack>}
          <Stack spacing={2} direction='row'>
            {/* {!disableButtons && (
              <Button
                onClick={handleAddOptions}
                variant='outlined'
                color="primary"
                size="small"
              >Add new row</Button>
            )} */}

            {disableButtons &&<Button
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
        </Box>
      </Container>
      </React.Fragment>

  )
 
}

export default SelectSingleRadio

