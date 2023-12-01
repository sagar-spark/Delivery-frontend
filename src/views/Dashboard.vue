<template>
  <CRow class="mb-4">
    <CCol :md="12">
      <CCard style="max=width: 540px">
        <CRow class="g-0">
          <CCol :md="4">
            <CCardImage class="rounded-0" src="/images/general/new-setup.jpg" />
          </CCol>
          <CCol :md="8" class="p-1">
            <CCardBody>
              <CCardTitle class="h4">Welcome to ConnectCo+ Delivery</CCardTitle>
              <CCardText>Manage orders, shipments, delivery - all in one place!
              </CCardText>
            </CCardBody>
          </CCol>
        </CRow>
      </CCard>
    </CCol>
  </CRow>

  <CRow v-if="this.navMenu">
    <CCol :xs="6" :md="3" :lg="2" class="mb-4" v-for="menu in this.navMenu">
      <CCard class="text-white bg-primary py-1">
        <CCardBody class="text-center">
          <div>
            <CNavLink :href=this.getMenuLink(menu.to) active>
              <CIcon :icon=menu.icon size="xl" class="mb-2" />
              <br>
              {{menu.name}}
            </CNavLink>
          </div>
        </CCardBody>
      </CCard>
    </CCol>

  </CRow>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'
import {userRoles} from '@/store/roles'
import {default as _nav} from '@/_nav'

export default {
  name: 'Transport Portal',

  data: () => {
    return {

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },
      userRole: vueCookies.get('userRole').toString(),
      navMenu: null,
    }
  }, //end of Data

  methods: {

    getMenuLink(link) {
      return '/#'+link
    },

    loadToast() {
        if (window.jsInterface !== undefined) {
            window.jsInterface.showToastMessage('Toast message')
        } else {
          alert('This feature is only available on Mobile app')
        }
    },
    
  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    // this.navMenu = _nav
    console.log(this.userRole)
    this.navMenu = userRoles[this.userRole].navs
    console.log(this.navMenu)
  },
}
</script>
