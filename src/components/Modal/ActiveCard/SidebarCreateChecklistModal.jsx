import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import CancelIcon from '@mui/icons-material/Cancel'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

function SidebarCreateChecklistModal({ children, onCreateChecklist }) {
  const { register, handleSubmit, reset, formState: { errors } = {} } = useForm()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => {
    setIsOpen(false)
    reset()
  }

  const submitCreateChecklist = (data) => {
    onCreateChecklist?.(data)
    handleCloseModal()
  }

  return (
    <>
      {/* Trigger: UI từ component cha */}
      <Box onClick={handleOpenModal}>
        {children}
      </Box>

      {/* Modal */}
      <Modal open={isOpen}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
          boxShadow: 24,
          borderRadius: '8px',
          p: '20px 30px',
          outline: 0
        }}>
          {/* Close */}
          <Box sx={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}>
            <CancelIcon
              color="error"
              sx={{ '&:hover': { color: 'error.light' } }}
              onClick={handleCloseModal}
            />
          </Box>

          {/* Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TaskAltOutlinedIcon />
            <Typography variant="h6">
              Create a new checklist
            </Typography>
          </Box>

          {/* Form */}
          <Box sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitCreateChecklist)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Title"
                    {...register('title', {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: { value: 3, message: 'Min length is 3 characters' },
                      maxLength: { value: 50, message: 'Max length is 50 characters' }
                    })}
                    error={!!errors?.title}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AbcIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                  <FieldErrorAlert errors={errors} fieldName="title" />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    {...register('description', {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: { value: 3, message: 'Min length is 3 characters' },
                      maxLength: { value: 255, message: 'Max length is 255 characters' }
                    })}
                    error={!!errors?.description}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                  <FieldErrorAlert errors={errors} fieldName="description" />
                </Box>

                <Box sx={{ alignSelf: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Create
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default SidebarCreateChecklistModal
