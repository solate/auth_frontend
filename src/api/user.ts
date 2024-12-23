import request from '@/utils/request'

export interface UserInfo {
  id: number
  uid: number
  name: string
  no: string
  phone: string
  start_at: string
  end_at: string
  email: string
  province: string
  city: string
  address: string
  company_desc: string
  status: number
  roleIDs: number[]
}

export interface CreateUserParams {
  no: string
  name: string
  phone: string
  role: number
  pwd_hashed: string
  pwd_salt: string
  disable_status: number
  parent_disable_status: number
  company: string
  email: string
  gender: number
  icon: string
  roleIDs: number[]
}

export interface UserListParams {
  current: number
  page_size: number
  name?: string
  phone?: string
  status?: number
}

// 获取用户列表
export const getUserList = (params: UserListParams) => {
  return request({
    url: '/auth/api/v1/user/list',
    method: 'post',
    data: params
  })
}

// 创建用户
export const createUser = (data: CreateUserParams) => {
  return request({
    url: '/auth/api/v1/user/create',
    method: 'post',
    data
  })
}

// 获取用户详情
export const getUserDetail = (id: number) => {
  return request({
    url: '/auth/api/v1/user/detail',
    method: 'post',
    data: { id }
  })
}

// 修改用户状态
export const updateUserStatus = (id: number, status: number) => {
  return request({
    url: '/auth/api/v1/user/status',
    method: 'post',
    data: { id, status }
  })
}

// 修改用户密码
export const updateUserPassword = (id: number, password: string) => {
  return request({
    url: '/auth/api/v1/user/password',
    method: 'post',
    data: { id, password }
  })
} 