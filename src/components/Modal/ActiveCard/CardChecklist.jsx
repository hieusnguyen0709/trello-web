import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import AddIcon from '@mui/icons-material/Add'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import IconButton from '@mui/material/IconButton'

function CardChecklist({
  checklist,
  onUpdateChecklist,
  onDeleteChecklist,
  onAddChecklistItem,
  onUpdateChecklistItem,
  onDeleteChecklistItem
}) {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState('')

  // ===== Progress =====
  const progress = useMemo(() => {
    if (!checklist.items?.length) return 0
    const done = checklist.items.filter(i => i.isCompleted).length
    return Math.round((done / checklist.items.length) * 100)
  }, [checklist.items])

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return

    onAddChecklistItem?.(checklist._id, {
      title: newItemTitle.trim()
    })

    setNewItemTitle('')
    setIsAddingItem(false)
  }

  return (
    <>
      {/* ===== HEADER ===== */}
      <Box
        sx={{
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TaskAltOutlinedIcon />

          <ToggleFocusInput
            inputFontSize="18px"
            value={checklist.title}
            onChangedValue={(newTitle) =>
              onUpdateChecklist(checklist._id, { title: newTitle })
            }
          />
        </Box>

        <Button
          onClick={() => onDeleteChecklist?.(checklist._id, checklist.title)}
          type="button"
          variant="contained"
          color="error"
          size="small"
          startIcon={<CloseOutlinedIcon />}
        >
          Delete
        </Button>
      </Box>

      {/* ===== PROGRESS ===== */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">{progress}%</Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ flexGrow: 1, height: 8, borderRadius: 5 }}
          />
        </Box>
      </Box>

      {/* ===== ITEMS ===== */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {checklist.items?.map(item => (
            <Box
              key={item._id}
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pr: 4
              }}
            >
            <Checkbox
              checked={item.isCompleted}
              onChange={(e) =>
                onUpdateChecklistItem?.(
                  checklist._id,
                  item._id,
                  { isCompleted: e.target.checked }
                )
              }
            />

            <ToggleFocusInput
              value={item.title}
              inputFontSize="14px"
              textDecoration={item.isCompleted ? 'line-through' : 'none'}
              onChangedValue={(newTitle) =>
                onUpdateChecklistItem?.(
                  checklist._id,
                  item._id,
                  { title: newTitle }
                )
              }
            />

            {/* DELETE ITEM */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteChecklistItem?.(checklist._id, item._id)
              }}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 6,
                transform: 'translateY(-50%)',
                bgcolor: 'error.light',
                color: '#fff',
                width: 24,
                height: 24,

                '&:hover': {
                  bgcolor: 'error.main',
                  color: '#fff'
                }
              }}
            >
              <CloseOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* ===== ADD ITEM ===== */}
      <Box sx={{ mt: 2 }}>
        {!isAddingItem ? (
          <Button
            startIcon={<AddIcon />}
            size="small"
            onClick={() => setIsAddingItem(true)}
          >
            Add an item 
          </Button>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              autoFocus
              size="small"
              placeholder="Enter item..."
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              onBlur={handleAddItem}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddItem()
                if (e.key === 'Escape') {
                  setIsAddingItem(false)
                  setNewItemTitle('')
                }
              }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="contained" onClick={handleAddItem}>
                Add
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setIsAddingItem(false)
                  setNewItemTitle('')
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  )
}

export default CardChecklist