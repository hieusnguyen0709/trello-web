import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import { API_ROOT } from "~/utils/constants";
import { mapOrder } from '~/utils/sorts';
import { isEmpty } from 'lodash';
import { generatePlaceholderCard } from '~/utils/formatters';

// Khởi tạo giá trị State của một cái Slice trong redux
const initialState = {
  currentActiveBoard: null,
}

// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
    'activeBoard/fetchBoardDetailsAPI',
    async (boardId) => {
        const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
        return response.data
    }
)

// Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const activeBoardSlice = createSlice({
    name: 'activeBoard',
    initialState,
    // Reducers: Nơi xử lý dữ liệu đồng bộ
    reducers: {
        updateCurrentActiveBoard: (state, action) => {
            // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
            const board = action.payload

            // Xử lý dữ liệu nếu cần thiết...
            // ... 

            // Update lại dữ liệu của cái currentActiveBoard
            state.currentActiveBoard = board
        }
    },
    // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
    extraReducer: (builder) => {
        builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
            // action.payload ở đây chính là cái response.data trả về ở trên 
            let board = action.payload

            // Xử lý dữ liệu nếu cần thiết...
            board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
            board.columns.forEach(column => {
                if (isEmpty(column.cards)) {
                    column.cards = [generatePlaceholderCard(column)]
                    column.cardOrderIds = [generatePlaceholderCard(column)._id]
                } else {
                    column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
                }
            })

            // Update lại dữ liệu của cái currentActiveBoard
            state.currentActiveBoard = board
        })
    }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo ra tự động theo tên của reducer.
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
    return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer
