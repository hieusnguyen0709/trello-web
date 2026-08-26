import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Link, useLocation } from 'react-router-dom'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'
import { fetchBoardsAPI, updateBoardDetailsAPI, deleteBoardDetailsAPI } from '~/apis'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'
import { useSmartLoading } from '~/customHooks/useSmartLoading'
import { useConfirm } from 'material-ui-confirm'
import ActiveBoard from '~/components/Modal/ActiveBoard/ActiveBoard'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { styled } from '@mui/material/styles'
// Styles của mấy cái Sidebar item menu, anh gom lại ra đây cho gọn.
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

function Boards() {
  const currentUser = useSelector(selectCurrentUser)
  const [anchorEl, setAnchorEl] = useState(null)
  const [activeBoard, setActiveBoard] = useState(null)
  const [openEditBoard, setOpenEditBoard] = useState(false)
  const openMenuBoard = Boolean(anchorEl)

  const handleClickBoard = (event, board) => {
    setAnchorEl(event.currentTarget)
    setActiveBoard(board)
  }

  const handleCloseBoard = () => {
    setAnchorEl(null)
  }

  const handleEditBoard = () => {
    setOpenEditBoard(true)
  }

  const handleSubmitEditBoard = (data) => {
    updateBoardDetailsAPI(activeBoard._id, data).then(() => {
      setOpenEditBoard(false)
      fetchBoardsAPI(location.search).then(updateStateData)
    })
  }

  const confirmDeleteColumn = useConfirm()
  const handleDeleteBoard = () => {
    confirmDeleteColumn({
      title: 'Delete Board?',
      description: 'This action will permanently delete your Board and all its data! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      deleteBoardDetailsAPI(activeBoard._id).then((res) => {
        toast.success(res?.deleteResult)
        fetchBoardsAPI(location.search).then(updateStateData)
      })
    }).catch(() => {})
  }
  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null)
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null)

  // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
  const location = useLocation()
  /**
   * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
   */
  const query = new URLSearchParams(location.search)
  /**
   * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
   * Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
   */
  const page = parseInt(query.get('page') || '1', 10)

  const showSpinner = useSmartLoading(!boards)

  const updateStateData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  useEffect(() => {
    // Fake tạm 16 cái item thay cho boards
    // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    // setBoards([...Array(16)].map((_, i) => i))
    // Fake tạm giả sử trong Database trả về có tổng 100 bản ghi boards
    // setTotalBoards(100)

    // Mỗi khi cái url thay đổi ví dụ như chúng ta chuyển trang, thì cái location.search lấy từ hook
    // useLocation của react-router-dom cũng thay đổi theo, đồng nghĩa hàm useEffect sẽ chạy lại và fetch lại API
    // theo đúng page mới vì cái location.search đã nằm trong dependencies của useEffect

    // Gọi API lấy danh sách boards ở đây...
    fetchBoardsAPI(location.search).then(updateStateData)
    // ...
  }, [location.search])

  const afterCreateNewBoard = () => {
    fetchBoardsAPI(location.search).then(updateStateData)
  }

  if (showSpinner) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return null // đang trong khoảng SHOW_DELAY (chưa đủ lâu để hiện spinner)
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
              <ActiveBoard
                open={openEditBoard}
                mode="edit"
                initialData={activeBoard}
                onClose={() => setOpenEditBoard(false)}
                onSubmit={handleSubmitEditBoard}
              />
            </Stack>
          </Grid>

          <Grid xs={12} sm={9}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Your boards:</Typography>

            {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
            {boards?.length === 0 &&
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>No result found!</Typography>
            }

            {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
            {boards?.length > 0 &&
              <Grid container spacing={2}>
                {boards.map(b => {
                  const isOwner = b.ownerIds?.some(ownerId => ownerId === currentUser?._id)

                  return (
                    <Grid xs={2} sm={3} md={4} key={b._id}>
                      <Card sx={{ width: '250px' }}>
                        {/* Ý tưởng mở rộng về sau làm ảnh Cover cho board */}
                        {/* <CardMedia component="img" height="100" image="https://picsum.photos/100" /> */}
                        <Box sx={{ height: '50px', backgroundColor: b.bgColor || 'gray' }}></Box>

                        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Tooltip title={b?.title || ''}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 'bold',
                                  minWidth: 0,
                                  flex: 1,
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis',
                                  cursor: 'default'
                                }}
                              >
                                {b?.title}
                              </Typography>
                            </Tooltip>

                            <Tooltip title="More options">
                              <ExpandMore
                                sx={{
                                  color: 'text.primary',
                                  cursor: 'pointer'
                                }}
                                id="basic-board-dropdown"
                                aria-controls={openMenuBoard ? 'basic-menu-board-dropdown' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openMenuBoard ? 'true' : undefined}
                                onClick={(event) => handleClickBoard(event, b)}
                              />
                            </Tooltip>

                            <Menu
                              id="basic-menu-board-dropdown"
                              anchorEl={anchorEl}
                              open={openMenuBoard}
                              onClose={handleCloseBoard}
                              onClick={handleCloseBoard}
                              MenuListProps={{
                                'aria-labelledby': 'basic-board-dropdown'
                              }}
                            >
                              <MenuItem
                                onClick={handleEditBoard}
                                sx={{
                                  '&:hover': {
                                    color: 'primary.main',
                                    '& .edit-icon': { color: 'primary.main' }
                                  }
                                }}>
                                <ListItemIcon>
                                  <EditIcon className="edit-icon" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Edit this board</ListItemText>
                              </MenuItem>

                              {isOwner && [
                                <Divider key="divider" />,
                                <MenuItem
                                  key="delete"
                                  onClick={handleDeleteBoard}
                                  sx={{
                                    '&:hover': {
                                      color: 'warning.dark',
                                      '& .delete-forever-icon': { color: 'warning.dark' }
                                    }
                                  }}>
                                  <ListItemIcon><DeleteForeverIcon className="delete-forever-icon" fontSize="small" /></ListItemIcon>
                                  <ListItemText>Delete this board</ListItemText>
                                </MenuItem>
                              ]}
                            </Menu>
                          </Box>
                          <Tooltip title={b?.description || ''}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              {b?.description}
                            </Typography>
                          </Tooltip>
                          <Box
                            component={Link}
                            to={`/boards/${b?._id}`}
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              color: 'primary.main',
                              '&:hover': { color: 'primary.light' }
                            }}>
                            Go to board <ArrowRightIcon fontSize="small" />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            }

            {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
            {(totalBoards > 0) &&
              <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  // Giá trị prop count của component Pagination là để hiển thị tổng số lượng page, công thức là lấy Tổng số lượng bản ghi chia cho số lượng bản ghi muốn hiển thị trên 1 page (ví dụ thường để 12, 24, 26, 48...vv). sau cùng là làm tròn số lên bằng hàm Math.ceil
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  // Giá trị của page hiện tại đang đứng
                  page={page}
                  // Render các page item và đồng thời cũng là những cái link để chúng ta click chuyển trang
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            }
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards
