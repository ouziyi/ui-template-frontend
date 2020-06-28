<template>
  <div class="app-container">
    <el-form :inline="true" size="small" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="primary" icon="el-icon-circle-plus" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      row-key="id"
      border
      size="small"
      style="width: 100%; "
    >
      <el-table-column
        prop="resourceName"
        header-align="center"
        label="名称"
      />
      <el-table-column
        prop="resourceKey"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="200"
        label="授权标识"
      />
      <el-table-column
        prop="resourceUrl"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="链接"
      />
      <el-table-column
        prop="resourceUrl"
        header-align="center"
        align="center"
        label="图标"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.resourceIcon" />
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.resourceType === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.resourceType === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.resourceType === 2" size="small" type="info">按钮</el-tag>
          <el-tag v-else size="small" type="info">外链</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="resourceLevel"
        header-align="center"
        align="center"
        width="80"
        label="排序号"
      />
      <el-table-column
        v-if="isAuth('sys:menu:update')||isAuth('sys:menu:delete')"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('sys:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import AddOrUpdate from './menu-add-or-update'
// import { treeDataTranslate } from '@/utils/tree'
import { getMenus, deleteMenu } from '@/api/menu'
export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      getMenus().then(data => {
        this.dataList = data.body
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(id).then(data => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      }).catch(() => {})
    }
  }
}
</script>
