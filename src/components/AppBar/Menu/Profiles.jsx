import React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

function Profiles() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
  return (
    <Box>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ padding: 0 }}
            aria-controls={open ? 'basic-menu-profiles' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar 
                sx={{ width: 30, height: 30 }} 
                alt="HieuNM"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRknnc4OqRgNtBh8jwv-wY4dpK-YZ8AHDMktRa85N4YD2wp-zhQvYavkyKPtCZtC48DLrw&usqp=CAU"
            />
          </IconButton>
        </Tooltip>
        <Menu
            id="basic-menu-profiles"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button-profiles',
            }}
        >
            <MenuItem>
                <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> Profile
            </MenuItem>
            <MenuItem>
                <Avatar sx={{ width: 28, height: 28, mr: 2 }}/> My account
            </MenuItem>
            <Divider />
            <MenuItem>
            <ListItemIcon>
                <PersonAdd fontSize="small" />
            </ListItemIcon>
            Add another account
            </MenuItem>
            <MenuItem>
            <ListItemIcon>
                <Settings fontSize="small" />
            </ListItemIcon>
            Settings
            </MenuItem>
            <MenuItem>
            <ListItemIcon>
                <Logout fontSize="small" />
            </ListItemIcon>
            Logout
            </MenuItem>
        </Menu>
    </Box>
  )
}

export default Profiles
