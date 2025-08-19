import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar() {
  return (
    <Box sx={{ 
      width: '100%', 
      height: (theme) => theme.trello.boardBarHeight, 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      padding: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip 
          sx={MENU_STYLES}
          icon={<DashboardIcon />} 
          label="Dashboard" 
          clickable
        />
        <Chip 
          sx={MENU_STYLES}
          icon={<VpnLockIcon />} 
          label="Public/Private Workspace" 
          clickable
        />
        <Chip 
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />} 
          label="Add to Google Drive" 
          clickable
        />
        <Chip 
          sx={MENU_STYLES}
          icon={<BoltIcon />} 
          label="Automation" 
          clickable
        />
        <Chip 
          sx={MENU_STYLES}
          icon={<FilterListIcon />} 
          label="Filters" 
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white '} }} variant="outlined" startIcon={ <PersonAddIcon/> }>Invite</Button>
        <AvatarGroup
          max={3} 
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be'}
            }
          }}  
        >
          <Tooltip title="HieuNM">
            <Avatar alt="HieuNM" src="https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/175666/Originals/avatar-xanh-duong%20(19).jpg" />
          </Tooltip>
          <Tooltip title="HieuNM">
            <Avatar alt="HieuNM" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQS_T5NL66MkewmvfUvKiaauZ1TATYBTiYdg&s" />
          </Tooltip>
         <Tooltip title="HieuNM">
            <Avatar alt="HieuNM" src="https://i.pinimg.com/originals/cd/cb/0c/cdcb0cb30bc700c53f12eff840156b29.jpg" />
          </Tooltip>
          <Tooltip title="HieuNM">
            <Avatar alt="HieuNM" src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474082Lbn/avt-de-thuong_044342663.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
