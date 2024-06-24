<template>
  <page-container>
    <a-card class="general-card" title="系统用户">
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="9">
                <a-form-item label="用户名称">
                  <a-input v-model="queryParam.key" placeholder="请输入" @press-enter="search" />
                </a-form-item>
              </a-col>
              <a-col :span="9">
                <a-form-item label="状态">
                  <a-select v-model="queryParam.isEnable" placeholder="请选择" default-value="0">
                    <a-option value="0">全部</a-option>
                    <a-option value="1">正常</a-option>
                    <a-option value="2">禁用</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 38px" direction="vertical" />
        <a-col :flex="'192px'" style="text-align: right">
          <a-space :size="18">
            <a-button v-action:auth:adminUser:query type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0; margin-bottom: 8px" />
      <a-row style="margin-bottom: 8px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" shape="round" @click="handleAdd">
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>
            <a-upload action="/" shape="round">
              <template #upload-button>
                <a-button>批量导入</a-button>
              </template>
            </a-upload>
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-button shape="round">
            <template #icon>
              <icon-download />
            </template>
            下载
          </a-button>
          <a-tooltip content="刷新">
            <div class="action-icon" @click="search">
              <icon-refresh size="18" />
            </div>
          </a-tooltip>
        </a-col>
      </a-row>
      <s-table ref="table" size="small" row-key="id" :columns="columns" :run="loadData">
        <template #isEnable="{ record }">
          <span>
            <a-switch
              v-action:auth:adminUser:changeUserStatus
              :model-value="record.isEnable === 1"
              checked-text="启用"
              unchecked-text="禁用"
              @change="onChangeStatus(record, 'isEnable')"
            />
          </span>
        </template>
        <template #action="{ record }">
          <a-link v-action:auth:adminUser:findDetail @click="handleEdit({ id: record.id })">编辑</a-link>
          <a-divider direction="vertical" style="margin-left: 3px; margin-right: 3px" />
          <a-dropdown>
            <a-link class="ant-dropdown-link">
              更多
              <icon-down />
            </a-link>
            <template #content>
              <a-doption>
                <a-link>重置密码</a-link>
              </a-doption>
              <a-doption>
                <a-link v-action:auth:adminUser:delete @click="handleDelete(record.id)">删除</a-link>
              </a-doption>
            </template>
          </a-dropdown>
        </template>
      </s-table>
      <!-- <a-modal :width="640" :open="visible" title="密码重置" @ok="visible = false" @cancel="visible = false">
        <a-form @submit="visible = false" :model="form">
          <a-form-item label="您重置的密码为" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-model:value="form.respPassword" />
          </a-form-item>
        </a-form>
      </a-modal> -->
    </a-card>
  </page-container>
</template>

<script lang="ts" setup>
  // import { inject, reactive, ref, PropType, Ref, UnwrapRef, unref, toRef, toRaw, Slots } from 'vue';
  import useSTable from '@/hooks/useSTable';
  import { getAdminUserList, deleteUser } from '../../api/auth/sysUser';

  const params = {
    key: null,
    isEnable: null,
  };
  const { queryParam, table, loadDataFn, searchFn, resetFn, handleAddFn, handleEditFn, handleDeleteFn, onChangeStatus } =
    useSTable(getAdminUserList, params, deleteUser);
  const loadData = loadDataFn();
  const search = searchFn();
  const reset = resetFn();
  const handleDelete = handleDeleteFn();
  const handleAdd = handleAddFn('AdminUserDetail');
  const handleEdit = handleEditFn('AdminUserDetail');
  // const visible = ref(false);
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 160,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'isEnable',
      slotName: 'isEnable',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      width: 500,
    },
    {
      title: '操作',
      width: '150px',
      dataIndex: 'action',
      slotName: 'action',
    },
  ];

  // import { validResp } from '@/utils/util';
  // interface restPass {
  //   respPassword: string | null;
  // }
  // const form: UnwrapRef<restPass> = reactive({
  //   respPassword: null,
  // });
  // const generatePassword = async (id: number) =>{
  //   visible.value = true;
  //   const resp = await generatePasswordApi({ id: id });
  //   if (validResp(resp)) {
  //     form.respPassword = resp.data.password;
  //   } else $message.warning(resp.msg);
  // }
</script>

<script lang="ts">
  export default {
    name: 'SysRoleList',
  };
</script>
