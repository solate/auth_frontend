<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams">
        <el-form-item>
          <el-input
            v-model="queryParams.name"
            placeholder="角色名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryParams.status" placeholder="状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      :data="roleList"
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="code" label="角色标识" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="text" @click="handlePermission(row)">分配权限</el-button>
          <el-button type="text" class="delete-btn" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

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
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="formData.code" :disabled="!!formData.id" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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

    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限"
      v-model="permissionDialogVisible"
      width="500px"
    >
      <el-tree
        ref="permissionTreeRef"
        :data="permissionList"
        show-checkbox
        node-key="id"
        :props="{ label: 'name' }"
      />
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, TreeInstance } from 'element-plus'
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  getRoleDetail,
  type RoleInfo
} from '@/api/role'
import { getPermissionList } from '@/api/permission'

const loading = ref(false)
const roleList = ref<RoleInfo[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const permissionDialogVisible = ref(false)
const formRef = ref<FormInstance>()
const permissionTreeRef = ref<TreeInstance>()
const permissionList = ref([])
const currentRole = ref<RoleInfo>()

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  name: '',
  status: undefined
})

const formData = ref({
  id: undefined,
  name: '',
  code: '',
  status: 1,
  description: '',
  permissionIDs: [] as number[]
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 获取角色列表
const getList = async () => {
  try {
    loading.value = true
    const res = await getRoleList(queryParams)
    roleList.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 重置查询
const resetQuery = () => {
  queryParams.name = ''
  queryParams.status = undefined
  handleQuery()
}

// 新增角色
const handleCreate = () => {
  formData.value = {
    id: undefined,
    name: '',
    code: '',
    status: 1,
    description: '',
    permissionIDs: []
  }
  dialogTitle.value = '新增角色'
  dialogVisible.value = true
}

// 编辑角色
const handleUpdate = async (row: RoleInfo) => {
  const res = await getRoleDetail(row.id)
  formData.value = res.data
  dialogTitle.value = '编辑角色'
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  try {
    if (formData.value.id) {
      await updateRole(formData.value)
    } else {
      await createRole(formData.value)
    }
    
    ElMessage.success('操作成��')
    dialogVisible.value = false
    getList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// 删除角色
const handleDelete = async (row: RoleInfo) => {
  try {
    await ElMessageBox.confirm('确认删除该角色吗?', '提示', {
      type: 'warning'
    })
    
    await deleteRole(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 分配权限
const handlePermission = async (row: RoleInfo) => {
  currentRole.value = row
  const [permissionRes, roleRes] = await Promise.all([
    getPermissionList({}),
    getRoleDetail(row.id)
  ])
  
  permissionList.value = permissionRes.data.list
  permissionDialogVisible.value = true
  
  // 设置选中的权限
  nextTick(() => {
    permissionTreeRef.value?.setCheckedKeys(roleRes.data.permissionIDs)
  })
}

// 提交权限分配
const handlePermissionSubmit = async () => {
  if (!currentRole.value) return
  
  const checkedKeys = permissionTreeRef.value?.getCheckedKeys() || []
  const halfCheckedKeys = permissionTreeRef.value?.getHalfCheckedKeys() || []
  const permissionIDs = [...checkedKeys, ...halfCheckedKeys]
  
  try {
    await updateRole({
      id: currentRole.value.id,
      permissionIDs
    })
    
    ElMessage.success('分配权限成��')
    permissionDialogVisible.value = false
  } catch (error) {
    console.error('分配权限失败:', error)
  }
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.page = val
  getList()
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