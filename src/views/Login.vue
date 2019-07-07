<template>
  <div class="login">
    <el-card class="tc">
      <img src="@/assets/logo.png" class="mb3">

      <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules" :disabled="loading">
        <el-form-item prop="email">
          <el-input type="email" v-model="loginForm.email" placeholder="Email" required autofocus></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="Password"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button :loading="loading" type="primary" class="w-100 mt2" @click="handleLogin">Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { User, UserAPI } from '@/apis/user'
import { ElForm } from 'element-ui/types/form'
import { cloneDeep } from '@/utils'

@Component({})
export default class Login extends Vue {
  loading = false
  loginFormRules = {
    email: [
      {
        required: true,
        message: 'Email is required',
        trigger: 'blur',
      },
    ],
    password: [
      { required: true, message: 'Password is required', trigger: 'blur' },
      {
        min: 6,
        message: 'Password length should be at least 6 characters',
        trigger: 'blur',
      },
    ],
  }
  initialLoginForm = {
    email: '',
    password: '',
  }
  loginForm = cloneDeep(this.initialLoginForm)
  $refs!: {
    loginForm: ElForm
  }

  async handleLogin() {
    const valid = await this.$refs.loginForm.validate()

    if (!valid) {
      return
    }

    this.loading = true
    const user = { ...this.loginForm } as User
    const response: any = await UserAPI.getInstance().login(user.email, user.password)
    if (response && response.token) {
      localStorage.setItem('jwt', response.token)
      this.$router.push((this.$route.query.redirect as string) || '/admin/dashboard')
    }
    this.loading = false
  }
}
</script>

