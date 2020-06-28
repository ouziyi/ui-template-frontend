<template>
  <div class="app-container">
    <el-form :inline="true" :model="dataForm" size="small" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:role:delete')" type="danger" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      size="small"
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="ID"
      />
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色名称"
      />
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
      />
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :formatter="formatDateTime"
        width="180"
        label="创建时间"
      />
      <el-table-column
        v-if="isAuth('sys:role:update')||isAuth('sys:role:delete')"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import AddOrUpdate from './role-add-or-update'
import { getPageRoles, deleteRole } from '@/api/role'
import { formatDateTime } from '@/utils/index'
export default {
  name: 'Role',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {
        roleName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    formatDateTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      getPageRoles({
        'pageNum': this.pageIndex,
        'pageSize': this.pageSize,
        'roleName': this.dataForm.roleName
      }).then(data => {
        this.dataList = data.body.resultList
        this.totalPage = data.body.total
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
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
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.roleId
      })
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({
          'roleIds': ids
        }).then(data => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataForm.pageIndex = 1
              this.getDataList()
            }
          })
        })
      }).catch(() => {})
    }
  }
}
</script>
