import request from '@/utils/request'

export interface LoginParams {
  phone: string
  pwd: string
}

export interface LoginResult {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
}

export const login = (data: LoginParams) => {
  return request({
    url: '/auth/api/v1/auth/login',
    method: 'post',
    data
  })
}

export const logout = () => {
  return request({
    url: '/auth/api/v1/auth/logout',
    method: 'post'
  })
}

export const getUserInfo = () => {
  return request({
    url: '/auth/api/v1/auth/user_info',
    method: 'post'
  })
}

export const refreshToken = (refreshToken: string) => {
  return request({
    url: '/auth/api/v1/auth/refresh_token',
    method: 'post',
    data: { refreshToken }
  })
}

export interface RegisterParams {
  name: string
  phone: string
  pwd: string
  email: string
  company: string
}

export const register = (data: RegisterParams) => {
  return request({
    url: '/auth/api/v1/auth/register',
    method: 'post',
    data
  })
} 