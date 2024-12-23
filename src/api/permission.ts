import request from '@/utils/request'

export interface PermissionInfo {
  id: number
  name: string
  code: string
  type: number
  path: string
  method: string
  parentId: number
  icon: string
  component: string
  sort: number
  status: number
  description: string
  children?: PermissionInfo[]
  createdAt: number
  updatedAt: number
}

export interface CreatePermissionParams {
  name: string
  code: string
  type: number
  path?: string
  method?: string
  parentId: number
  icon?: string
  component?: string
  sort: number
  description?: string
}

// 获取权限列表
export const getPermissionList = (params: any) => {
  return request({
    url: '/api/v1/permission/list',
    method: 'post',
    data: params
  })
}

// 创建权限
export const createPermission = (data: CreatePermissionParams) => {
  return request({
    url: '/api/v1/permission/create',
    method: 'post',
    data
  })
}

// 更新权限
export const updatePermission = (data: any) => {
  return request({
    url: '/api/v1/permission/update',
    method: 'post',
    data
  })
}

// 删除权限
export const deletePermission = (id: number) => {
  return request({
    url: '/api/v1/permission/delete',
    method: 'post',
    data: { id }
  })
}

// 更新权限状态
export const updatePermissionStatus = (id: number, status: number) => {
  return request({
    url: '/api/v1/permission/status',
    method: 'post',
    data: { id, status }
  })
} 