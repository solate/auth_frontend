<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="handleCreate">
        新增权限
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="permissionList"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="权限名称" />
      <el-table-column prop="code" label="权限标识" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 1 ? 'primary' : row.type === 2 ? 'success' : 'warning'">
            {{ row.type === 1 ? '目录' : row.type === 2 ? '菜单' : '按钮' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="text" class="delete-btn" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" style="width: 100%">
            <el-option label="目录" :value="1" />
            <el-option label="菜单" :value="2" />
            <el-option label="按钮" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="父级权限" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="permissionList"
            :props="{ label: 'name', value: 'id' }"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="formData.path" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="formData.icon" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" style="width: 100%" />
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
  getPermissionList,
  createPermission,
  updatePermission,
  deletePermission,
  updatePermissionStatus,
  type PermissionInfo
} from '@/api/permission'

const loading = ref(false)
const permissionList = ref<PermissionInfo[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

const formData = ref({
  id: undefined,
  name: '',
  code: '',
  type: 1,
  path: '',
  parentId: 0,
  icon: '',
  sort: 0,
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }]
}

// 获取权限列表
const getList = async () => {
  try {
    loading.value = true
    const res = await getPermissionList({})
    permissionList.value = res.data.list
  } finally {
    loading.value = false
  }
}

// 新增权限
const handleCreate = () => {
  formData.value = {
    id: undefined,
    name: '',
    code: '',
    type: 1,
    path: '',
    parentId: 0,
    icon: '',
    sort: 0,
    description: ''
  }
  dialogTitle.value = '新增权限'
  dialogVisible.value = true
}

// 编辑权限
const handleUpdate = (row: PermissionInfo) => {
  formData.value = { ...row }
  dialogTitle.value = '编辑权限'
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  try {
    if (formData.value.id) {
      await updatePermission(formData.value)
    } else {
      await createPermission(formData.value)
    }
    
    ElMessage.success('操作成功')
    dialogVisible.value = false
    getList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// 删除权限
const handleDelete = async (row: PermissionInfo) => {
  try {
    await ElMessageBox.confirm('确认删除该权限吗?', '提示', {
      type: 'warning'
    })
    
    await deletePermission(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 更新状态
const handleStatusChange = async (row: PermissionInfo) => {
  try {
    await updatePermissionStatus(row.id, row.status)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新失败:', error)
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