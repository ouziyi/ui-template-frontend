<template>
  <div class="app-container">

    <div>
      <FilenameOption v-model="filename" />
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/api/excel'
import FilenameOption from './components/FilenameOption'

export default {
  name: 'ExportExcel',
  components: { FilenameOption },
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      fileType: 'xlsx'
    }
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      downloadExcel({ 'filename': this.filename }).then((res) => {
        if (res.data.msgCd) {
          this.$message({
            message: res.data.msgInfo,
            type: 'error',
            duration: 3000
          })
          return
        }
        const link = document.createElement('a')
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', this.filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(error => {
        this.$message({
          message: '导出失败',
          type: 'error',
          duration: 3000
        })
        console.log(error)
      })
      this.downloadLoading = false
    }
  }
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
