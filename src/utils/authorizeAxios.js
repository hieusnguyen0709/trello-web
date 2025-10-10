import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi Request & Response)
 * https://axios-http.com/docs/interceptors
 */

// Interceptors Request: Can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use((config) => {
    // Kỹ thuật chặn spam click 
    interceptorLoadingElements(true)

    return config
}, (error) => {
    return Promise.reject(error)
})

// Interceptors Response: Can thiệp vào giữa những cái response API
authorizedAxiosInstance.interceptors.response.use((response) => {
    // Kỹ thuật chặn spam click 
    interceptorLoadingElements(false)

    return response
}, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Status code 200 - 299 

    // Kỹ thuật chặn spam click 
    interceptorLoadingElements(false)

    let errorMessage = error?.message
    if (error.response?.data?.message) {
        errorMessage = error.response?.data?.message
    }

    // Status code 410: Gone - auto refresh token
    if (error.response?.status !== 410) {
        toast.error(errorMessage)
    }

    return Promise.reject(error)
})


export default authorizedAxiosInstance