<template>
  <div>
    <el-table
      :data="contents.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <el-table-column label="Name">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name | truncate(160) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Intent">
        <template slot-scope="scope">
          <div class="tag-group">
            <el-tag
              size="mini"
              v-for="(intent, index) in scope.row.intentsObject"
              :key="index"
            >{{ intent.name }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Date">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.updatedAt | date }}</span>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="Type to search"/>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="$emit('edit', contents[scope.$index])">
            <i class="el-icon-edit pointer" type="edit"></i>
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="onDeleteRequested([scope.$index])">
            <i class="el-icon-delete pointer"></i>
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog for new data -->
    <el-dialog
      placement="top"
      width="400"
      :visible.sync="deleteConfirmVisible"
      :close-on-click-modal="false"
      v-model="deleteConfirmVisible"
      style="text-align: center;"
    >
      <h2>Are you sure to delete this message?</h2>
      <div>
        <el-button @click="onDeleteDecline">No</el-button>
        <el-button type="primary" @click="onDeleteConfirm">Yes</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TextContent } from '@/apis/textContent'
import { formatDate, truncate } from '@/utils'

@Component({
  filters: {
    date: function(str) {
      return formatDate(str)
    },
    truncate: function(str, stop) {
      return truncate(str, stop)
    },
  },
})
export default class TextContentComponent extends Vue {
  @Prop({
    type: Array,
    required: true,
  })
  private readonly contents: Partial<TextContent[]>
  private search = ''
  contentIndex: number
  actionVisible = false
  deleteConfirmVisible = false
  deleteRequested = false

  onDeleteRequested(index) {
    this.contentIndex = index
    this.deleteConfirmVisible = true
  }
  onDeleteDecline() {
    this.deleteRequested = false
    this.deleteConfirmVisible = false
  }
  onDeleteConfirm() {
    this.deleteConfirmVisible = false
    this.deleteConfirmVisible = false
    this.$emit('delete', this.contents[this.contentIndex])
  }
}
</script>
