import { Ref, unref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { Result } from '@/types/global';

export interface Props {
  [key: string]: any;
}
export function useExcel(dataRef: Props | Props[], exportFn: Fn, loadingRef?: Ref<boolean>) {
  const handleExport = () => {
    const data = unref(dataRef);
    if (!data) {
      Message.error('请先勾选导出信息！');
      return;
    }
    let excelData: Props[] = [];
    if (!(data instanceof Array)) {
      excelData.push(data);
    } else {
      excelData = data;
    }
    if (excelData.length === 0) {
      Message.error('请先勾选导出信息！');
      return;
    }
    if (loadingRef) {
      if (loadingRef?.value) return;
      loadingRef.value = true;
    }
    excelData.forEach((dataItem) => {
      exportFn(dataItem)
        .then((resp: Result & { headers: any }) => {
          const blob = new Blob([resp.data], { type: 'application/vnd.ms-excel' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = decodeURI(resp.headers.filename);
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        })
        .catch(() => {
          Message.warning('导出失败');
        });
    });
    if (loadingRef) {
      loadingRef.value = false;
    }
  };

  return { handleExport };
}
