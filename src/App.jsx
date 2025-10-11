import { Routes, Route, Navigate } from 'react-router-dom'

import Board from "~/pages/Boards/_id";
import NotFound from './pages/404/NotFound';
import Auth from './pages/Auth/Auth';
import AccountVerification from './pages/Auth/AccountVerification';

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to='boards/68b906d84c467fd1e9118e82' replace={true} />
      } />

      <Route path='/boards/:boardId' element={<Board/>} />

      <Route path='/login' element={<Auth/>} />
      <Route path='/register' element={<Auth/>} />
      <Route path='/account/verification' element={<AccountVerification/>}/>

      <Route path='*' element={<NotFound/>} />
    </Routes>
  );
}

export default App;
