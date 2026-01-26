import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'

import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator, multiFilesValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'
import SidebarCreateChecklistModal from './SidebarCreateChecklistModal'
import {
  clearAndHideCurrentActiveCard,
  selectCurrentActiveCard,
  updateCurrentActiveCard,
  selectIsShowModalActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { updateCardDetailsAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import { getFileExtension, isImageFile } from '~/utils/showActtachmentFile'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import IconButton from '@mui/material/IconButton'
import { useConfirm } from 'material-ui-confirm'
import Button from '@mui/material/Button'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const currentUser = useSelector(selectCurrentUser)

  // const [isOpen, setIsOpen] = useState(true)
  // const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => {
    // setIsOpen(false)
    dispatch(clearAndHideCurrentActiveCard())
  }

  const callApiUpdateCard = async (updateData) => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData)

    dispatch(updateCurrentActiveCard(updatedCard))

    dispatch(updateCardInBoard(updatedCard))
    
    return updatedCard
  }

  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }

  const onUploadCardCover = (event, type = 'image') => {
    const error = singleFileValidator(event.target?.files[0], type)
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    toast.promise(
      callApiUpdateCard(reqData).finally(() => event.target.value = ''),
      {
        pending: 'Uploading...',
        success: 'Successfully uploaded!',
        error: {
          render({ data }) {
            return data?.message || 'Upload failed!'
          }
        }
      }
    )
  }

  const onUploadCardAttachment = (event, type = 'file') => {
    const files = Array.from(event.target.files)
    const error = multiFilesValidator(files, type)
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    files.forEach(file => {
      reqData.append('cardAttachments', file)
    })

    toast.promise(
      callApiUpdateCard(reqData).finally(() => event.target.value = ''),
      {
        pending: 'Uploading...',
        success: 'Successfully uploaded!',
        error: {
          render({ data }) {
            return data?.message || 'Upload failed!'
          }
        }
      }
    )
  }

  const confirmDeleteCardAttachment = useConfirm()
  const handleDeleteCardAttachment = (e, fileUrl) => {
    e.stopPropagation();
    confirmDeleteCardAttachment({
      title: 'Remove this file?',
      description: 'This action will permanently remove your attachment! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
    }).then(() => {
      const reqData = {
        cardAttachmentRemove: fileUrl
      }

      toast.promise(
        callApiUpdateCard(reqData),
        {
          pending: 'Removing...',
          success: 'Successfully removed!',
          error: {
            render({ data }) {
              return data?.message || 'Remove failed!'
            }
          }
        }
      )
    })
    .catch(() => {})
  }

  const onCreateCardChecklist = (newChecklist) => {
    callApiUpdateCard({
      checklistAction: {
        type: 'ADD',
        data: newChecklist
      }
    })
  }

  const onUpdateCardChecklist = (checklistId, updateData) => {
    callApiUpdateCard({
      checklistAction: {
        type: 'UPDATE',
        checklistId,
        data: updateData
      }
    })
  }

  const confirmDeleteCardChecklist = useConfirm()
  const handleDeleteCardChecklist = (checklistId, checklistTitle) => {
    confirmDeleteCardChecklist({
      title: `Delete ${checklistTitle}?`,
      description: 'This action will permanently delete your checklist! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
    }).then(() => {
      toast.promise(
        callApiUpdateCard({
          checklistAction: {
            type: 'DELETE',
            checklistId
          }
        }),
        {
          pending: 'Deleting...',
          success: 'Successfully deleted!',
          error: {
            render({ data }) {
              return data?.message || 'Delete failed!'
            }
          }
        }
      )
    })
    .catch(() => {})
  }

  // Dùng async/await ở đây để component CardActivitySection chờ và nếu thành công thì mới clear thẻ input comment
  const onAddCardComment = async (commentToAdd) => {
    await callApiUpdateCard({ commentToAdd })
  }

  const onUpdateCardMembers = (incomingMemberInfo) => {
    callApiUpdateCard({ incomingMemberInfo })
  }

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: 900,
        maxWidth: 900,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover &&
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
              src={activeCard?.cover}
              alt="card-cover"
            />
          </Box>
        }

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle} />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup 
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor 
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <AttachFileOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Attachment</Typography>
              </Box>

              <Stack spacing={1}>
                {activeCard?.attachments?.map((fileUrl, index) => {
                  const fileName = decodeURIComponent(fileUrl.split('/').pop())
                  const ext = getFileExtension(fileUrl)
                  const isImage = isImageFile(ext)
                  return (
                    <Box
                      key={index}
                      onClick={() => window.open(`${fileUrl}?fl_attachment`, '_blank')}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        gap: 2,
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'grey.100'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 60,
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {isImage ? (
                          <img
                            src={fileUrl}
                            alt={fileName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: 'text.secondary'
                            }}
                          >
                            {ext.toUpperCase()}
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteCardAttachment(e, fileUrl)}
                        sx={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
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
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 500,
                            wordBreak: 'break-word'
                          }}
                        >
                          {fileName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {isImage ? 'Click to view' : 'Click to download'}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Stack>
            </Box>

            {activeCard?.checklist?.length > 0 && (
              activeCard.checklist.map((checklist) => (
                <Box key={checklist._id} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <TaskAltOutlinedIcon />
                      <ToggleFocusInput
                        inputFontSize='18px'
                        value={checklist.title}
                        onChangedValue={(newTitle) =>
                          onUpdateCardChecklist(checklist._id, { title: newTitle })
                        }
                      />
                    </Box>

                    <Button
                      onClick={() => handleDeleteCardChecklist(checklist._id, checklist.title)}
                      type="button"
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<CloseOutlinedIcon />}
                    >
                      Delete
                    </Button>
                  </Box>

                  {/* Nơi render checklist items */}
                  {/* <ChecklistItems checklist={checklist} /> */}
                </Box>
              ))
            )}

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Activity</Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection 
                cardComments={activeCard?.comments}
                onAddCardComment={onAddCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {!activeCard?.memberIds?.includes(currentUser._id) &&
                <SidebarItem 
                  className="active" 
                  onClick={() => onUpdateCardMembers({ 
                    userId: currentUser._id,
                    action: CARD_MEMBER_ACTIONS.ADD
                  })}
                >
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Join
                </SidebarItem>
              }

              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem className="active" component="label">
                <AttachFileOutlinedIcon fontSize="small" />
                Attachment
                <VisuallyHiddenInput type="file" multiple onChange={onUploadCardAttachment} />
              </SidebarItem>
              <SidebarItem><LocalOfferOutlinedIcon fontSize="small" />Labels</SidebarItem>
              <SidebarCreateChecklistModal onCreateChecklist={onCreateCardChecklist}>
                <SidebarItem>
                  <TaskAltOutlinedIcon fontSize="small" />
                  Checklist
                </SidebarItem>
              </SidebarCreateChecklistModal>
              <SidebarItem><WatchLaterOutlinedIcon fontSize="small" />Dates</SidebarItem>
              <SidebarItem><AutoFixHighOutlinedIcon fontSize="small" />Custom Fields</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><AspectRatioOutlinedIcon fontSize="small" />Card Size</SidebarItem>
              <SidebarItem><AddToDriveOutlinedIcon fontSize="small" />Google Drive</SidebarItem>
              <SidebarItem><AddOutlinedIcon fontSize="small" />Add Power-Ups</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><ArrowForwardOutlinedIcon fontSize="small" />Move</SidebarItem>
              <SidebarItem><ContentCopyOutlinedIcon fontSize="small" />Copy</SidebarItem>
              <SidebarItem><AutoAwesomeOutlinedIcon fontSize="small" />Make Template</SidebarItem>
              <SidebarItem><ArchiveOutlinedIcon fontSize="small" />Archive</SidebarItem>
              <SidebarItem><ShareOutlinedIcon fontSize="small" />Share</SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
