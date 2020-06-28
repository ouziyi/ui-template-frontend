<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="padding-left:0;">文件名: </label>
    <el-input v-model="filename" placeholder="请输入要导出的文件名(包括文件类型)" clearable style="width:345px;" prefix-icon="el-icon-document" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    filename: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
