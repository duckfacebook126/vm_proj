import React from "react";
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemButton,
  Typography,
  styled
} from '@mui/material';
import { Home, Info, ContactMail, Inbox, Mail } from '@mui/icons-material';
import { useState } from 'react';

import { ComputerIcon, StorageIcon, AutoGraphIcon, DesktopMacIcon } from '@mui/icons-material';

// DrawerHeader is a styled component that creates a header section for the drawer
// It provides consistent spacing and alignment for the drawer's top section
// The component uses theme spacing and mixins.toolbar to maintain proper height
// and alignment with the app bar, ensuring the drawer content doesn't overlap
// with the app bar when opened

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  ...theme.mixins.toolbar,
}));
const  Sidebar=({open,onClose})=>
{
//tracking sidebar state
const [selectedMenu,setSelectedMenu]=useState('VirtualMachines')
//list of menu items
const menuItems =['VirtualMachines','Storage','Analytics']
//when the menu click the ';
const handleMenuClick=(text)=>
{
setSelectedMenu(text)
 console.log('slected menu Item');

}

return(
  <>
  <Box sx={{display:'flex'}}></Box>
  <Drawer anchor='left' open={open} onClose={onClose} sx={{width:240,
    flexShrink:0,
    '& .MuiDrawer-paper':{
      width:240,
      boxSizing:'border-box'}
  }}>

<DrawerHeader/>
<List>
  {menuItems.map((item)=>(
    <ListItem key={item} disablePadding>
      <ListItemButton onClick={()=>handleMenuClick(item)}>
        <ListItemIcon>
          {item === 'VirtualMachines' && <DesktopMacIcon />}
          {item === 'Storage' && <StorageIcon />}
          {item === 'Analytics' && <AutoGraphIcon />}
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  ))}
</List>

  </Drawer>

  <Box component='main' sx={{flexGrow:1,p:3}}>
    <DrawerHeader/>

    {selectedMenu === 'VirtualMachines' && <VirtualMachines/>}
    {selectedMenu === 'Storage' && <Storage/>}
    {selectedMenu === 'Analytics' && <Analytics/>}
  </Box>
  
  </>
)

}
export default Sidebar;
  
function VirtualMachines(){
  return <div>VirtualMachines</div>
}
function Storage(){
  return <div>Storage</div>
}
function Analytics(){
  return <div>Analytics</div>
}


