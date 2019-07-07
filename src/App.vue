<template>
  <div id="app" :class="['Chat', 'Login'].includes($route.name) ? 'bg-light-purple' : 'bg-white'">
    <el-container class="min-vh-100">
      <el-aside
        width="200px"
        style="background-color: #e2e7ef"
        v-if="!['Chat', 'Login'].includes($route.name)"
      >
        <el-menu
          router
          background-color="#e2e7ef"
          text-color="#383737"
          active-text-color="#8714ff"
          :default-active="$route.path"
        >
          <el-menu-item index="/admin/dashboard">
            <i class="el-icon-s-home"></i>
            <span>Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/admin/intents">
            <i class="el-icon-s-opportunity"></i>
            <span>Intents</span>
          </el-menu-item>

          <el-menu-item index="/admin/contents">
            <i class="el-icon-message"></i>
            <span>Contents</span>
          </el-menu-item>

          <el-menu-item index="/admin/answers">
            <i class="el-icon-question"></i>
            <span>Answers</span>
          </el-menu-item>

          <el-menu-item index="/admin/users">
            <i class="el-icon-user"></i>
            <span>Users</span>
          </el-menu-item>
        </el-menu>

        <el-button type="info" class="mr3 ml3 w-80" @click="handleLogout">Logout</el-button>
      </el-aside>

      <el-container>
        <el-header
          class="flex items-center justify-between bg-white shadow-2"
          v-if="!['Chat', 'Login'].includes($route.name)"
        >
          <h1 class="pa0 ma0 fw4 f3">{{ ui.headerTitle }}</h1>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { State } from 'vuex-class'
import { UIState } from './store/ui'
import instance from '@/apis/instance'

@Component({})
export default class App extends Vue {
  @State ui?: UIState
  collapsed = false

  get defaultSelectedKeys() {
    return [this.$route.name || '']
  }

  handleLogout() {
    localStorage.removeItem('jwt')
    this.$router.push('/admin/login')
  }

  created() {
    instance.interceptors.response.use(
      response => {
        return response
      },
      error => {
        if (error.response) {
          const { data } = error.response
          this.$message.error(data.message || data.error.message)
        } else if (error.request) {
          this.$message.error('No response recevied from the server')
        } else {
          this.$message.error('Request failed')
        }

        return Promise.reject(error)
      },
    )
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Roboto', sans-serif;

  .el-input {
    &.is-active,
    .el-input__inner {
      &:focus {
        border-color: #8714ff;
      }
    }
  }

  .el-button {
    &:focus,
    &:hover {
      background-color: transparent;
      border-color: #8714ff;
      color: #8714ff;
    }
  }
  .el-button--primary {
    color: #fff;
    background-color: #8714ff;
    border-color: #5e2ca5;

    &:focus,
    &:hover {
      color: #fff;
      background-color: #5e2ca5;
    }
  }
  .el-tag {
    background-color: transparent;
    border-color: #8714ff;
    color: #8714ff;
    text-transform: uppercase;
  }
  &.bg-light-purple {
    background-color: #8714ff;
  }

  .bg-purple {
    background-color: #5e2ca5;
    color: #24ff95;

    &.hover-bg-purple:focus,
    &.hover-bg-purple:hover {
      background-color: #8714ff;
    }
  }
}

.login {
  position: relative;
  width: 520px;
  max-width: 100%;
  padding: 160px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}

.tag-group .el-tag + .el-tag {
  margin-left: 10px;
}

.el-aside {
  position: relative;

  .el-button {
    position: absolute;
    bottom: 30px;
    right: 0;
    left: 0;
  }
}

.el-card {
  background-color: #f7f8f9;
  min-height: 118.4px;
}
</style>
