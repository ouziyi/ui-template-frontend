<template>
  <el-dialog
    title="修改密码"
    :visible.sync="visible"
    :append-to-body="true"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="password">
        <el-input v-model="dataForm.password" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="dataForm.newPassword" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="dataForm.confirmPassword" type="password" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updatePassword } from '@/api/user'
export default {
  data() {
    var validateConfirmPassword = (rule, value, callback) => {
      if (this.dataForm.newPassword !== value) {
        callback(new Error('确认密码与新密码不一致'))
      } else {
        callback()
      }
    }
    var validateNewPassword = (rule, value, callback) => {
      if (this.lengthNotAvalidenabled(value)) {
        callback(new Error('请输入8-16位的密码'))
      } else if (this.regexSprit1(value)) {
        callback(new Error('密码种类应该超过三种'))
      } else if (this.notThreeEuqChar(value)) {
        callback(new Error('密码不能同时存在三个相同字符'))
      } else if (!this.noNumCharThree(value)) {
        callback(new Error('密码中不能存在三个连续数字 ，字母，特殊字符'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      dataRule: {
        password: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { validator: validateNewPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userName: {
      get() { return this.$store.state.user.name }
    }
    /* mainTabs: {
      get() { return this.$store.state.common.mainTabs },
      set(val) { this.$store.commit('common/updateMainTabs', val) }
    }*/
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    lengthNotAvalidenabled(newPassword) {
      if (this.notNullJudge(newPassword)) {
        if (newPassword.length < 8 || newPassword.length > 16) {
          return true
        } else {
          return false
        }
      }
    },
    notNullJudge(newPassword) {
      if (this.dataForm.id && !/\S/.test(newPassword)) {
        return false
      } else {
        return true
      }
    },
    noNumCharThree(newPassword) {
      var inputString = '1234567890abcdefghijklmopqrstuvwxyz!@#$%^&*()'
      for (var i = 0; i < newPassword.length - 3; i++) {
        var sprintString = newPassword.substring(i, i + 3)

        if (inputString.indexOf(sprintString.toLowerCase()) >= 0) {
          return false
        }
      }
      return true
    },
    notThreeEuqChar(newPassword) {
      var input = /(\w).{0,}\1.{0,}\1/
      if (!input.test(newPassword)) {
        return false
      } else {
        return true
      }
    },
    regexSprit1(newPassword) {
      // eslint-disable-next-line
        var reg = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[=\\\\~!@#$%^&*()\-+|\\[{\\]}:;\"',\<.\>?/_-])[\\\\0-9a-zA-Z ~!@#$%^&*()\-_=+|\\[{\\]\}:;\"',\<.\>?/]{8,16}"
      var regExp = new RegExp(reg)
      if (regExp.test(newPassword)) {
        return false
      } else {
        return true
      }
    },
    // 初始化
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          /* this.$http({
            url: this.$http.adornUrl('/user/password'),
            method: 'post',
            data: this.$http.adornData({
              'password': this.dataForm.password,
              'newPassword': this.dataForm.newPassword
            })
          })*/updatePassword({
            'password': this.dataForm.password,
            'newPassword': this.dataForm.newPassword
          }).then(data => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$store.dispatch('user/resetToken')
                this.$router.push('/login')
                /* this.$nextTick(() => {
                  // this.mainTabs = []

                })*/
              }
            })
            // this.logout
          })
        }
      })
    }
  }
}
</script>

