import { propTypes } from '@/utils/propTypes';
import T from '@arco-design/web-vue/es/table/index';
// import T from '@/ant-design-vue/Table/index';
import { get } from 'lodash';
import { defineComponent, reactive, ref, PropType, Ref, unref, Slots } from 'vue';
import { BasicPageParams } from '@/api/model/baseModel';
import { PaginationProps } from '@arco-design/web-vue/es/pagination/interface';
import { TableChangeExtra, Sorter, Filters } from '@arco-design/web-vue/es/table/interface';
import { SorterResult, TableResult } from './types/table';
import { columnProps } from './types/column';

interface RecordItem {
  id: number;
}
const STable = defineComponent({
  props: {
    ...T.props,
    ...{
      rowKey: propTypes.oneOfType([propTypes.string, propTypes.func]).def('key'),
      run: {
        type: Function as PropType<(parameter: BasicPageParams) => any>,
        required: true,
      },
      pageNum: propTypes.number.def(1),
      pageSize: propTypes.number.def(10),
      showSizeChanger: propTypes.bool.def(true),
      size: propTypes.string.def('default'),
      bordered: propTypes.bool.def(true),
      /**
       * alert: {
       *   show: true,
       *   clear: Function
       * }
       */
      alert: propTypes.oneOfType([propTypes.bool, propTypes.object]).def(undefined),
      rowSelection: propTypes.object.def(undefined),
      /** @Deprecated */
      // showAlertInfo: {
      //   type: Boolean,
      //   default: false
      // },
      showPagination: propTypes.oneOfType([propTypes.string, propTypes.bool]).def('auto'),
      /**
       * enable page URI mode
       *
       * e.g:
       * /users/1
       * /users/2
       * /users/3?queryParam=test
       * ...
       */
      pageURI: propTypes.bool.def(false),
    },
  },
  setup(props) {
    const needTotalList: Ref<columnProps[]> = ref([]);
    const selectedRows: Ref<columnProps[]> = ref([]);
    const selectedRowKeys: Ref<string[]> = ref([]);
    const localLoading = ref(false);
    const localData = ref([]);
    const localPagination = reactive({ ...props.pagination });
    const customRowKey: Ref<number | undefined> = ref(undefined);
    const currentPagination = 'localPagination.current';
    return {
      needTotalList,
      selectedRows,
      selectedRowKeys,
      localLoading,
      localData,
      localPagination,
      currentPagination,
      customRowKey,
    };
  },
  watch: {
    'localPagination.current': function (val) {
      // handler(val) {
      if (this.pageURI) {
        console.log('[pageURI]');
        this.$router.push({
          ...this.$route,
          name: this.$route.name as string,
          params: {
            ...this.$route.params,
            ...{
              pageNo: val,
            },
          },
        });
      }
      console.log('[current]', val);
      // change pagination, reset total data
      this.needTotalList = this.initTotalList(this.columns);
      this.selectedRowKeys = [];
      this.selectedRows = [];
      // },
      // immediate: true, // 可选,表示初始化时立即执行handler
    },
    // ['localPagination.current']: (val) => {
    //   if (this.pageURI) {
    //     this.$router.push({
    //       ...this.$route,
    //       name: this.$route.name as string,
    //       params: { ...this.$route.params, ...{
    //         pageNo: val,
    //       }},
    //     })
    //   }
    //   // change pagination, reset total data
    //   this.needTotalList = this.initTotalList(this.columns)
    //   this.selectedRowKeys = []
    //   this.selectedRows = []
    // },
    // 'pageNum': function (val) {
    //   Object.assign(this.localPagination, {
    //     current: val,
    //   });
    // },
    // 'pageSize': function (val) {
    //   Object.assign(this.localPagination, {
    //     pageSize: val,
    //   });
    // },
    'showSizeChanger': function (val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val,
      });
    },
  },
  created() {
    const { pageNo } = this.$route.params as Record<string, string>;
    const localPageNum = (this.pageURI && pageNo && parseInt(pageNo, 10)) || this.pageNum;
    this.localPagination =
      (['auto', true].includes(this.showPagination) && {
        ...this.localPagination,
        current: localPageNum,
        defaultCurrent: localPageNum,
        pageSize: this.pageSize,
        showSizeChanger: this.showSizeChanger,
      }) ||
      false;
    console.log('[localPagination]', this.localPagination);
    // this.needTotalList = this.initTotalList(this.columns);
    this.loadData();
  },
  methods: {
    setRow(record: RecordItem) {
      return {
        onClick: () => {
          this.customRowKey = record.id;
        }, // 点击行
        onDblclick: () => {},
        onContextmenu: () => {},
        onMouseenter: () => {}, // 鼠标移入行
        onMouseleave: () => {},
      };
    },
    setRowClassName(record: RecordItem) {
      return record.id === this.customRowKey ? 'clickRowStyle' : '';
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh(bool = false) {
      if (bool) {
        this.localPagination = {
          current: 1,
          pageSize: this.pageSize,
        };
      }
      this.loadData();
    },
    onPageChange(current: number) {
      const extra: TableChangeExtra = {
        type: 'pagination',
        page: current,
        pageSize: this.pageSize,
      };
      this.loadData(extra);
    },
    onPageSizeChange(pageSize: number) {
      const extra: TableChangeExtra = {
        type: 'pagination',
        page: this.pageNum,
        pageSize,
      };
      this.loadData(extra);
    },
    onSorterChange(dataIndex: string, direction: 'ascend' | 'descend') {
      const extra: TableChangeExtra = {
        type: 'sorter',
        sorter: {
          field: dataIndex,
          direction,
        },
      };
      this.loadData(extra);
    },
    onFilterChange(dataIndex: string, filteredValues: string[]) {
      const extra: TableChangeExtra = {
        type: 'filter',
        filters: {
          [dataIndex]: filteredValues,
        },
      };
      this.loadData(extra);
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData(extra?: TableChangeExtra) {
      console.log('[extra]', extra);
      const pagination: Partial<PaginationProps> = { current: extra?.page, pageSize: extra?.pageSize };
      const filters = extra?.filters;
      const sorter = extra?.sorter;
      this.localLoading = true;
      const parameter = {
        pageNo: (pagination && pagination.current) || (this.showPagination && this.localPagination.current) || this.pageNum,
        pageSize: (pagination && pagination.pageSize) || (this.showPagination && this.localPagination.pageSize) || this.pageSize,
        ...((sorter &&
          sorter.field && {
            sort: sorter.field,
          }) ||
          {}),
        ...((sorter &&
          sorter.direction && {
            order: sorter.direction === 'ascend' ? 'ascending' : 'descending',
          }) ||
          {}),
        ...filters,
      };
      const result = this.run(parameter);
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then((r: TableResult) => {
          this.localPagination =
            (this.showPagination && {
              ...this.localPagination,
              current: r.pageIndex, // 返回结果中的当前分页数
              total: r.totalCount, // 返回结果中的总记录数
              showSizeChanger: this.showSizeChanger,
              pageSize: (pagination && pagination.pageSize) || this.localPagination.pageSize,
            }) ||
            false;
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.data.length === 0 && this.showPagination && this.localPagination.current > 1) {
            this.localPagination.current -= 1;
            this.loadData();
            return;
          }

          // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          try {
            if (['auto', true].includes(this.showPagination) && r.totalCount <= r.pageIndex * this.localPagination.pageSize) {
              this.localPagination.hideOnSinglePage = true;
            }
          } catch (e) {
            this.localPagination = false;
          }
          this.localData = reactive(r.data); // 返回结果中的数组数据
          this.localLoading = false;
        });
      }
    },
    initTotalList(columns?: columnProps[]) {
      const totalList: columnProps[] = [];
      if (columns && columns instanceof Array) {
        columns.forEach((column) => {
          if (column.needTotal) {
            totalList.push({
              ...column,
              total: 0,
            });
          }
        });
      }
      return totalList;
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect(selectedRowKeys: string[], selectedRows: columnProps[]) {
      this.selectedRows = selectedRows;
      this.selectedRowKeys = selectedRowKeys;
      const list = unref(this.needTotalList);
      this.needTotalList = list.map((item) => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, `${item.dataIndex}`), 10);
            return Number.isNaN(total) ? 0 : total;
          }, 0),
        };
      });
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected() {
      if (this.rowSelection) {
        this.rowSelection.onChange([], []);
        this.updateSelect([], []);
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear(callback: () => void) {
      if (this.selectedRowKeys.length <= 0) return null;
      return (
        <a
          style="margin-left: 24px"
          onClick={() => {
            callback();
            this.clearSelected();
          }}
        >
          清空
        </a>
      );
    },
    renderAlert() {
      // 绘制统计列数据
      const needTotalItems = this.needTotalList.map((item) => {
        return (
          <span style="margin-right: 12px">
            {item.title}总计 <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
          </span>
        );
      });

      // 绘制 清空 按钮
      let clearItem = null;
      if (typeof this.alert.clear === 'boolean' && this.alert.clear) {
        clearItem = this.renderClear(this.clearSelected);
      } else if (this.alert !== null && typeof this.alert.clear === 'function') {
        clearItem = this.renderClear(this.alert.clear);
      }
      // typeof this.alert.clear === 'boolean' && this.alert.clear
      //   ? this.renderClear(this.clearSelected)
      //   : this.alert !== null && typeof this.alert.clear === 'function'
      //   ? this.renderClear(this.alert.clear)
      //   : null;

      // 绘制 alert 组件
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template v-slot="message">
            <span style="margin-right: 12px">
              已选择: <a style="font-weight: 600">{this.selectedRows.length}</a>
            </span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      );
    },
    updateColumns(cols = []) {
      const columns: any[] = [];
      const { $slots } = this;
      cols.forEach((col: any) => {
        const { slots = {}, ...restProps } = col;
        const column = {
          ...restProps,
        };
        Object.keys(slots).forEach((key) => {
          const name = slots[key];
          if (column[key] === undefined && $slots[name]) {
            column[key] = $slots[name];
          }
        });
        // if (slotScopeName && $scopedSlots[slotScopeName]) {
        //   column.customRender = column.customRender || $scopedSlots[slotScopeName]
        // }
        if (col.children) {
          column.children = this.updateColumns(column.children);
        }
        columns.push(column);
      });
      return columns;
    },
    extendSlots(slots: Slots, excludeKeys: string[] = []) {
      const slotKeys = Object.keys(slots);
      const ret: any = {};
      // for(const key of Object.keys(slots)) {
      //   if (excludeKeys.includes(key)) {
      //     return null;
      //   }
      //   ret[key] = () => slots[key];
      // }
      slotKeys.forEach((key) => {
        if (excludeKeys.includes(key)) {
          return null;
        }
        ret[key] = () => slots[key];
        return null;
      });
      return ret;
    },
  },
  render() {
    const props: Record<string, any> = {};
    const localKeys = ['localLoading', 'localData', 'localPagination'];
    const showAlert =
      (typeof this.alert === 'object' &&
        this.alert !== null &&
        this.alert.show &&
        typeof this.rowSelection.selectedRowKeys !== 'undefined') ||
      this.alert;

    Object.keys(T.props).forEach((k) => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`;
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey];
        return props[k];
      }
      if (k === 'rowSelection') {
        if (showAlert && this.rowSelection) {
          // 如果需要使用alert，则重新绑定 rowSelection 事件
          props[k] = {
            ...this.rowSelection,
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys: string[], selectedRows: columnProps[]) => {
              this.updateSelect(selectedRowKeys, selectedRows);
              if (typeof this[k].onChange !== 'undefined') {
                this[k].onChange(selectedRowKeys, selectedRows);
              }
            },
          };
          return props[k];
        }
        if (!this.rowSelection) {
          // 如果没打算开启 rowSelection 则清空默认的选择项
          props[k] = null;
          return props[k];
        }
      }
      // if (k === 'customRow' && props[k] === undefined) props[k] = this.setRow;
      // if (k === 'rowClassName' && props[k] === undefined && props['customRow'] === undefined) props[k] = this.setRowClassName;
      if (this[k]) {
        props[k] = this[k];
      }
      return props[k];
    });
    // props.columns = this.updateColumns(props.columns);
    const table =
      this.$slots && this.$slots.default ? (
        <T
          {...props}
          onPageChange={this.onPageChange}
          onPageSizeChange={this.onPageSizeChange}
          onSorterChange={this.onSorterChange as (dataIndex: string, direction: string) => any}
          onFilterChange={this.onFilterChange}
          onExpand={(expanded: boolean, record: columnProps) => {
            this.$emit('expand', expanded, record);
          }}
        >
          {/* {Object.keys(this.$slots).map((name) => (
          <template>{this.getCustomRender(this.$slots, name)}</template>
        ))} */}
          {/* <template v-slots={this.$slots}></template> */}
          {/* {extendSlots(this.$slots)} */}
          {/* {this.normalize(getSlot(this))} */}
        </T>
      ) : (
        <T
          {...props}
          onPageChange={this.onPageChange}
          onPageSizeChange={this.onPageSizeChange}
          onSorterChange={this.onSorterChange as (dataIndex: string, direction: string) => any}
          onFilterChange={this.onFilterChange}
          v-slots={this.$slots}
          onExpand={(expanded: boolean, record: columnProps) => {
            this.$emit('expand', expanded, record);
          }}
        >
          {/* {Object.keys(this.$slots).map((name) => (
          <template>{this.getCustomRender(this.$slots, name)}</template>
        ))} */}
          {/* <template v-slots={this.$slots}></template> */}
          {/* {extendSlots(this.$slots)} */}
          {/* {this.normalize(getSlot(this))} */}
        </T>
      );
    // console.log('table', table)

    return (
      <div class="table-wrapper">
        {showAlert ? this.renderAlert() : null}
        {table}
      </div>
    );
  },
});
export type STableProps = {
  refresh: (bool?: boolean) => void;
  $el: HTMLElement;
};
export default STable;
