<template>
  <div>
    <TextAnswer
      :answers="textAnswers"
      @delete="handleDeleteTextAnswer"
      @edit="handleEditTextAnswer"
    ></TextAnswer>

    <i
      class="fixed br-100 bg-animate hover-bg-purple bg-purple w3 h3 flex items-center justify-center bottom-2 right-2 pointer"
      @click="dialogTextAnswerVisible = true"
    >
      <i class="el-icon-plus f1 white"></i>
    </i>

    <el-dialog
      title="New content"
      :visible.sync="dialogTextAnswerVisible"
      width="520px"
      :close-on-click-modal="false"
      @closed="onDialogTextAnswerClosed"
      :show-close="!dialogTextAnswerLoading"
    >
      <el-form
        ref="textAnswerForm"
        :model="textAnswerForm"
        :rules="textAnswerFormRules"
        :disabled="dialogTextAnswerLoading"
      >
        <el-form-item prop="intents" label="Response intents">
          <el-select class="w-100" multiple filterable clearable v-model="textAnswerForm.intents">
            <el-option
              v-for="intent in intents"
              :key="intent._id"
              :label="intent.name"
              :value="intent._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="Name">
          <el-input
            v-model="textAnswerForm.name"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          @click="dialogTextAnswerVisible = false"
          :disabled="dialogTextAnswerLoading"
        >Cancel</el-button>
        <el-button
          type="primary"
          @click="handleSaveTextAnswer"
          :loading="dialogTextAnswerLoading"
        >Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Intent, IntentAPI } from '@/apis/intents'
import { TextAnswer, TextAnswerAPI } from '@/apis/textAnswer'
import TextAnswerComponent from '@/components/TextAnswer.vue'
import { ElForm } from 'element-ui/types/form'
import { cloneDeep } from '@/utils'

@Component({
  components: {
    TextAnswer: TextAnswerComponent,
  },
})
export default class TextAnswers extends Vue {
  textAnswers: TextAnswer[] = []
  intents: Intent[] = []
  dialogTextAnswerVisible = false
  dialogTextAnswerLoading = false
  hasNoData = false
  initialTextAnswerForm = {
    name: '',
    intents: [] as string[],
  }
  textAnswerFormRules = {
    name: [{ required: true, message: 'Name is required' }],
    intents: [{ required: true, message: 'Response intent is required' }],
  }
  textAnswerForm = cloneDeep(this.initialTextAnswerForm)
  updatingTextAnswer?: TextAnswer
  $refs!: {
    textAnswerForm: ElForm
  }

  async handleSaveTextAnswer() {
    const valid = await this.$refs.textAnswerForm.validate()

    if (!valid) {
      return
    }

    const textanswer = { ...this.textAnswerForm } as TextAnswer

    const request = this.updatingTextAnswer
      ? TextAnswerAPI.getInstance().updateTextAnswer(this.updatingTextAnswer._id, textanswer)
      : TextAnswerAPI.getInstance().createTextAnswer(textanswer)

    try {
      this.dialogTextAnswerLoading = true
      await request
      this.dialogTextAnswerVisible = false
      this.$message.success('The content has been saved successfully')
      this.fetchTextAnswers()
    } catch (error) {
      // do nothing
    } finally {
      this.dialogTextAnswerLoading = false
    }
  }

  onDialogTextAnswerClosed() {
    this.updatingTextAnswer = undefined
    this.textAnswerForm = cloneDeep(this.initialTextAnswerForm)
    this.$refs.textAnswerForm.resetFields()
  }

  async fetchTextAnswers() {
    const response = await TextAnswerAPI.getInstance().getTextAnswers()
    this.textAnswers = response
    this.hasNoData = !this.textAnswers.length
  }
  async fetchIntents() {
    this.intents = await IntentAPI.getInstance().getIntents()
  }

  async handleDeleteTextAnswer(textanswer: TextAnswer) {
    await TextAnswerAPI.getInstance().deleteTextAnswer(textanswer._id)
    this.$message.success('The content has been deleted successfully')
    this.fetchTextAnswers()
  }

  handleEditTextAnswer(textanswer: TextAnswer) {
    this.updatingTextAnswer = textanswer
    const { _id, ...textAnswerForm } = textanswer

    this.textAnswerForm = {
      ...this.textAnswerForm,
      ...textAnswerForm,
      intents: textAnswerForm.intents,
    }

    this.dialogTextAnswerVisible = true
  }

  created() {
    this.$store.commit('ui/setHeaderTitle', 'Answers')
    this.fetchTextAnswers()
    this.fetchIntents()
  }
}
</script>
