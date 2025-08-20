import Box from '@mui/material/Box';
import ListColumns from './ListColumns/ListColumns';
import { mapOrder } from '~/utils/sorts';
import { 
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

function BoardContent({ board }) {
  // Nếu dùng PointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở những phần tử kéo thả (còn bug)
  // const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 }});
  
  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click khi gọi event
  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 }});
  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {activationConstraint: { delay: 250, tolerance: 500 }});
  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event);
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      // Lấy vị trí cũ (từ thằng active)
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id);
      // Lấy vị trí mới (từ thằng over)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id);

      // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng Columns ban đầu
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id);
      // console.log(dndOrderedColumns);
      // console.log(dndOrderedColumnsIds);

      setOrderedColumns(dndOrderedColumns);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{ 
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'), 
        width: '100%', 
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
