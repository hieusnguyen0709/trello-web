let apiRoot = ''
if (import.meta.env.MODE === 'development') {
  apiRoot = 'http://localhost:8017'
}
if (import.meta.env.MODE === 'production') {
  apiRoot = import.meta.env.VITE_API_ROOT
}
export const API_ROOT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

export const DEMO_USER = {
  EMAIL: 'demo.trello.clone.user@gmail.com',
  PASSWORD: 'Hieunm@123'
}

export const LABEL_COLORS = [
  '#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0',
  '#B7F5D8', '#F5EA7C', '#FFE3A3', '#FFD6D2', '#EBD9FF',
  '#4FD1A1', '#F2D024', '#FFA500', '#FF7A6E', '#C77DFF',
  '#1E8449', '#9A7D0A', '#D35400', '#C0392B', '#8E44AD',
  '#D6E6FF', '#CFF1FF', '#D6F5B2', '#FFD6EC', '#E0E0E0',
  '#6FA8FF', '#6EC6DF', '#9ACA3C', '#EC77C2', '#8E8E93'
]