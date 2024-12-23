<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams">
        <el-form-item>
          <el-input
            v-model="queryParams.name"
            placeholder="用户名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryParams.phone"
            placeholder="手机号"
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
      :data="userList"
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="用户名称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="company" label="公司" show-overflow-tooltip />
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
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="text" @click="handlePassword(row)">修改密码</el-button>
          <el-button type="text" @click="handleRole(row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="queryParams.current"
      v-model:page-size="queryParams.page_size"
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
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="formData.company" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="disable_status">
          <el-radio-group v-model="formData.disable_status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roleIDs">
          <el-select
            v-model="formData.roleIDs"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      v-model="passwordDialogVisible"
      width="400px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="passwordForm.password"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  getUserList,
  createUser,
  getUserDetail,
  updateUserStatus,
  updateUserPassword,
  type UserInfo
} from '@/api/user'
import { getRoleList } from '@/api/role'

const loading = ref(false)
const userList = ref<UserInfo[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const passwordDialogVisible = ref(false)
const formRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const roleOptions = ref([])
const currentUser = ref<UserInfo>()

const queryParams = reactive({
  current: 1,
  page_size: 10,
  name: '',
  phone: '',
  status: undefined
})

const formData = ref({
  id: undefined,
  name: '',
  phone: '',
  email: '',
  company: '',
  gender: 1,
  disable_status: 1,
  roleIDs: [] as number[]
})

const passwordForm = ref({
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== passwordForm.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  roleIDs: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const passwordRules = {
  password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 获取用户列表
const getList = async () => {
  try {
    loading.value = true
    const res = await getUserList(queryParams)
    userList.value = res.data.list
    total.value = res.data.page.total
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const getRoles = async () => {
  const res = await getRoleList({ page: 1, pageSize: 100 })
  roleOptions.value = res.data.list
}

// 查询
const handleQuery = () => {
  queryParams.current = 1
  getList()
}

// 重置查询
const resetQuery = () => {
  queryParams.name = ''
  queryParams.phone = ''
  queryParams.status = undefined
  handleQuery()
}

// 新增用户
const handleCreate = () => {
  formData.value = {
    id: undefined,
    name: '',
    phone: '',
    email: '',
    company: '',
    gender: 1,
    disable_status: 1,
    roleIDs: []
  }
  dialogTitle.value = '新增用户'
  dialogVisible.value = true
}

// 编辑用户
const handleUpdate = async (row: UserInfo) => {
  const res = await getUserDetail(row.id)
  formData.value = res.data
  dialogTitle.value = '编辑用户'
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  try {
    await createUser(formData.value)
    ElMessage.success('操作成功')
    dialogVisible.value = false
    getList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// 修改密码
const handlePassword = (row: UserInfo) => {
  currentUser.value = row
  passwordForm.value = {
    password: '',
    confirmPassword: ''
  }
  passwordDialogVisible.value = true
}

// 提交密码修改
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value || !currentUser.value) return
  
  await passwordFormRef.value.validate()
  
  try {
    await updateUserPassword(currentUser.value.id, passwordForm.value.password)
    ElMessage.success('修改密码成功')
    passwordDialogVisible.value = false
  } catch (error) {
    console.error('修改密码失败:', error)
  }
}

// 更新状态
const handleStatusChange = async (row: UserInfo) => {
  try {
    await updateUserStatus(row.id, row.status)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新失败:', error)
  }
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.page_size = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.current = val
  getList()
}

onMounted(() => {
  getList()
  getRoles()
})
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 20px;
}
</style> 