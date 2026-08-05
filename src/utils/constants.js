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