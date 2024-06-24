import { BaseModel, BasicPageParams, QueryParam } from '@/api/model/baseModel';
import { Message } from '@arco-design/web-vue';
import { validResp } from '@/utils';
import { ref, reactive, Ref, UnwrapRef } from 'vue';
import { STableProps } from '@/components/Table';
import { useRouter } from 'vue-router';
import { pick } from 'lodash';
import { Result } from '@/types/global';

type TableModel = BaseModel & { [propName: string]: number };

export default function useSTable(pageListFn: Fn, queryModel: Record<string, any>, deleteOneFn?: Fn, changeStatusFn?: Fn) {
  const queryParam: UnwrapRef<QueryParam> = reactive(queryModel);
  const table: Ref<STableProps | null> = ref(null);
  const router = useRouter();

  const loadDataFn = (callbackFn?: Fn) => {
    Object.keys(queryParam).forEach((key) => {
      if (queryParam[key] instanceof String) {
        queryParam[key] = queryParam[key] || null;
      }
    });
    return (parameter: BasicPageParams) => {
      return pageListFn(Object.assign(parameter, queryParam)).then((res: Result) => {
        if (callbackFn) {
          callbackFn(res.data);
        }
        return res;
      });
    };
  };
  const searchFn = (callbackFn?: () => void) => {
    return (e: Event) => {
      e.preventDefault();
      if (callbackFn) {
        callbackFn();
      }
      table.value?.refresh(true);
    };
  };
  const handleOk = (bol?: boolean) => {
    table.value?.refresh(bol);
  };
  const resetFn = (callbackFn?: () => void, resetModel?: Record<string, any>) => {
    return () => {
      Object.keys(queryModel).forEach((key) => {
        queryParam[key] = null;
      });
      if (resetModel) {
        Object.assign(queryParam, resetModel);
      }
      if (callbackFn) {
        callbackFn();
      }
    };
  };
  const onChangeStatus = (record: TableModel, prop = 'status') => {
    const tableModel = pick(record, 'id', prop);
    tableModel[prop] = tableModel[prop] === 1 ? 0 : 1;
    if (changeStatusFn) {
      changeStatusFn(tableModel).then((res: Result) => {
        if (res.code === 0) {
          record[prop] = res.data[prop];
          Message.success('保存成功');
        }
      });
    }
  };
  const handleDeleteFn = (callbackFn?: () => void) => {
    return async (id: number) => {
      const resp = deleteOneFn && (await deleteOneFn(id));
      if (validResp(resp)) {
        Message.success('删除成功!');
        if (callbackFn) {
          callbackFn();
        }
        table.value?.refresh();
      } else Message.warning(resp.msg || '删除失败');
    };
  };
  const handleAddFn = (pageName: string) => {
    return () => {
      router.push({ name: pageName });
    };
  };
  const handleEditFn = (pageName: string) => {
    return (query: Record<string, any>) => {
      router.push({ name: pageName, query });
    };
  };

  return {
    queryParam,
    table,
    loadDataFn,
    searchFn,
    handleOk,
    resetFn,
    handleAddFn,
    handleEditFn,
    onChangeStatus,
    handleDeleteFn,
  };
}
