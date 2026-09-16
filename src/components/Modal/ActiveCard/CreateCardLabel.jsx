import { useState, useMemo } from 'react'
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
import Tooltip from '@mui/material/Tooltip'
import { toast } from 'react-toastify'
import { LABEL_COLORS } from '~/utils/constants'

function CreateCardLabel({ children, boardLabels = [], cardLabels = [], addLabel, updateLabel, deleteLabel, toggleLabel }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [view, setView] = useState('LIST')
  const [title, setTitle] = useState('')
  const [color, setColor] = useState(LABEL_COLORS[0])
  const [editingLabel, setEditingLabel] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const keyword = searchValue.trim().toLowerCase()
  const filteredLabels = useMemo(() => {
    if (!keyword) return boardLabels
    return boardLabels.filter(label =>
      label.title.toLowerCase().includes(keyword)
    )
  }, [boardLabels, keyword])

  const open = Boolean(anchorEl)

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    resetToViewList()
  }

  const handleSave = async () => {
    const labelTitle = title.trim() || 'Empty'
    setSaving(true)
    try {
      if (editingLabel) {
        await updateLabel(editingLabel._id, { title: labelTitle, color })
      } else {
        await addLabel({ title: labelTitle, color })
      }
      resetToViewList()
    } catch (error) {
      toast.error('Failed to save label. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteLabel(editingLabel._id)
      resetToViewList()
    } catch (error) {
      toast.error('Failed to delete label. Please try again.')
    } finally {
      setDeleting(false)
    }
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
            <TextField
              fullWidth size="small"
              placeholder="Find label..."
              sx={{ mb: 1.5 }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {filteredLabels.length > 0 && (
              <>
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
                  Labels
                </Typography>

                {filteredLabels.map(label => {
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

                      <Tooltip title={label.title}>
                        <Box
                          onClick={() => toggleLabel(label._id)}
                          sx={{
                            height: 32,
                            width: '100%',
                            px: 1,
                            borderRadius: '6px',
                            backgroundColor: label.color,
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '12px',
                            fontFamily: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all .15s ease',
                            boxShadow: 'inset 0 -2px rgba(0,0,0,.2)',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            '&:hover': {
                              filter: 'brightness(1.15)'
                            }
                          }}
                        >
                          {label.title !== 'Empty' && label.title}
                        </Box>
                      </Tooltip>

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

            {filteredLabels.length === 0 && keyword && (
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 1 }}>
                No labels found
              </Typography>
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

            <Divider sx={{ mt: 2, opacity: 0.6, bgcolor: 'gray' }} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1
              }}
            >
              <Tooltip title={!color ? 'Pick a color first' : ''}>
                <span>
                  <Button
                    variant='contained'
                    sx={{ mt: 2, width: '70px' }}
                    onClick={handleSave}
                    disabled={saving || deleting || !color}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </span>
              </Tooltip>
              {editingLabel && (
                <Button
                  variant='contained'
                  color='error'
                  sx={{ mt: 2, width: '70px' }}
                  onClick={handleDelete}
                  disabled={saving || deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
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
