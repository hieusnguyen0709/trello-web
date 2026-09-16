import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import { toast } from 'react-toastify'
import { getArchivedCardsAPI, restoreCardAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined'
import Tooltip from '@mui/material/Tooltip'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'

function ArchivedCards({ open, onClose, columnId }) {
  const dispatch = useDispatch()
  const [cards, setCards] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    if (open && columnId) {
      setCards([])
      setSelectedIds([])
      getArchivedCardsAPI(columnId).then(setCards)
    }
  }, [open, columnId])

  const isAllSelected = cards.length > 0 && selectedIds.length === cards.length

  const handleToggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : cards.map(c => c._id))
  }

  const handleToggleSelectOne = (cardId) => {
    setSelectedIds(prev =>
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    )
  }

  const handleRestoreOne = async (cardId) => {
    const restoredCard = await restoreCardAPI(cardId)
    dispatch(updateCardInBoard(restoredCard))
    setCards(prev => prev.filter(c => c._id !== cardId))
    setSelectedIds(prev => prev.filter(id => id !== cardId))
    toast.success('Successfully restored card!')
  }

  const handleRestoreSelected = async () => {
    const restoredCards = await Promise.all(selectedIds.map(id => restoreCardAPI(id)))
    restoredCards.forEach(card => dispatch(updateCardInBoard(card)))
    setCards(prev => prev.filter(c => !selectedIds.includes(c._id)))
    setSelectedIds([])
    toast.success(`Successfully restored ${restoredCards.length} card(s)!`)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'relative',
        width: 550,
        maxWidth: 550,
        height: 550,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        outline: 0,
        padding: '20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArchiveOutlinedIcon fontSize="small" />
            <Typography variant="h6">Archived cards</Typography>
          </Box>
          <CancelIcon color="error" sx={{ cursor: 'pointer', '&:hover': { color: 'error.light' } }} onClick={onClose} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              size="small"
              checked={isAllSelected}
              indeterminate={selectedIds.length > 0 && !isAllSelected}
              onChange={handleToggleSelectAll}
              disabled={cards.length === 0}
            />
            <Typography variant="body2">Select all</Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            disabled={selectedIds.length === 0}
            onClick={handleRestoreSelected}
          >
            Restore selected ({selectedIds.length})
          </Button>
        </Box>

        <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"/>
                <TableCell>No.</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Cover</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cards.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary' }}>
                    No results found.
                  </TableCell>
                </TableRow>
              )}
              {cards.map((card, index) => (
                <TableRow key={card._id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selectedIds.includes(card._id)}
                      onChange={() => handleToggleSelectOne(card._id)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {card.title}
                  </TableCell>
                  <TableCell>
                    {card.cover
                      ? <Box component="img" src={card.cover} sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} />
                      : '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(card.archivedAt).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Restore">
                      <IconButton size="small" onClick={() => handleRestoreOne(card._id)}>
                        <UnarchiveOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  )
}

export default ArchivedCards