<template>
  <div class="container">
    <slot></slot>
  </div>
</template>
<style scoped lang="less">
  .container {
    padding: 1px 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
</style>
<style lang="less">
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .arco-table-size-small .arco-table-td .arco-table-cell {
    padding: 2px 14px;
  }
  .arco-dropdown-open .arco-icon-down {
    transform: rotate(180deg);
  }
</style>
