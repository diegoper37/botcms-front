<template>
  <div>
    <TextContent
      :contents="textContents"
      @delete="handleDeleteTextContent"
      @edit="handleEditTextContent"
    ></TextContent>

    <i
      class="fixed br-100 bg-animate hover-bg-purple bg-purple w3 h3 flex items-center justify-center bottom-2 right-2 pointer"
      @click="dialogTextContentVisible = true"
    >
      <i class="el-icon-plus f1 white"></i>
    </i>

    <el-dialog
      title="New content"
      :visible.sync="dialogTextContentVisible"
      width="520px"
      :close-on-click-modal="false"
      @closed="onDialogTextContentClosed"
      :show-close="!dialogTextContentLoading"
    >
      <el-form
        ref="textContentForm"
        :model="textContentForm"
        :rules="textContentFormRules"
        :disabled="dialogTextContentLoading"
      >
        <el-form-item prop="intents" label="Response intents">
          <el-select class="w-100" multiple filterable clearable v-model="textContentForm.intents">
            <el-option
              v-for="intent in intents"
              :key="intent._id"
              :label="intent.name"
              :value="intent._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="Name">
          <el-input v-model="textContentForm.name"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          @click="dialogTextContentVisible = false"
          :disabled="dialogTextContentLoading"
        >Cancel</el-button>
        <el-button
          type="primary"
          @click="handleSaveTextContent"
          :loading="dialogTextContentLoading"
        >Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Intent, IntentAPI } from '@/apis/intents'
import { TextContent, TextContentAPI } from '@/apis/textContent'
import TextContentComponent from '@/components/TextContent.vue'
import { ElForm } from 'element-ui/types/form'
import { cloneDeep } from '@/utils'

@Component({
  components: {
    TextContent: TextContentComponent,
  },
})
export default class TextContents extends Vue {
  textContents: TextContent[] = []
  intents: Intent[] = []
  dialogTextContentVisible = false
  dialogTextContentLoading = false
  hasNoData = false
  initialTextContentForm = {
    name: '',
    intents: [] as string[],
  }
  textContentFormRules = {
    name: [{ required: true, message: 'Name is required' }],
    intents: [{ required: true, message: 'Intent is required' }],
  }
  updatingTextContent?: TextContent
  textContentForm = cloneDeep(this.initialTextContentForm)
  $refs!: {
    textContentForm: ElForm
  }

  async handleSaveTextContent() {
    const valid = await this.$refs.textContentForm.validate()

    if (!valid) {
      return
    }

    const textcontent = { ...this.textContentForm } as TextContent

    const request = this.updatingTextContent
      ? TextContentAPI.getInstance().updateTextContent(this.updatingTextContent._id, textcontent)
      : TextContentAPI.getInstance().createTextContent(textcontent)

    try {
      this.dialogTextContentLoading = true
      await request
      this.dialogTextContentVisible = false
      this.$message.success('The content has been saved successfully')
      this.fetchTextContents()
    } catch (error) {
      // do nothing
    } finally {
      this.dialogTextContentLoading = false
    }
  }

  onDialogTextContentClosed() {
    this.updatingTextContent = undefined
    this.textContentForm = cloneDeep(this.initialTextContentForm)
    this.$refs.textContentForm.resetFields()
  }

  async fetchTextContents() {
    const response = await TextContentAPI.getInstance().getTextContents()
    this.textContents = response
    this.hasNoData = !this.textContents.length
  }
  async fetchIntents() {
    this.intents = await IntentAPI.getInstance().getIntents()
  }

  async handleDeleteTextContent(textcontent: TextContent) {
    await TextContentAPI.getInstance().deleteTextContent(textcontent._id)
    this.$message.success('The content has been deleted successfully')
    this.fetchTextContents()
  }

  handleEditTextContent(textcontent: TextContent) {
    this.updatingTextContent = textcontent
    const { _id, ...textContentForm } = textcontent

    this.textContentForm = {
      ...this.textContentForm,
      ...textContentForm,
      intents: textContentForm.intents,
    }

    this.dialogTextContentVisible = true
  }

  created() {
    this.$store.commit('ui/setHeaderTitle', 'Contents')
    this.fetchTextContents()
    this.fetchIntents()
  }
}
</script>
