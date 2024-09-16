import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import unitedArabEmirates from './united_arab_emirates.json';
import { uid } from 'uid';

const getColor = (value) => {
  return value > 1000 ? '#800026' :
         value > 500  ? '#BD0026' :
         value > 200  ? '#E31A1C' :
         value > 100  ? '#FC4E2A' :
         value > 50   ? '#FD8D3C' :
         value > 20   ? '#FEB24C' :
         value > 10   ? '#FED976' :
                        '#FFEDA0';
};

const style = (feature) => {
  return {
    fillColor: getColor(100), // Dummy value for demonstration
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
};



const MapForm = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {
  const [isBold, setIsBold] = useState(false);
  const [formData, setFormData] = useState({
    id: id,
    question: '',
    formMandate: false,
    options: [
      { id: uid(5), value: '' },
      { id: uid(5), value: '' }
    ],
    selectedValue: [{ question: '', answer: '', value: '', index: '' }],
    formType: 'MapForm'
  });

  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(formData);
      onSaveForm(formData);
    }, 2000); 

    return () => {
      clearTimeout(handler);
    };
  }, [formData]);

  useEffect(() => {
    if (options) {
      setFormData(data)
    } else {
      setFormData({ ...formData, id })
    }
  }, [data]);

  const onEachFeature = (feature, layer) => {
  
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(style(layer.feature));
      },
      click: () => {
        console.log('Clicked on:', feature.properties.name); // Handle click event
        if(!disableForm){          
        setFormData({ ...formData,selectedValue: [{ question: formData.question, answer: feature.properties.name, value: feature.properties.name, index: '' }] });
      }
    }
    });
  };

  console.log(formData, 'formData in MapForm');

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
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)',
          borderRadius: 2,
          p: 2,
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
          <TextField fullWidth id="standard-basic" label={!disableText ? "Insert input" : ''} variant='standard' size='small' required name='question' value={formData.question}
            sx={{
              '& .MuiInputBase-root': {
                fontWeight: isBold ? 'bold' : 'normal',
              }
            }}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            InputProps={{
              readOnly: disableText,
            }}
          />

          <MapContainer center={[24.4667, 54.3667]} zoom={7}  zoomControl={false}  scrollWheelZoom={false} 
  doubleClickZoom={false} style={{ height: "400px", width: "100%", marginTop: '20px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON data={unitedArabEmirates} style={style} onEachFeature={onEachFeature} />
          </MapContainer>

          <Stack spacing={2} direction='row' sx={{ marginTop: '20px' }}>
            {disableButtons && <Button
              variant='contained'
              color="success"
              onClick={() => {
                console.log('save handleSaveForm');
                onSaveForm(formData);
                onHandleNext();
              }}>
              Next Question
            </Button>}
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default MapForm;
