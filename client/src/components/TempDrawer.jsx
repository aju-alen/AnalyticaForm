import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const TemporaryDrawer = ({ open, toggleDrawer, handleItemSelect }) => {
  const handleItemClick = (text) => {
    handleItemSelect(text);
    toggleDrawer(); // Close the drawer after item selection
  };

  return (
    <Drawer open={open} onClose={toggleDrawer}>
      <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('SinglePointForm')}>
              <ListItemText primary={'SinglePointForm'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('SingleCheckForm')}>
              <ListItemText primary={'SingleCheckForm'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('MultiScalePoint')}>
              <ListItemText primary={'MultiScalePoint'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('MultiScaleCheckBox')}>
              <ListItemText primary={'MultiScaleCheckBox'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('MultiSpreadsheet')}>
              <ListItemText primary={'MultiSpreadsheet'} />
            </ListItemButton>
          </ListItem>

          {/* <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick('DropdownMenu')}>
              <ListItemText primary={'DropdownMenu'} />
            </ListItemButton>
          </ListItem> */}
          
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleItemClick(text)}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default TemporaryDrawer;
