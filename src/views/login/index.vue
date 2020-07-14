<template>
  <div class="login-container">
    <background />
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <!--<img :src="logoImg" class="logo-img">-->
        <h3 class="title">管理系统模板</h3>
        <!--
        <lang-select class="set-language"></lang-select>-->
      </div>

      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写键盘已开启" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            tabindex="2"
            name="password"
            auto-complete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-col :span="15">
        <el-form-item prop="verifyCode">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginForm.verifyCode"
            placeholder="请输入图片验证码"
            name="verifyCode"
            type="text"
            tabindex="3"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <img :src="url" class="v-code-img" alt="验证码加载失败" @click="refreshCode">
      </el-col>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <div style="position:relative">
        <!--  <div class="tips">
           前后端分离开源整合框架
        </div>
        <div class="tips">
          Copyright © 2010-2020 Hisunpay. All Rights Reserved.
        </div>-->
        <!-- <el-input v-show="false" v-model="loginForm.verkey" name="verkey" type="hidden" />-->
        <!--
        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          {{ $t('login.thirdparty') }}
        </el-button>-->
      </div>
    </el-form>
  </div>
</template>

<script>
import Background from '@/components/Background'

export default {
  name: 'Login',
  components: { Background },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入不小于6位的密码'))
      } else {
        callback()
      }
    }
    const validateVCode = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('请输入图片验证码'))
      } else {
        callback()
      }
    }
    return {
      url: process.env.VUE_APP_BASE_API + '/captcha',
      loginForm: {
        username: '',
        password: '',
        verifyCode: ''
      },
      loginRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifyCode: [{ required: true, trigger: 'blur', validator: validateVCode }]
      },
      // vcodeImg: this.imgCode(),
      passwordType: 'password',
      capsTooltip: false,
      loading: false
      // logoImg: logo,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', { 'username': this.loginForm.username, 'password': this.loginForm.password, 'verifyCode': this.loginForm.verifyCode }).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.refreshCode()
            delete this.loginForm.verifyCode
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 切换验证码
    refreshCode() {
      // 加时间戳，防止浏览器利用缓存
      var src = process.env.VUE_APP_BASE_API + '/captcha?' + new Date().getTime()
      this.url = src
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          -webkit-text-fill-color: #fff;
          transition: background-color 5000s ease-out 0.5s;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  $background: '';

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background:url($background) no-repeat center fixed;
    background-size:100%;
    .login-form {
      position: absolute;
      left:0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 8% auto;
      background: rgba(109, 109, 109, 0.23);
      border: 0px solid rgb(221, 222, 225);
      box-shadow: 1px 1px 50px rgba(0,0,0,.3);
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
        padding-top: 12px;
      }

    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
    .v-code-img {
      height: 35px;
      width: 100px;
      //float: right;
      //margin-top: 2px;
      margin: 10px 10px 10px;
      border-radius: 5px;
      cursor: pointer;
      opacity: 0.6;
      filter: alpha(opacity=60);
    }
    .logo-img {
      height: 47px;
      float: left;
      margin-top: 2px;
      border-radius: 5px;
      cursor: pointer;
      margin-left: 76px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
