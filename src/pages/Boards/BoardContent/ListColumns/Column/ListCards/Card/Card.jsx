import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import GroupIcon from '@mui/icons-material/Group';
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice';
import Box from '@mui/material/Box'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import Tooltip from '@mui/material/Tooltip'
function Card({ card }) {    
    const dispatch = useDispatch()
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: card._id, data: {...card}});
    
    const dndKitCardsStyles = {
        // touchAction: 'none',
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
        border: isDragging ? '1px solid #2ecc71' : undefined
    };

    const shouldShowCardActions = () => {
        if (!!card?.memberIds?.length || !!card?.comments?.length || card?.attachments?.length) {
            return true;
        } 
        return false;
    }

    const setActiveCard = () => {
        dispatch(updateCurrentActiveCard(card))
        dispatch(showModalActiveCard())
    }

    const board = useSelector(selectCurrentActiveBoard)
    const cardLabels = board?.labels?.filter(label =>
        card?.labelIds?.includes(label._id)
    ) || []
  return (
    <MuiCard 
        onClick={setActiveCard}
        ref={setNodeRef} style={dndKitCardsStyles} {...attributes} {...listeners}
        sx={{ 
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
            overflow: 'unset',
            display: card?.FE_PlaceholderCard ? 'none' : 'block',
            border: '1px solid transparent',
            '&:hover': { borderColor: (theme) => theme.palette.primary.main }
            // overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset',
            // display: card?.FE_PlaceholderCard ? '0px' : 'unset
        }}
    >
        {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}
        <CardContent
            sx={{
                p: 1.5,
                pb: 0.5,
                '&:last-child': { p: 1.5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}
        >
            {cardLabels.length > 0 && (
                <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {cardLabels.map(label => (  
                        <Tooltip title={label.title}>
                            <Box
                            key={label._id}
                            sx={{
                                height: 8,
                                minWidth: 38,
                                borderRadius: '4px',
                                backgroundColor: label.color,
                                cursor: 'pointer',
                                transition: 'filter .15s ease',

                                '&:hover': {
                                    filter: 'brightness(1.15)'
                                }
                            }}
                            />
                        </Tooltip>
                    ))}
                </Box>
            )}
        <Typography>{card?.title}</Typography>
        </CardContent>
        {shouldShowCardActions() &&
            <CardActions sx={{ p: '0 4px 8px 4px' }}>
                {!!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon/>}>{card?.memberIds?.length}</Button>}
                {!!card?.comments?.length && <Button size="small" startIcon={<CommentIcon/>}>{card?.comments?.length}</Button>}
                {!!card?.attachments?.length && <Button size="small" startIcon={<AttachmentIcon/>}>{card?.attachments?.length}</Button>}
            </CardActions>
        }
    </MuiCard>
  )
}

export default Card
