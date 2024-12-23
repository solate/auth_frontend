<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical"
        :router="true"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Monitor /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/permission">
          <el-icon><Lock /></el-icon>
          <span>权限管理</span>
        </el-menu-item>
        <el-menu-item index="/role">
          <el-icon><UserFilled /></el-icon>
          <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/menu">
          <el-icon><Menu /></el-icon>
          <span>菜单管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userStore.userInfo?.name || '管理员' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  Monitor,
  Lock,
  UserFilled,
  User,
  Menu,
  ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const userStore = store.state.user

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    await store.dispatch('user/logout')
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}

.header-right {
  cursor: pointer;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}
</style> 