import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Column from './Column/Column';
import Button from '@mui/material/Button';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import  { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { createNewColumnAPI } from '~/apis';
import { generatePlaceholderCard } from '~/utils/formatters';
import { 
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';

function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title!')
      return 
    }

    const newColumnData = {
      title: newColumnTitle
    }
    
    // Gọi API tạo mới Column và làm lại dữ liệu State Board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất của spead operator là Shallow Copy/Clone,
    // nên dính phải rules Immutability trong Redux Toolkit không dùng được hàm PUSH (sửa giá trị mảng trực tiếp), cách đơn giản nhanh gọn nhất ở TH này 
    // là dùng Deep Copy/Clone toàn bộ cái Board cho dễ hiểu và code ngắn gọn
    // const newBoard = { ...board }
    // Clone Deep
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    // Clone Shallow - Concat array
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.columns.concat([createdColumn])
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])

    dispatch(updateCurrentActiveBoard(newBoard))

    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track' : { m: 2 },
      }}>
          {columns?.map(column => <Column 
            key={column._id} 
            column={column}
          />)}

          {/* Box Add new column CTA */}
          {!openNewColumnForm
            ? <Box onClick={toggleOpenNewColumnForm} sx={{
                minWidth: '250px',
                maxWidth: '250px',
                mx: 2,
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: '#ffffff3d'
              }}>
                <Button
                  startIcon={<NoteAddIcon />}
                  sx={{
                    color: 'white',
                    width: '100%',
                    justifyContent: 'flex-start',
                    pl: 2.5,
                    py: 1
                  }}
                >
                  Add new column
                </Button>
              </Box>
            : <Box sx={{
                minWidth: '250px',
                maxWidth: '250px',
                mx: 2,
                p: 1,
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: '#ffffff3d',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}>
                <TextField 
                  label="Enter column title..." 
                  type="text" 
                  size="small" 
                  variant="outlined"
                  autoFocus
                  data-no-dnd="true"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  sx={{ 
                    '& label': { color: 'white' },
                    '& input': { color: 'white' },
                    '& label.Mui-focused': { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    }
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    className="interceptor-loading"
                    onClick={addNewColumn}
                    variant='contained' color='success' size='small'
                    sx={{
                      boxShadow: 'none',
                      border: '0.5px solid',
                      borderColor: (theme) => theme.palette.success.main,
                      '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                    }}
                  >
                    Add Column
                  </Button>
                  <CloseIcon 
                    fontSize='small'
                    sx={{ 
                      color: 'white', 
                      cursor: 'pointer',
                      '&:hover': { color: (theme) => theme.palette.warning.light }
                    }}
                    onClick={toggleOpenNewColumnForm}
                  />
                </Box>
              </Box>
          }
      </Box>
    </SortableContext>
  )
}

export default ListColumns
