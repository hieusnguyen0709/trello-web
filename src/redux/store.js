import { configureStore } from "@reduxjs/toolkit";
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

// Cấu hình redux-persist
import { combineReducers } from 'redux'
import { persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Cấu hình persist
const rootPersistConfig = {
  key: 'root', // key của cái persist do chúng ta chỉ định, cứ để mặc định là root
  storage: storage, // Biến storage ở trên – lưu vào localstorage
  whitelist: ['user'] // định nghĩa các slice dữ liệu ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
  // blacklist: ['user'] // định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
}

const reducers = combineReducers({
    activeBoard: activeBoardReducer,
    user: userReducer
})

const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})