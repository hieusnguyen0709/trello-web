import Box from '@mui/material/Box';
import ModeSelect from '~/components/ModeSelect/ModeSelect';
import AppsIcon from '@mui/icons-material/Apps';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import WorkSpaces from './Menu/WorkSpaces';
import Recent from './Menu/Recent';
import Starred from './Menu/Starred';
import Templates from './Menu/Templates';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Profiles from './Menu/Profiles';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Link } from 'react-router-dom';
import Notifications from './Notifications/Notifications';
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard';

function AppBar() {
  return (
    <Box px={2} sx={{ 
      width: '100%', 
      height: (theme) => theme.trello.appBarHeight, 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to="/boards">
          <Tooltip title="Board List">
            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }}/>
          </Tooltip>
        </Link>

        <Link to="/">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} fontSize="small" inheritViewBox sx={{ color: 'white' }} />
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
          </Box>
        </Link>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <WorkSpaces/>
          <Recent/>
          <Starred/>
          <Templates/>
          <Button 
            sx={{ 
              color: 'white',
              border: 'none',
              '&:hover': {
                border: 'none'
              }
            }}
            variant="outlined" 
            startIcon={ <LibraryAddIcon/> }
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoCompleteSearchBoard />
        <ModeSelect/>
        <Notifications />
        <Tooltip title="Help" sx={{ cursor: 'pointer', color: 'white' }}>
          <HelpOutlineIcon/>
        </Tooltip>
        <Profiles/>
      </Box>
    </Box>
  )
}

export default AppBar
