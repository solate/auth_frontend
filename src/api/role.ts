import request from '@/utils/request'

export interface RoleInfo {
  id: number
  name: string
  code: string
  description: string
  status: number
  permissionIDs: number[]
  createdAt: number
  updatedAt: number
}

export interface CreateRoleParams {
  name: string
  code: string
  description?: string
  permissionIDs: number[]
}

export interface RoleListParams {
  page: number
  pageSize: number
  name?: string
  status?: number
}

// 获取角色列表
export const getRoleList = (params: RoleListParams) => {
  return request({
    url: '/api/v1/role/list',
    method: 'post',
    data: params
  })
}

// 创建角色
export const createRole = (data: CreateRoleParams) => {
  return request({
    url: '/api/v1/role/create',
    method: 'post',
    data
  })
}

// 更新角色
export const updateRole = (data: any) => {
  return request({
    url: '/api/v1/role/update',
    method: 'put',
    data
  })
}

// 删除角色
export const deleteRole = (id: number) => {
  return request({
    url: '/api/v1/role/delete',
    method: 'post',
    data: { id }
  })
}

// 获取角色详情
export const getRoleDetail = (id: number) => {
  return request({
    url: '/api/v1/role/detail',
    method: 'post',
    data: { id }
  })
} 