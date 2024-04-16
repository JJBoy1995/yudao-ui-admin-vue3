<template>
    <!-- 对话框(添加 / 修改) -->
    <Dialog :title="dialogTitle" v-model="dialogVisible" width="800">
      <el-form ref="formRef" :model="formData" :rules="formRules" v-loading="formLoading"
               label-width="100px">
        <el-form-item label="会员id" prop="userId">
          <el-input v-model="formData.userId" placeholder="请输入会员id"/>
        </el-form-item>
        <el-form-item label="用药人姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入用药人姓名"/>
        </el-form-item>
        <el-form-item label="用药人身份证号码" prop="idCard">
          <el-input v-model="formData.idCard" placeholder="请输入用药人身份证号码"/>
        </el-form-item>
        <el-form-item label="用药人手机号码" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入用药人手机号码"/>
        </el-form-item>
        <el-form-item label="用药人性别 1 男 2女" prop="gender">
          <el-input v-model="formData.gender" placeholder="请输入用药人性别 1 男 2女"/>
        </el-form-item>
        <el-form-item label="用药人体重" prop="weight">
          <el-input v-model="formData.weight" placeholder="请输入用药人体重"/>
        </el-form-item>
        <el-form-item label="用药人健康信息（疾病史）" prop="healthInfo">
          <el-input v-model="formData.healthInfo" placeholder="请输入用药人健康信息（疾病史）"/>
        </el-form-item>
        <el-form-item label="是否确诊ED" prop="edCheck">
          <el-input v-model="formData.edCheck" placeholder="请输入是否确诊ED"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </Dialog>
</template>

<script setup lang="ts">
import * as PatientsApi from '@/api/member/patients';

defineOptions({name: 'PatientsForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  userId: undefined,
  name: undefined,
  idCard: undefined,
  phone: undefined,
  gender: undefined,
  weight: undefined,
  healthInfo: undefined,
  edCheck: undefined,
})

// 表单校验
const formRules = reactive({
    userId: [{required: true, message: '会员id不能为空', trigger: 'blur'}],
    idCard: [{required: true, message: '用药人身份证号码不能为空', trigger: 'blur'}],
    phone: [{required: true, message: '用药人手机号码不能为空', trigger: 'blur'}],
    gender: [{required: true, message: '用药人性别 1 男 2女不能为空', trigger: 'blur'}],
    weight: [{required: true, message: '用药人体重不能为空', trigger: 'blur'}],
    healthInfo: [{required: true, message: '用药人健康信息（疾病史）不能为空', trigger: 'blur'}],
    edCheck: [{required: true, message: '是否确诊ED不能为空', trigger: 'blur'}],
  }
)
const formRef = ref() // 表单 Ref
/** 打开弹窗 */
const open = async (id) => {
  dialogVisible.value = true;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await PatientsApi.getPatients(id);
      dialogTitle.value = "修改会员用药人信息";
    } finally {
      formLoading.value = false;
    }
  } else
    dialogTitle.value = "新增会员用药人信息";
};
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交按钮 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as PatientsApi.PatientsVo;
    // 修改的提交
    if (data.id) {
      await PatientsApi.updatePatients(data);
      message.success(t('common.updateSuccess'))
      dialogVisible.value = false;
      emit('success')
      return;
    }
    // 添加的提交
    await PatientsApi.createPatients(data);
    message.success(t('common.createSuccess'))
    dialogVisible.value = false;
    emit('success')
  } finally {
    formLoading.value = false;
  }
};

/** 表单重置 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    userId: undefined,
    name: undefined,
    idCard: undefined,
    phone: undefined,
    gender: undefined,
    weight: undefined,
    healthInfo: undefined,
    edCheck: undefined,
  };
  formRef.value?.resetFields()
}


</script>
