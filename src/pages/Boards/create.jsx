import { useState } from 'react'
import Box from '@mui/material/Box'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { createNewBoardAPI } from '~/apis'
import ActiveBoard from '~/components/Modal/ActiveBoard/ActiveBoard'
import { styled } from '@mui/material/styles'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))
function SidebarCreateBoardModal({ afterCreateNewBoard }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmitCreate = (data) => {
    createNewBoardAPI(data).then(() => {
      setIsOpen(false)
      afterCreateNewBoard()
    })
  }

  return (
    <>
      <SidebarItem onClick={() => setIsOpen(true)}>
        <LibraryAddIcon fontSize="small" />
          Create a new board
      </SidebarItem>

      <ActiveBoard
        open={isOpen}
        mode="create"
        initialData={null}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmitCreate}
      />
    </>
  )
}

export default SidebarCreateBoardModal
