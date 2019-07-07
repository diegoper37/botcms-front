<template>
  <div>
    <Intent :intents="intents" @delete="handleDeleteIntent" @edit="handleEditIntent"></Intent>

    <!-- Click for dialog -->
    <i
      class="fixed br-100 bg-animate hover-bg-purple bg-purple w3 h3 flex items-center justify-center bottom-2 right-2 pointer"
      @click="dialogIntentVisible = true"
    >
      <i class="el-icon-plus f1 white"></i>
    </i>

    <!-- Dialog for new data -->
    <el-dialog
      title="New intent"
      :visible.sync="dialogIntentVisible"
      width="520px"
      :close-on-click-modal="false"
      @closed="onDialogIntentClosed"
      :show-close="!dialogIntentLoading"
    >
      <el-form
        ref="intentForm"
        :model="intentForm"
        :rules="intentFormRules"
        :disabled="dialogIntentLoading"
      >
        <el-form-item prop="name" label="Name">
          <el-input v-model="intentForm.name"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="dialogIntentVisible = false" :disabled="dialogIntentLoading">Cancel</el-button>
        <el-button type="primary" @click="handleSaveIntent" :loading="dialogIntentLoading">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Intent, IntentAPI } from '@/apis/intents'
import IntentComponent from '@/components/Intent.vue'
import { ElForm } from 'element-ui/types/form'
import { cloneDeep } from '@/utils'

@Component({
  components: {
    Intent: IntentComponent,
  },
})
export default class Intents extends Vue {
  private search = ''
  intents: Intent[] = []
  dialogIntentVisible = false
  dialogIntentLoading = false
  hasNoData = false
  intentFormRules = {
    name: [{ required: true, message: 'Name is required' }],
  }
  initialIntentForm = {
    name: '',
  }
  updatingIntent?: Intent
  intentForm = cloneDeep(this.initialIntentForm)
  $refs!: {
    intentForm: ElForm
  }

  async handleSaveIntent() {
    const valid = await this.$refs.intentForm.validate()

    if (!valid) {
      return
    }

    const intent = { ...this.intentForm } as Intent

    const request = this.updatingIntent
      ? IntentAPI.getInstance().updateIntent(this.updatingIntent._id, intent)
      : IntentAPI.getInstance().createIntent(intent)

    try {
      this.dialogIntentLoading = true
      await request
      this.dialogIntentVisible = false
      this.$message.success('The intent has been saved successfully')
      this.fetchIntents()
    } catch (error) {
      // do nothing
    } finally {
      this.dialogIntentLoading = false
    }
  }

  onDialogIntentClosed() {
    this.updatingIntent = undefined
    this.intentForm = cloneDeep(this.initialIntentForm)
    this.$refs.intentForm.resetFields()
  }

  async fetchIntents() {
    const response = await IntentAPI.getInstance().getIntents()
    this.intents = response
    this.hasNoData = !this.intents.length
  }

  async handleDeleteIntent(intent: Intent) {
    await IntentAPI.getInstance().deleteIntent(intent._id)
    this.$message.success('The intent has been deleted successfully')
    this.fetchIntents()
  }

  handleEditIntent(intent: Intent) {
    this.updatingIntent = intent
    const { _id, ...intentForm } = intent

    this.intentForm = {
      ...this.intentForm,
      ...intentForm,
    }

    this.dialogIntentVisible = true
  }

  created() {
    this.$store.commit('ui/setHeaderTitle', 'Intents')
    this.fetchIntents()
  }
}
</script>

