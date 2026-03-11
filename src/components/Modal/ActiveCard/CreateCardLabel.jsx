import { useState } from 'react'
import {
  Box,
  Popover,
  Typography,
  TextField,
  Checkbox,
  IconButton,
  Button
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import CheckIcon from '@mui/icons-material/Check'
import Divider from '@mui/material/Divider'

const LABEL_COLORS = [
  '#61bd4f','#f2d600','#ff9f1a','#eb5a46','#c377e0',
  '#B7F5D8', '#F5EA7C', '#FFE3A3', '#FFD6D2', '#EBD9FF',
  '#4FD1A1', '#F2D024', '#FFA500', '#FF7A6E', '#C77DFF',
  '#1E8449', '#9A7D0A', '#D35400', '#C0392B', '#8E44AD',
  '#D6E6FF', '#CFF1FF', '#D6F5B2', '#FFD6EC', '#E0E0E0',
  '#6FA8FF', '#6EC6DF', '#9ACA3C', '#EC77C2', '#8E8E93',
]

function CreateCardLabel({ children, boardLabels = [], cardLabels = [], addLabel, updateLabel, deleteLabel, toggleLabel }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [view, setView] = useState('LIST')
  const [title, setTitle] = useState('')
  const [color, setColor] = useState(LABEL_COLORS[0])
  const [editingLabel, setEditingLabel] = useState(null)

  const open = Boolean(anchorEl)

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    resetToViewList()
  }

  const handleSave = () => {
    const labelTitle = title.trim() || 'Empty'
    if (editingLabel) {
      updateLabel(editingLabel._id, { title: labelTitle, color })
    } else {
      addLabel({ title: labelTitle, color })
    }
    resetToViewList()
  }

  const handleDelete = () => {
    deleteLabel(editingLabel._id)
    resetToViewList()
  }

  const resetToViewList = () => {
    setView('LIST')
    setTitle('')
    setColor('')
    setEditingLabel(null)
  }

  return (
    <>
      <Box onClick={handleOpen}>
        {children}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: window.innerHeight / 2,
          left: window.innerWidth / 2
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        PaperProps={{
          sx: {
            width: 320,
            borderRadius: 2,
            p: 1.5
          }
        }}
      >
        {/* ===== HEADER ===== */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1
          }}
        >
          {view === 'CREATE' && (
            <IconButton size="small" onClick={() => setView('LIST')}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LocalOfferOutlinedIcon />
          <Typography sx={{ flex: 1, textAlign: 'center', fontWeight: 600 }} variant="h6">
            {view === 'LIST' ? 'Label' : 'Create new label'}
          </Typography>
        </Box>

          <Box sx={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}>
            <CancelIcon
              color="error"
              sx={{ '&:hover': { color: 'error.light' } }}
              onClick={handleClose}
            />
          </Box>
        </Box>

       {/* ===== LIST VIEW ===== */}
        {view === 'LIST' && (
          <>
            <TextField fullWidth size="small" placeholder="Find label..." sx={{ mb: 1.5 }} />
            {boardLabels.length > 0 && (
              <>
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
                  Labels
                </Typography>

                {boardLabels.map(label => {
                  const isChecked = cardLabels.includes(label._id)

                  return (
                    <Box
                      key={label._id}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        onChange={() => toggleLabel(label._id)}
                      />

                      <Box
                       onClick={() => toggleLabel(label._id)}
                        sx={{
                          flex: 1,
                          height: 32,
                          borderRadius: 1,
                          bgcolor: label.color,
                          cursor: 'pointer',
                          opacity: 1,
                          '&:hover': { opacity: 0.8 }
                        }}
                      />

                      <IconButton size="small"  
                        onClick={() => {
                          setEditingLabel(label)
                          setTitle(label.title)
                          setColor(label.color)
                          setView('CREATE')
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )
                })}
              </>
            )}

            <Button
              fullWidth
              variant='outlined'
              color='inherit'
              sx={{ mt: 1.5 }}
              onClick={() => {
                setEditingLabel('')
                setTitle('')
                setColor('')
                setView('CREATE')
              }}
            >
              Create label
            </Button>
          </>
        )}

          {/* ===== CREATE VIEW ===== */}
          {view === 'CREATE' && (
            <>
              <Box
                sx={{
                  height: 32,
                  borderRadius: 1,
                  bgcolor: color,
                  mb: 2,
                  px: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#fff',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
                }}
              >
                {title || ' '}
              </Box>

              <TextField
                fullWidth
                size="small"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Typography sx={{ fontSize: 14, mb: 1 }}>
                Pick a color
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {LABEL_COLORS.map(c => {
                  const isSelected = c === color

                  return (
                    <Box
                      key={c}
                      onClick={() => setColor(c)}
                      sx={{
                        width: 52,
                        height: 34,
                        borderRadius: 1,
                        bgcolor: c,
                        cursor: 'pointer',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isSelected ? 1 : 0.9,
                        '&:hover': { opacity: 1 }
                      }}
                    >
                      {isSelected && (
                        <CheckIcon
                          sx={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 700
                          }}
                        />
                      )}
                    </Box>
                  )
                })}
                <Button
                  fullWidth
                  variant='outlined'
                  color='inherit'
                  sx={{ mt: 1.5 }}
                  disabled={!color}
                  onClick={() => setColor(null)}
                >
                  Remove label
                </Button>
              </Box>

              <Divider sx={{ mt: 2, opacity: 0.6, bgcolor: 'gray'}} />
              <Box
                sx={{
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1
                }}
              >
                <Button
                  variant='contained'
                  sx={{ mt: 2, width: '70px' }}
                  onClick={handleSave}
                >
                  Save
                </Button>
                {editingLabel && (
                  <Button
                    variant='contained'
                    color='error'
                    sx={{ mt: 2, width: '70px' }}
                    onClick={handleDelete}  
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </>
          )}
      </Popover>
    </>
  )
}

export default CreateCardLabel
