import React, { useEffect,useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';


const TemporaryDrawer = ({ open, toggleDrawer, handleItemSelect,subscriptionEndDate }) => {
  const [isProMember,setIsProMember] = useState(true);
  const handleItemClick = (text) => {
    handleItemSelect(text);
    toggleDrawer(); // Close the drawer after item selection
  };

  useEffect(() => {
    const getProMember = async () => {
    const date = new Date();
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    

    if (subscriptionEndDate > unixTimestamp) {
      setIsProMember(true);
    }
  }
  getProMember();
  }, []);

  return (
    <Drawer open={open} onClose={toggleDrawer}>
      <Box
        sx={{
          width: 300,
          bgcolor: '#f5f5f5', // Light background color
          padding: 2,         // Add padding around the content
        }}
        role='table'
        onClick={toggleDrawer}
      >
        <List sx={{ fontSize: '0.375rem' }}>
          <ListItem disablePadding >
            <ListItemButton onClick={() => handleItemClick('SinglePointForm')}  >
              <ListItemText
                primary={'Select One'}
                
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('SingleCheckForm')}>
              <ListItemText
                primary={'Select Many'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('MultiScalePoint')}>
              <ListItemText
                primary={'Multi-point Radio'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('MultiScaleCheckBox')}>
              <ListItemText
                primary={'Multi-point Checkbox'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          {/* Uncomment if needed */}
          {/* <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('MultiSpreadsheet')}>
              <ListItemText
                primary={'MultiSpreadsheet'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem> */}

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('SelectDropDownForm')}>
              <ListItemText
                primary={'Select Dropdown'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('CommentBoxForm')}>
              <ListItemText
                primary={'Comment Box'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('SingleRowTextForm')}>
              <ListItemText
                primary={'Single Row Text Box'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('EmailAddressForm')}>
              <ListItemText
                primary={'Email Address'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('ContactInformationForm')}>
              <ListItemText
                primary={'Contact Information'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('StarRatingForm')}>
              <ListItemText
                primary={'Star Rating'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('SmileyRatingForm')}>
              <ListItemText
                primary={'Smiley Rating'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('ThumbUpDownForm')}>
              <ListItemText
                primary={'Thumbs Up/Down'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('DateTimeForm')}>
              <ListItemText
                primary={'Date Time'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('GoogleRecaptchaForm')}>
              <ListItemText
                primary={'Google Recaptcha'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('CalenderForm')}>
              <ListItemText
                primary={'Calender Select'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('CountrySelectForm')}>
              <ListItemText
                primary={'Country Select'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('RankOrderForm')}>
              <ListItemText
                primary={'Rank Order'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('ConstantSumForm')}>
              <ListItemText
                primary={'Constant Sum'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('NumericSliderForm')}>
              <ListItemText
                primary={'Numeric Slider'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('PresentationTextForm')}>
              <ListItemText
                primary={'Presentation Text'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('SectionHeadingForm')}>
              <ListItemText
                primary={'Section Heading'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('SectionSubHeadingForm')}>
              <ListItemText
                primary={'Section Subheading'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('SliderTextForm')}>
              <ListItemText
                primary={'Slider Text'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('PickAndRankForm')}>
              <ListItemText
                primary={'Pick And Rank'}
                sx={{ fontSize: '0.375rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
          <Badge badgeContent='Premium' color="primary">
            <ListItemButton disabled={isProMember?false:true} onClick={() => handleItemClick('SelectOneImageForm')}>
              <ListItemText
                primary={'Select One Image'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </Badge>
          </ListItem>

          <ListItem disablePadding>
          <Badge badgeContent='Premium' color="primary">
            <ListItemButton disabled={isProMember?false:true} onClick={() => handleItemClick('SelectMultipleImageForm')}>
              <ListItemText
                primary={'Select Multiple Image'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </Badge>
          </ListItem>

          {/* <ListItem disablePadding >
          <Badge badgeContent='Premium' color="primary">
            <ListItemButton disabled={isProMember?false:true} onClick={() => handleItemClick('RankOrderImageForm')}>
              <ListItemText
                primary={'Rank Order Image'}
                sx={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </Badge>
          </ListItem> */}

        </List>
      </Box>
    </Drawer>
  );
};

export default TemporaryDrawer;

