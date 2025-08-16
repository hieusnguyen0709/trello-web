import { useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import { pink } from '@mui/material/colors';

function App() {
  return (
    <>
      <div>HieuNM</div>
      <Button variant="contained">Hello world</Button>
      <AccessAlarm/>
      <ThreeDRotation sx={{ color: pink[500] }}/>
    </>
  );
}

export default App;
