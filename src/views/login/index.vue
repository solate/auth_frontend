<template>
  <div class="login-container">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      class="login-form"
    >
      <div class="title">
        {{ isLogin ? '系统登录' : '用户注册' }}
      </div>
      
      <template v-if="isLogin">
        <el-form-item prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="手机号"
            type="text"
          />
        </el-form-item>

        <el-form-item prop="pwd">
          <el-input
            v-model="formData.pwd"
            placeholder="密码"
            type="password"
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.prevent="handleLogin"
        >
          登录
        </el-button>

        <div class="form-footer">
          <el-button link @click="switchMode">
            还没有账号？去注册
          </el-button>
        </div>
      </template>

      <template v-else>
        <el-form-item prop="name">
          <el-input
            v-model="formData.name"
            placeholder="用户名称"
          />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="手机号"
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="formData.email"
            placeholder="邮箱"
          />
        </el-form-item>

        <el-form-item prop="company">
          <el-input
            v-model="formData.company"
            placeholder="公司名称"
          />
        </el-form-item>

        <el-form-item prop="pwd">
          <el-input
            v-model="formData.pwd"
            placeholder="密码"
            type="password"
          />
        </el-form-item>

        <el-form-item prop="confirmPwd">
          <el-input
            v-model="formData.confirmPwd"
            placeholder="确认密码"
            type="password"
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.prevent="handleRegister"
        >
          注册
        </el-button>

        <div class="form-footer">
          <el-button link @click="switchMode">
            已有账号？去登录
          </el-button>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { register } from '@/api/auth'

const router = useRouter()
const store = useStore()

const isLogin = ref(true)
const loading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  company: '',
  pwd: '',
  confirmPwd: ''
})

const validateConfirmPwd = (rule: any, value: string, callback: any) => {
  if (value !== formData.pwd) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  name: [
    { required: true, message: '请输入用户名称', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPwd, trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    loading.value = true
    await formRef.value.validate()
    
    await store.dispatch('user/login', {
      phone: formData.phone,
      pwd: formData.pwd
    })
    router.push({ path: '/' })
    
    ElMessage.success('登录成功')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!formRef.value) return
  
  try {
    loading.value = true
    await formRef.value.validate()
    
    await register({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      company: formData.company,
      pwd: formData.pwd
    })
    
    ElMessage.success('注册成功，请登录')
    isLogin.value = true
    formData.pwd = ''
    formData.confirmPwd = ''
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败')
  } finally {
    loading.value = false
  }
}

const switchMode = () => {
  isLogin.value = !isLogin.value
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  
  .login-form {
    width: 400px;
    padding: 30px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .title {
      font-size: 26px;
      text-align: center;
      margin-bottom: 30px;
      color: #303133;
    }

    .form-footer {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style> 