import request from '@/utils/request'
import type { PermissionInfo } from './permission'

export interface MenuInfo extends PermissionInfo {
  // 继承权限接口，扩展菜单特有字段
  component: string
  icon: string
  hidden?: boolean
  alwaysShow?: boolean
}

export interface CreateMenuParams {
  name: string
  code: string
  path: string
  component: string
  icon?: string
  parentId: number
  sort: number
  hidden?: boolean
  alwaysShow?: boolean
  description?: string
}

// 获取菜单树
export const getMenuTree = () => {
  return request({
    url: '/api/v1/permission/list',
    method: 'post',
    data: {
      type: 2 // 类型为菜单
    }
  })
}

// 创建菜单
export const createMenu = (data: CreateMenuParams) => {
  return request({
    url: '/api/v1/permission/create',
    method: 'post',
    data: {
      ...data,
      type: 2 // 类型为菜单
    }
  })
}

// 更新菜单
export const updateMenu = (data: any) => {
  return request({
    url: '/api/v1/permission/update',
    method: 'post',
    data: {
      ...data,
      type: 2
    }
  })
}

// 删除菜单
export const deleteMenu = (id: number) => {
  return request({
    url: '/api/v1/permission/delete',
    method: 'post',
    data: { id }
  })
} 