const TOKEN_KEY = 'Admin-Token'

export const getToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
} 