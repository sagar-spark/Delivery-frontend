<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler
        :class="[
          'px-md-0',
          'me-md-3',
          'd-lg-none',
          { 'prevent-hide': !sidebarVisible },
        ]"
        @click="$store.commit('toggleSidebar')"
      >
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderBrand class="mx-auto d-md-none" to="/">
        <CIcon :icon="logoNegative" height="34" alt="Logo" />
      </CHeaderBrand>
      
      <CHeaderNav class="d-sm-flex ms-auto me-0">
          <CNavLink href="#"  v-on:click="logoutUser()">
            <CIcon class="mx-2" icon="cil-exit-to-app" size="lg" />
          </CNavLink>
        
      </CHeaderNav>

      <CHeaderToggler class="px-md-0 me-md-3">
        <CIcon
          icon="cil-applications-settings"
          size="lg"
          @click="$store.commit('toggleAside')"
        />
      </CHeaderToggler>
      
    </CContainer>
  </CHeader>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import AppHeaderDropdownMssgs from './AppHeaderDropdownMssgs'
import AppHeaderDropdownNotif from './AppHeaderDropdownNotif'
import AppHeaderDropdownTasks from './AppHeaderDropdownTasks'
import { logoNegative } from '@/assets/brand/logo-negative'
import { closeSession } from '@/store/session'

export default {
  name: 'AppHeader',
  components: {
    AppHeaderDropdownAccnt,
    AppHeaderDropdownMssgs,
    AppHeaderDropdownNotif,
    AppHeaderDropdownTasks,
  },
  setup() {
    const store = useStore()
    return {
      logoNegative,
      sidebarVisible: computed(() => store.state.sidebarVisible),
    }
  },
  methods: {
    logoutUser() {
      closeSession(this.$router)
    }
  }
}
</script>
