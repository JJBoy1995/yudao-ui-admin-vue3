import request from '@/config/axios'

export interface PatientsVo {
  id: number
  userId: number
  name: string
  idCard: string
  phone: string
  gender: number
  weight: number
  healthInfo: string
  edCheck: number
  createTime?: Date
}

// 创建会员用药人信息
export const createPatients = (data: PatientsVo) => {
  return request.post({url: '/member/patients/create', data})
}

// 更新会员用药人信息
export const updatePatients = (data: PatientsVo) => {
  return request.put({url: '/member/patients/update', data})
}

// 删除会员用药人信息
export const deletePatients = (id) => {
  return request.delete({url: '/member/patients/delete?id=' + id})
}

// 获得会员用药人信息
export const getPatients = (id) => {
  return request.get({url: '/member/patients/get?id=' + id})
};

// 获得会员用药人信息分页
export const getPatientsPage = (params) => {
  return request.get({url: '/member/patients/page', params})
}

// 导出会员用药人信息 Excel
export const exportPatientsExcel = (params) => {
  return request.download({url: '/member/patients/export-excel', params})
}
