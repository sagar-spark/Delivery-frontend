<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" :caret="false">
      <span class="d-inline-block my-1 mx-2 position-relative">
        <CIcon icon="cil-list" size="lg" />
        <CBadge
          color="danger"
          position="top-end"
          shape="rounded-circle"
          class="p-1"
        >
          <span class="visually-hidden">{{ itemsCount }} new alerts</span>
        </CBadge>
      </span>
    </CDropdownToggle>
    <CDropdownMenu class="py-0">
      <CDropdownHeader
        class="dropdown-header bg-light dark:bg-white dark:bg-opacity-10"
      >
        <strong>You have {{ itemsCount }} pending tasks</strong>
      </CDropdownHeader>
      <CDropdownItem class="d-block">
        <div class="small mb-1">
          Upgrade NPM &amp; Bower
          <span class="float-right"><strong>0%</strong></span>
        </div>
        <CProgress thin color="info-gradient" />
      </CDropdownItem>
      <CDropdownItem class="d-block">
        <div class="small mb-1">
          ReactJS Version <span class="float-right"><strong>25%</strong></span>
        </div>
        <CProgress thin color="danger-gradient" :value="25" />
      </CDropdownItem>
      <CDropdownItem class="d-block">
        <div class="small mb-1">
          VueJS Version <span class="float-right"><strong>50%</strong></span>
        </div>
        <CProgress thin color="warning-gradient" :value="50" />
      </CDropdownItem>
      <CDropdownItem class="d-block">
        <div class="small mb-1">
          Add new layouts <span class="float-right"><strong>75%</strong></span>
        </div>
        <CProgress thin color="info-gradient" :value="75" />
      </CDropdownItem>
      <CDropdownItem class="d-block">
        <div class="small mb-1">
          Angular 2 Cli Version
          <span class="float-right"><strong>100%</strong></span>
        </div>
        <CProgress thin color="success-gradient" :value="100" />
      </CDropdownItem>
      <div class="p-2">
        <CButton color="primary" variant="outline" class="w-100">
          View all tasks
        </CButton>
      </div>
    </CDropdownMenu>
  </CDropdown>
</template>
<script>
export default {
  name: 'TheHeaderDropdownTasks',
  data() {
    return { itemsCount: 15 }
  },
}
</script>
