import { login, getUserInfo, logout } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

interface UserState {
  token: string
  userInfo: any
}

export default {
  namespaced: true,
  
  state: (): UserState => ({
    token: getToken() || '',
    userInfo: null
  }),

  mutations: {
    SET_TOKEN(state: UserState, token: string) {
      state.token = token
    },
    SET_USER_INFO(state: UserState, info: any) {
      state.userInfo = info
    }
  },

  actions: {
    async login({ commit }, userInfo) {
      const { phone, pwd } = userInfo
      const res = await login({ phone, pwd })
      const { accessToken } = res.data
      
      commit('SET_TOKEN', accessToken)
      setToken(accessToken)
    },

    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      commit('SET_USER_INFO', res.data)
      return res.data
    },

    async logout({ commit }) {
      await logout()
      commit('SET_TOKEN', '')
      commit('SET_USER_INFO', null)
      removeToken()
    }
  }
} 