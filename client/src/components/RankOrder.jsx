import React, { useState, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { Button, Stack, useTheme, useMediaQuery } from '@mui/material';
import { uid } from 'uid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RankOrder = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {

    const [formData, setFormData] = useState({
        id: id,
        question: '',
        quilText:'',
        formMandate: false,
        options: [
            { id: 'as3lo', value: '', rowQuestion: '' },
            { id: 'bll07', value: '', rowQuestion: '' },

        ],
        selectedValue: [
            { id: 'as3lo', question: '', answer: '', value: '', index: '' },
            { id: 'bll07', question: '', answer: '', value: '', index: '' }
        ],
        formType: 'RankOrderForm'
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

    const handleChange = (e, id) => {
        console.log(id, 'id in handleChange');
        console.log(e.target.value, 'e.target.value');
        const newSelectedValue = formData.selectedValue.map((opt) => {
            if (opt.id === id) {
                return { ...opt, answer: e.target.value,index: e.target.value }
            }
            return opt
        })
        const newOptions = formData.options.map((opt) => {
            if (opt.id === id) {
                return { ...opt, value: e.target.value }
            }
            return opt
        }
        )
        setFormData({ ...formData, selectedValue: newSelectedValue, options: newOptions })
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

    const handleAddOptions = () => {
        const id = uid(5);
        setFormData({
            ...formData,
            options: [...formData.options, { id: id, value: '' }],
            selectedValue: [...formData.selectedValue, { id: id, question: '', answer: '', value: '', index: '' }]
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
    // console.log(id,'id in select one choice form');
    console.log(formData, 'formData in rank order form');

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
                    mt: { xs: 4, md: 0 },
                    width: '100%',
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)',
                    borderRadius: 2,
                    p: 2,
                    overflowX: 'hidden',
                    border: '2px solid #f0fbf0',
                    transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
                    position: 'relative',
                    backgroundColor: '#F4F3F6',
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

                    {/* Options / rank section – separate below question */}
                    <Stack spacing={1} sx={{ width: '100%', maxWidth: { xs: '100%', md: 560 }, mt: 1 }}>
                        {formData.options.map((option) => (
                            <Stack direction="row" spacing={2} key={option.id} sx={{ minWidth: 0, width: '100%', alignItems: 'center' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        minWidth: 0,
                                        flex: 1,
                                        '&:hover .delete-button': {
                                            visibility: 'visible',
                                        },
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        id="standard-basic"
                                        multiline
                                        placeholder={!disableText ? "Type Your Response Here" : ''}
                                        variant="standard"
                                        name={option.text}
                                        value={option.rowQuestion}
                                        onChange={(e) => {
                                            const newOptions = formData.options.map((opt) => {
                                                if (opt.id === option.id) {
                                                    return { ...opt, rowQuestion: e.target.value }
                                                }
                                                return opt
                                            })
                                            const newSelectedValue = formData.selectedValue.map((opt) => {
                                                if (opt.id === option.id) {
                                                    return { ...opt, question: e.target.value }
                                                }
                                                return opt
                                            }
                                            )
                                            setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue })
                                        }}
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
                                        }}
                                    />
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={option.value}
                                        onChange={(e) => handleChange(e, option.id)}
                                        disabled={disableForm}
                                        size="small"
                                        sx={{
                                            minWidth: 56,
                                            width: { xs: '30%', sm: 72 },
                                            flexShrink: 0,
                                            marginLeft: 'auto',
                                        }}
                                    >
                                        {formData.options.map((option, idx) => (
                                            <MenuItem key={option.id} value={idx + 1}
                                                disabled={formData.selectedValue.find((opt) => opt.answer === idx + 1) ? true : false}
                                            >{idx + 1}</MenuItem>
                                        ))
                                        }

                                    </Select>



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

                    </Stack>

                    <Stack spacing={2} direction="row" sx={{ mt: 2, flexWrap: 'wrap' }}>
                        {!disableButtons && (
                            <Button
                                onClick={handleAddOptions}
                                variant="outlined"
                                color="primary"
                                size="small"
                                sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 120 }}
                            >
                                Add new row
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

export default RankOrder