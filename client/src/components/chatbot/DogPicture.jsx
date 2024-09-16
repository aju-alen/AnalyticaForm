// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { Container, Stack } from '@mui/material';

const DogPicture = () => {

  const [imageUrl, setImageUrl] = useState('');

  

  return (
    <Container>
        <Stack direction={'row'} spacing={10}>
         <Badge badgeContent={'Pricing'} color="primary" >
    </Badge>
         <Badge badgeContent={'Features'} color="primary">
    </Badge>
         <Badge badgeContent={'Terms'} color="primary">
    </Badge>
    </Stack>
        </Container>
  );
};

export default DogPicture;