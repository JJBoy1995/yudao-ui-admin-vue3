<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true"
             label-width="200px">
      <el-form-item label="会员id" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入会员id" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="用药人姓名" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入用药人姓名" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="用药人身份证号码" prop="idCard">
        <el-input v-model="queryParams.idCard" placeholder="请输入用药人身份证号码" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="用药人手机号码" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入用药人手机号码" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="用药人性别 1 男 2女" prop="gender">
        <el-input v-model="queryParams.gender" placeholder="请输入用药人性别 1 男 2女" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="用药人体重" prop="weight">
        <el-input v-model="queryParams.weight" placeholder="请输入用药人体重" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="用药人健康信息（疾病史）" prop="healthInfo">
        <el-input v-model="queryParams.healthInfo" placeholder="请输入用药人健康信息（疾病史）"
                  clearable @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="是否确诊ED" prop="edCheck">
        <el-input v-model="queryParams.edCheck" placeholder="请输入是否确诊ED" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px"
                        value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
        <el-button type="primary" @click="openForm(undefined)"
                   v-hasPermi="['member:patients:create']">
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button v-hasPermi="['member:patients:export']" :loading="exportLoading" plain
                   type="success"
                   @click="handleExport"
        >
          <Icon class="mr-5px" icon="ep:download"/>
          导出
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键" align="center" prop="id"/>
      <el-table-column label="会员id" align="center" prop="userId"/>
      <el-table-column label="用药人姓名" align="center" prop="name"/>
      <el-table-column label="用药人身份证号码" align="center" prop="idCard"/>
      <el-table-column label="用药人手机号码" align="center" prop="phone"/>
      <el-table-column label="用药人性别 1 男 2女" align="center" prop="gender"/>
      <el-table-column label="用药人体重" align="center" prop="weight"/>
      <el-table-column label="用药人健康信息（疾病史）" align="center" prop="healthInfo"/>
      <el-table-column label="是否确诊ED" align="center" prop="edCheck"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="openForm(scope.row.id)"
                     v-hasPermi="['member:patients:update']">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['member:patients:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNo"
                v-model:limit="queryParams.pageSize"
                @pagination="getList"/>
    <!-- 对话框(添加 / 修改) -->
    <PatientsForm ref="formRef" @success="getList"/>
  </ContentWrap>
</template>

<script setup lang="ts">
import * as PatientsApi from '@/api/member/patients';
import PatientsForm from './PatientsForm.vue';
import download from "@/utils/download";
import {dateFormatter} from "@/utils/formatTime";

defineOptions({name: 'Patients'})


const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const exportLoading = ref(false) // 导出遮罩层
const total = ref(0) // 总条数
const list = ref([]) // 会员用药人信息列表

//查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: null,
  name: null,
  idCard: null,
  phone: null,
  gender: null,
  weight: null,
  healthInfo: null,
  edCheck: null,
  createTime: [],
})
/** 查询列表 */
const getList = async () => {
  try {
    loading.value = true;
    const data = await PatientsApi.getPatientsPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false;
  }
}

const queryFormRef = ref();
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery();
};
const formRef = ref()
/** 添加/修改操作 */
const openForm = (id) => {
  formRef.value.open(id);
};
/** 删除按钮操作 */
const handleDelete = async (row) => {
  const id = row.id;
  try {
    await message.delConfirm();
    await PatientsApi.deletePatients(id);
    message.success(t('common.delSuccess'))
    await getList();
  } catch {
  }
};
/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm();
    // 发起导出
    exportLoading.value = true
    const res = await PatientsApi.exportPatientsExcel(queryParams);
    download.excel(res, '会员用药人信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
};
/** 初始化 **/
onMounted(() => {
  getList()
});
</script>
