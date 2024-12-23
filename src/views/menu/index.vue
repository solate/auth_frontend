<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="handleCreate">新增菜单</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="菜单名称" />
      <el-table-column prop="code" label="权限标识" />
      <el-table-column prop="path" label="路由路径" />
      <el-table-column prop="component" label="组件路径" />
      <el-table-column prop="icon" label="图标" width="100">
        <template #default="{ row }">
          <i :class="row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="hidden" label="显示状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.hidden ? 'info' : 'success'">
            {{ row.hidden ? '隐藏' : '显示' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="text" class="delete-btn" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="formData.path" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="formData.component" />
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="menuList"
            :props="{ label: 'name', value: 'id' }"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="formData.icon">
            <template #prefix>
              <i :class="formData.icon"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="显示状态">
          <el-radio-group v-model="formData.hidden">
            <el-radio :label="false">显示</el-radio>
            <el-radio :label="true">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="总是显示">
          <el-switch v-model="formData.alwaysShow" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu,
  type MenuInfo
} from '@/api/menu'

const loading = ref(false)
const menuList = ref<MenuInfo[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

const formData = ref({
  id: undefined,
  name: '',
  code: '',
  path: '',
  component: '',
  parentId: 0,
  icon: '',
  sort: 0,
  hidden: false,
  alwaysShow: false,
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }]
}

// 获取菜单列表
const getList = async () => {
  try {
    loading.value = true
    const res = await getMenuTree()
    menuList.value = res.data.list
  } finally {
    loading.value = false
  }
}

// 新增菜单
const handleCreate = () => {
  formData.value = {
    id: undefined,
    name: '',
    code: '',
    path: '',
    component: '',
    parentId: 0,
    icon: '',
    sort: 0,
    hidden: false,
    alwaysShow: false,
    description: ''
  }
  dialogTitle.value = '新增菜单'
  dialogVisible.value = true
}

// 编辑菜单
const handleUpdate = (row: MenuInfo) => {
  formData.value = { ...row }
  dialogTitle.value = '编辑菜单'
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  try {
    if (formData.value.id) {
      await updateMenu(formData.value)
    } else {
      await createMenu(formData.value)
    }
    
    ElMessage.success('操作成功')
    dialogVisible.value = false
    getList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// 删除菜单
const handleDelete = async (row: MenuInfo) => {
  try {
    await ElMessageBox.confirm('确认删除该菜单吗?', '提示', {
      type: 'warning'
    })
    
    await deleteMenu(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 20px;
}

.delete-btn {
  color: #f56c6c;
}
</style> 