<template>
  <div>
    <User :users="users" @delete="handleDeleteUser" @edit="handleEditUser"></User>

    <!-- Click for dialog -->
    <i
      class="fixed br-100 bg-animate hover-bg-purple bg-purple w3 h3 flex items-center justify-center bottom-2 right-2 pointer"
      @click="dialogUserVisible = true"
    >
      <i class="el-icon-plus f1 white"></i>
    </i>

    <!-- Dialog for new data -->
    <el-dialog
      title="New user"
      :visible.sync="dialogUserVisible"
      width="520px"
      :close-on-click-modal="false"
      @closed="onDialogUserClosed"
      :show-close="!dialogUserLoading"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userFormRules"
        :disabled="dialogUserLoading"
      >
        <el-form-item prop="profile.firstName" label="First Name">
          <el-input v-model="userForm.profile.firstName"></el-input>
        </el-form-item>
        <el-form-item prop="profile.lastName" label="Last Name">
          <el-input v-model="userForm.profile.lastName"></el-input>
        </el-form-item>
        <el-form-item prop="role" label="Role">
          <el-select class="w-100" v-model="userForm.role">
            <el-option value="editor" label="Editor"></el-option>
            <el-option value="admin" label="Administrador"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="email" label="Email">
          <el-input type="email" v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="Password">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="dialogUserVisible = false" :disabled="dialogUserLoading">Cancel</el-button>
        <el-button type="primary" @click="handleSaveUser" :loading="dialogUserLoading">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { User, UserAPI } from '@/apis/user'
import UserComponent from '@/components/User.vue'
import { ElForm } from 'element-ui/types/form'
import { cloneDeep } from '@/utils'

@Component({
  components: {
    User: UserComponent,
  },
})
export default class Users extends Vue {
  private search = ''
  users: User[] = []
  dialogUserVisible = false
  dialogUserLoading = false
  hasNoData = false
  userFormRules = {
    profile: {
      firstName: [{ required: true, message: 'First Name is required' }],
      lastName: [{ required: true, message: 'Last Name is required' }],
    },
    email: [
      {
        required: true,
        message: 'Email is required',
      },
    ],
    role: [
      {
        required: true,
        message: 'Role is required',
      },
    ],
    password: [
      { required: true, message: 'Password is required' },
      {
        min: 6,
        message: 'Password length should be at least 6 characters',
      },
    ],
  }
  initialUserForm = {
    profile: {
      firstName: '',
      lastName: '',
    },
    role: '',
    email: '',
    password: '',
  }
  updatingUser?: User
  userForm = cloneDeep(this.initialUserForm)
  $refs!: {
    userForm: ElForm
  }

  async handleSaveUser() {
    const valid = await this.$refs.userForm.validate()

    if (!valid) {
      return
    }

    const user = { ...this.userForm } as User

    const request = this.updatingUser
      ? UserAPI.getInstance().updateUser(this.updatingUser._id, user)
      : UserAPI.getInstance().register(user)

    try {
      this.dialogUserLoading = true
      await request
      this.dialogUserVisible = false
      this.$message.success('The user has been saved successfully')
      this.fetchUsers()
    } catch (error) {
      // do nothing
    } finally {
      this.dialogUserLoading = false
    }
  }

  onDialogUserClosed() {
    this.updatingUser = undefined
    this.userForm = cloneDeep(this.initialUserForm)
    this.$refs.userForm.resetFields()
  }

  async fetchUsers() {
    const response = await UserAPI.getInstance().getUsers()
    this.users = response
    this.hasNoData = !this.users.length
  }

  async handleDeleteUser(user: User) {
    await UserAPI.getInstance().deleteUser(user._id)
    this.$message.success('The user has been deleted successfully')
    this.fetchUsers()
  }

  handleEditUser(user: User) {
    this.updatingUser = user
    const { _id, ...userForm } = user

    this.userForm = {
      ...this.userForm,
      ...userForm,
    }

    this.dialogUserVisible = true
  }

  created() {
    this.$store.commit('ui/setHeaderTitle', 'Users')
    this.fetchUsers()
  }
}
</script>

