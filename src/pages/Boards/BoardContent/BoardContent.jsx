import Box from '@mui/material/Box';
import ListColumns from './ListColumns/ListColumns';
import { 
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
} from '@dnd-kit/core';
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors';
import { useEffect, useState, useCallback, useRef } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { cloneDeep, isEmpty } from 'lodash';
import { generatePlaceholderCard } from '~/utils/formatters';

import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/Card/Card';

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewColumn, createNewCard, moveColumns, moveCardInTheSameColumn }) {
  // Nếu dùng PointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở những phần tử kéo thả (còn bug)
  // const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 }});
  
  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click khi gọi event
  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 }});
  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {activationConstraint: { delay: 250, tolerance: 500 }});
  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  // Cùng 1 thời điểm chỉ có thể kéo được 1 phần tử(column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState([null]);
  const [activeDragItemType, setActiveDragItemType] = useState([null]);
  const [activeDragItemData, setActiveDragItemData] = useState([null]);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState([null]);

  // Điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null)

  useEffect(() => {
    // Column đã được sắp xếp ở component cha cao nhất
    setOrderedColumns(board.columns);
  }, [board]);

  // Tìm column dựa theo Id 
  const findColumnByCardId = (cardId) => {
    // Nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId));
  };

  // Cập nhật lại state trong trường hợp di chuyển card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId);

      // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
      let newCardIndex;
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0;
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

      // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
      const nextColumns = cloneDeep([...prevColumns]);
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id);
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id);

      // nextActiveColumn: Column cũ
      if (nextActiveColumn) {
        // Xóa card ở cái column active (cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang column khác) 
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId);

        // Thêm Placeholder Card nếu column rỗng: bị kéo hết Card đi, không còn cái nào nữa.
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // nextOverColumn: Column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn hay chưa, nếu có thì xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId);

        // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData);

        // Xóa cái Placeholder Card đi nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard);

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id);
      }

      return nextColumns;
    })
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN);
    setActiveDragItemData(event?.active?.data?.current);

    // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  // Trigger trong quá trình kéo 1 phần tử 
  const handleDragOver = (event) => {
    // Không làm gì thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
    
    // Nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    // console.log('handleDragEnd', event);

    const { active, over } = event;

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return;

    // activeDraggingCard: Là card đang được kéo 
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active;
    // overCard: là card đang tương tác trên hoặc dưới so với card đang được kéo ở trên 
    const { id: overCardId } = over;

    // Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    // Nếu không tồn tại 1 trong 2 column thì không làm gì hết để tránh crash trang web
    if (!activeColumn || !overColumn) return;

    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn chung 1 column thì không làm gì
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return;

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: Là card đang được kéo 
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active;
      // overCard: là card đang tương tác trên hoặc dưới so với card đang được kéo ở trên 
      const { id: overCardId } = over;

      // Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      // Nếu không tồn tại 1 trong 2 column thì không làm gì hết để tránh crash trang web
      if (!activeColumn || !overColumn) return;

      // Hành động kéo thả giữa 2 column khác nhau
      // Phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart)
      // mà không phải là activeData trong scope handleDragEnd này là vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật 1 lần rồi
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo thả trong cùng 1 column
        // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId);
        // Lấy vị trí mới (từ thằng over)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId);

        // Dùng arrayMove vì kéo card trong 1 cái column thì tương tự với logic kéo column trong 1 cái board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex); 
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)

        // Vẫn gọi update state ở đây để tránh delay hoặc Flickering giao diện lúc kéo thả cần phải chờ gọi API
        setOrderedColumns(prevColumns => {
          // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
          const nextColumns = cloneDeep([...prevColumns]);

          // Tìm tới cái Column mà chúng ta đang thả 
          const targetColumn = nextColumns.find(column => column._id === overColumn._id);

          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCardIds

          // Trả về giá trị state mới (chuẩn vị trí)
          return nextColumns;
        });

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí sau khi kẻo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy vị trí cũ (từ thằng active)
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id);
        // Lấy vị trí mới (từ thằng over)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id);

        // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng Columns ban đầu
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex);

      // Vẫn gọi update State ở đây để tránh delay hoặc Flickering giao diện lúc kéo thả cần phải chờ gọi API
      // (small trick)
      setOrderedColumns(dndOrderedColumns);
        
      /**
       * Gọi lên props function moveColumns nằm ở component cha cao nhất (boards/_id.jsx)
       * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ: với mình thì chúng ta sẽ
       * đưa dữ liệu Board ra ngoài Redux Global Store,
       * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những
       * component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ :D)
       * - Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.
       */
        moveColumns(dndOrderedColumns)
      }
    }

    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  // Custom lại chiến lược/thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa nhiều columns
  // args = arguments = các đối số, tham số
  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
   
    // Các điểm giao nhau - va chạm - intersections với con trỏ
    const pointerIntersecsions = pointerWithin(args);

    // Nếu pointerIntersecsions là mảng rỗng, return luôn và không làm gì hết.
    // Fix triệt để cái bug flickering của thư viện Dnd-kit trong trường hợp sau:
    // Kéo một card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả
    if (!pointerIntersecsions?.length) return;

    // Thuật toán phát hiện va chạm sẽ trả về một mảng va chạm ở đây
    // const intersections = !!pointerIntersecsions?.length
    //   ? pointerIntersecsions
    //   : rectIntersection(args);

    // Tìm overId đầu tiên trong đám pointerIntersecsions ở trên
    let overId = getFirstCollision(pointerIntersecsions, 'id');
    if (overId) {
      // Nếu cái over nó là column thì sẽ tìm tới cardId gần nhất bên trong khu vực đó dựa vào thuật toán phát hiện va chạm closestCenter/closestCorners
      const checkColumn = orderedColumns.find(column => column._id === overId);
      if (checkColumn) {
        // console.log('Before: ', overId);
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds.includes(container.id))
          })
        })[0]?.id
        // console.log('After: ', overId);
      }

      lastOverId.current = overId;
      return [{ id: overId }]
    }

    // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : [];
  }, [activeDragItemType])

  return (
    <DndContext 
      // Cảm biến
      sensors={sensors}
      // Thuật toán phát hiện va chạm 
      // (nếu không có nó thì card với cover lớn sẽ không kéo qua Column được vì lúc này nó đang bị conflict giữa card và column)
      // Dùng closestCorners thay vì closestCenter
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handleDragEnd} 
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <Box sx={{ 
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'), 
        width: '100%', 
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} createNewColumn={createNewColumn} createNewCard={createNewCard}/>
        <DragOverlay dropAnimation={customDropAnimation}>
          {activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
