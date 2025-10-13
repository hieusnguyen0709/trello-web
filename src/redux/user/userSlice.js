import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";

// Khởi tạo giá trị State của một cái Slice trong redux
const initialState = {
  currentUser: null,
}

// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
    'user/loginUserAPI',
    async (data) => {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
        return response.data
    }
)

// Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
    name: 'user',
    initialState,
    // Reducers: Nơi xử lý dữ liệu đồng bộ
    reducers: {},
    // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
    extraReducers: (builder) => {
        builder.addCase(loginUserAPI.fulfilled, (state, action) => {
            // action.payload ở đây chính là cái response.data trả về ở trên 
            let user = action.payload
            state.currentUser = user
        })
    }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo ra tự động theo tên của reducer.
// export const { } = userSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
    return state.user.currentUser
}

export const userReducer = userSlice.reducer
