<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="600px"
    @close="closeHandler"
  >
    <el-form ref="dataForm" :model="dataForm" size="small" :rules="dataRule" label-width="80px" style="width: 400px; margin-left:50px;" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.resourceType">
          <el-radio v-for="(type, index) in dataForm.typeList" :key="index" :label="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.resourceType] + '名称'" prop="resourceName">
        <el-input v-model="dataForm.resourceName" :placeholder="dataForm.typeList[dataForm.resourceType] + '名称'" />
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName">
        <el-popover
          ref="menuListPopover"
          placement="buttom"
          trigger="click"
        >
          <el-tree
            ref="menuListTree"
            :data="menuList"
            :props="menuListTreeProps"
            node-key="id"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false"
            @current-change="menuListTreeCurrentChangeHandle"
          />
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单，不选默认为一级目录" class="menu-list__input" />
      </el-form-item>
      <el-form-item label="权限标识" prop="resourceKey">
        <el-input v-model.trim="dataForm.resourceKey" placeholder="系统用来判断权限的唯一key" maxlength="32" />
      </el-form-item>
      <el-form-item v-if="dataForm.resourceType!==1&&dataForm.resourceType!==2&&dataForm.resourceType!==3" label="重定向url" prop="redirectUrl">
        <el-input v-model.trim="dataForm.redirectUrl" placeholder="点击面包屑重定向的url, 不需要请填写noRedirect" maxlength="32" />
      </el-form-item>
      <el-form-item v-if="dataForm.resourceType!==2" label="菜单图标" prop="resourceIcon">
        <el-popover
          ref="iconListPopover"
          placement="bottom-start"
          trigger="click"
          popper-class="mod-menu__icon-popover"
        >
          <div class="mod-menu__icon-inner">
            <div class="mod-menu__icon-list">
              <el-button
                v-for="(item, index) in iconList"
                :key="index"
                :class="{ 'is-active': item === dataForm.icon }"
                @click="iconActiveHandle(item)"
              >
                <svg-icon :icon-class="item" />
              </el-button>
            </div>
          </div>
        </el-popover>
        <el-input v-model="dataForm.resourceIcon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input" />
      </el-form-item>
      <el-form-item v-if="dataForm.resourceType!==2" label="地址栏url" prop="resourcePath">
        <el-tooltip class="item" effect="dark" content="1、单页面路由地址 2、外链地址以http://或https://开头" placement="right">
          <el-input v-model.trim="dataForm.resourcePath" placeholder="浏览器地址栏显示的url" />
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="dataForm.resourceType!==2&&dataForm.resourceType!==3" label="菜单链接" prop="resourceUrl">
        <el-tooltip class="item" effect="dark" content="1、一级菜单填Layout 2、包含子菜单的二级菜单填nested 3、最后子菜单填写页面对应路径" placement="right">
          <el-input v-model.trim="dataForm.resourceUrl" placeholder="菜单对应前台页面的路径" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.resourceType] + '排序'" prop="resourceLevel">
        <el-input v-model.number="dataForm.resourceLevel" :placeholder="dataForm.typeList[dataForm.resourceType] + '排序'" maxlength="32" />
      </el-form-item>
      <el-form-item v-show="dataForm.type === 2" label="页面name" prop="resourcePageName">
        <el-tooltip class="item" effect="dark" content="如果前端页面开启了tagView，一定要跟页面中定义的name值保持名称一致，否则不能keep-alive" placement="right">
          <el-input v-model.trim="dataForm.resourcePageName" placeholder="前端页面定义的名称" maxlength="32" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="是否缓存" prop="resourceCache">
        <el-radio-group v-model="dataForm.resourceCache">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否展示" prop="resourceShow">
        <el-radio-group v-model="dataForm.resourceShow">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model.trim="dataForm.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注信息" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils/tree'
import { selectMenu, getMenuInfo, menuSaveOrUpdate } from '@/api/menu'
import Icon from '@/icons'
export default {
  data() {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      iconList: [],
      dataForm: {
        id: 0,
        resourceType: 1,
        typeList: ['目录', '菜单', '按钮', '外链'],
        resourceName: '',
        parentId: 0,
        parentName: '',
        resourceKey: '',
        resourceIcon: '',
        resourcePath: '',
        redirectUrl: '',
        resourceUrl: '',
        resourceLevel: '',
        resourcePageName: '',
        resourceCache: true,
        resourceShow: true,
        description: '',
        iconList: []
      },
      dataRule: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        url: [
          { validator: validateUrl, trigger: 'blur' }
        ]
      },
      menuList: [],
      menuListTreeProps: {
        label: 'resourceName',
        children: 'children'
      }
    }
  },
  created() {
    this.iconList = Icon.getNameList()
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      selectMenu().then(data => {
        this.menuList = treeDataTranslate(data.body, 'id')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (!this.dataForm.id) {
          // 新增
          this.menuListTreeSetCurrentNode()
        } else {
          // 修改
          getMenuInfo(this.dataForm.id).then(data => {
            for (var key in data.body) {
              if (this.dataForm.hasOwnProperty(key)) {
                this.dataForm[key] = data.body[key]
              }
            }
            this.menuListTreeSetCurrentNode()
          })
        }
      })
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.resourceIcon = iconName
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.resourceName
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      if (this.$refs.menuListTree) {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['resourceName']
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          menuSaveOrUpdate(this.dataForm.id, {
            'id': this.dataForm.id || undefined,
            'resourceType': this.dataForm.resourceType,
            'redirectUrl': this.dataForm.redirectUrl,
            'resourceName': this.dataForm.resourceName,
            'parentId': this.dataForm.parentId,
            'resourceKey': this.dataForm.resourceKey,
            'resourceIcon': this.dataForm.resourceIcon,
            'resourcePath': this.dataForm.resourcePath,
            'resourceUrl': this.dataForm.resourceUrl,
            'resourceLevel': this.dataForm.resourceLevel,
            'resourcePageName': this.dataForm.resourcePageName,
            'resourceCache': this.dataForm.resourceCache,
            'resourceShow': this.dataForm.resourceShow,
            'description': this.dataForm.description
          }).then(data => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    },
    closeHandler() {
      this.$refs['dataForm'].resetFields()
      this.$refs.menuListTree.setCurrentKey(null)
    }
  }
}
</script>

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      width: 458px;
      overflow: hidden;
    }
    &__icon-inner {
      width: 478px;
      max-height: 258px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
