import { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
// import { mockData } from '~/apis/mock-data';
import { fetchBoardDetailsAPI } from '~/apis';

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '68b906d84c467fd1e9118e82'
    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent board={board}/>
    </Container>
  );
}

export default Board
