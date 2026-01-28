import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { getFileExtension, isImageFile } from '~/utils/showActtachmentFile'

function CardAttachment({ attachments = [], onDeleteAttachment }) {
  if (!attachments.length) {
    return (
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          color: '#b1b1b1',
          mt: 1
        }}
      >
        No attachments
      </Typography>
    )
  }

  return (
    <Stack spacing={1}>
      {attachments.map((fileUrl) => {
        const fileName = decodeURIComponent(fileUrl.split('/').pop())
        const ext = getFileExtension(fileUrl)
        const isImage = isImageFile(ext)

        return (
          <Box
            key={fileUrl}
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
            {/* ===== Thumbnail ===== */}
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

            {/* ===== Delete button ===== */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteAttachment?.(fileUrl)
              }}
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

            {/* ===== Info ===== */}
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
  )
}

export default CardAttachment
