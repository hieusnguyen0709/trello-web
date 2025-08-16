import { useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import { pink } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  );
}

function App() {
  return (
    <>
      <ModeToggle/>
      <hr/>
      <div>HieuNM</div>
      <Typography variant="body2" color="text.secondary">Test Typography</Typography>
      <Button variant="contained" color="success">Hello world</Button>
      <AccessAlarm/>
      <ThreeDRotation sx={{ color: pink[500] }}/>
    </>
  );
}

export default App;
