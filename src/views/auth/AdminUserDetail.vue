<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form :model="formState" :rules="rulesRef" @submit="handleSubmit">
      <a-form-item field="validateInfos.username" label="用户名" name="username">
        <a-input placeholder="用户名" v-model="formState.username"></a-input>
      </a-form-item>

      <a-form-item v-if="!isEdit" field="validateInfos.password" label="密码" name="password">
        <a-input placeholder="密码" v-model="formState.password"></a-input>
      </a-form-item>

      <a-form-item v-if="!isEdit" field="validateInfos.confirmpsd" label="确认密码" name="confirmpsd">
        <a-input placeholder="确认密码" v-model="formState.confirmpsd"></a-input>
      </a-form-item>

      <a-form-item field="validateInfos.name" label="姓名" name="name">
        <a-input placeholder="姓名" v-model="formState.name"></a-input>
      </a-form-item>

      <a-form-item field="validateInfos.phone" label="手机号" name="phone">
        <a-input placeholder="手机号" v-model="formState.phone"></a-input>
      </a-form-item>

      <a-form-item field="validateInfos.isEnable" label="是否启用" name="isEnable">
        <a-select v-model="formState.isEnable">
          <a-option :value="1">启用</a-option>
          <a-option :value="0">禁用</a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="validateInfos.roleIds" label="角色" name="roleIds">
        <a-select mode="multiple" v-model="formState.roleIds">
          <a-option v-for="item in roles" :key="item.id" :value="item.id">{{ item.name }}</a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="validateInfos.remark" label="描述" extra="请填写一段描述">
        <a-textarea :rows="5" placeholder="..." v-model="formState.remark" />
      </a-form-item>

      <a-form-item field="buttonCol">
        <a-row>
          <a-col :span="6">
            <a-button type="primary" html-type="submit" v-action:auth:adminUser:saveUser>提交</a-button>
          </a-col>
          <a-col :span="10">
            <a-button @click="handleGoBack">返回</a-button>
          </a-col>
          <a-col :span="8"></a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
  import { saveWebUser, getWebUserDetail } from '@/api/auth/sysUser';
  import type { AdminUser } from '@/api/auth/sysUser';
  // import { getAllRole } from '../../api/auth/role';
  import { onMounted, nextTick, reactive, ref, Ref, UnwrapRef, inject } from 'vue';
  import { validateConfirm, anyRequire, pattern, number, arrayRequire } from '@/utils/rules';
  // import type { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  // import { Form } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { pick } from 'lodash';
  import { validResp } from '@/utils';

  // const useForm = Form.useForm;
  const { query } = useRoute();
  // const $multiTab = inject<MultiTabApi>('$multiTab') as MultiTabApi;
  // const $message = inject<MessageApi>('$message') as MessageApi;
  const formState: UnwrapRef<AdminUser> = reactive({
    username: '',
    password: undefined,
    confirmpsd: undefined,
    name: '',
    phone: undefined,
    isEnable: 1,
    roleIds: undefined,
    remark: '',
    mallId: undefined,
  });
  const validateConfirmPassword = (rule: any, value: string) =>
    validateConfirm(rule, value, formState.password as string, ['请再次填写确认密码', '两次密码不一致']);
  const rulesRef: Record<string, any> = reactive({
    username: [anyRequire('请填写用户名'), pattern('^[a-zA-Z0-9\u4e00-\u9fa5]{3,40}$', '用户名为3-12位字母,数字或汉字')],
    password: [anyRequire('请输入密码'), pattern('^[a-zA-Z0-9]{6,12}$', '请输入6到12位字母或数字')],
    confirmpsd: [{ validator: validateConfirmPassword, required: true }],
    name: [anyRequire('请填写姓名'), pattern('^[a-zA-Z\u4e00-\u9fa5]{2,40}$', '用户名为2-12位字母或汉字')],
    isEnable: [number('请选择状态')],
    roleIds: [arrayRequire('请选择角色')],
  });
  // const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);
  const roles: Ref<Record<string, any>[]> = ref([]);
  const id: Ref<number> = ref(0);
  const mallId: Ref<number | null> = ref(null);
  const isEdit: Ref<boolean> = ref(false);

  const handleGoBack = () => {
    // $multiTab.closeCurrentPage();
  };
  const handleSubmit = async ({ values, errors }: { values: Record<string, any>; errors?: Record<string, ValidatedError> }) => {
    console.log('Received values of form: ', values, errors);
    const resp = await saveWebUser({
      adminUser: { ...{ id: id.value }, ...values },
      password: values.password,
      roleIds: values.roleIds,
    });
    // if (validResp(resp)) {
    // $message.success(resp.msg);
    // $multiTab.closeCurrentPage({ name: 'AdminUserList' });
    // }
  };
  // const loadRole = async () => {
  //   const resp = await getAllRole();
  //   if (resp.data != null) {
  //     roles.value = resp.data as Record<string, any>[];
  //   }
  // }
  const loadData = async () => {
    const idQ: number = (query.id && parseInt(query.id as string, 10)) || 0;
    if (idQ > 0) {
      id.value = +idQ;
      const resp = await getWebUserDetail({ id: +idQ });
      if (validResp(resp)) {
        isEdit.value = true;
        const formData = pick(resp.data.adminUser, [
          'username',
          'password',
          'name',
          'phone',
          'isEnable',
          'roleIds',
          'remark',
          'mallId',
        ]);
        Object.assign(formState, formData);
      }
    } else {
      isEdit.value = false;
    }
  };

  onMounted(() => {
    nextTick(() => {
      // loadRole();
      loadData();
    });
  });
</script>
