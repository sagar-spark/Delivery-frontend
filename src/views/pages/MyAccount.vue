<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>My Account</h2>
    </CCol>
  </CRow>

  <CRow v-if="this.USER_PAYLOAD != undefined">
    <CCol :xs="12">
      <CCard>
        <CCardBody class="pb-0">
          <CCardTitle>Account details</CCardTitle>
        </CCardBody>
        <CListGroup flush>
          <CListGroupItem>
            <span class="h6">Name:</span><br>
            <span class="text-medium-emphasis small">{{this.USER_PAYLOAD.user.name}}</span>
          </CListGroupItem>
          <CListGroupItem>
            <span class="h6">Email:</span><br>
            <span class="text-medium-emphasis small">{{this.USER_PAYLOAD.user.email}}</span>
          </CListGroupItem>
          <CListGroupItem>
            <span class="h6">Phone:</span><br>
            <span class="text-medium-emphasis small">{{this.USER_PAYLOAD.user.payload.phone}}</span>
          </CListGroupItem>
          <CListGroupItem>
            <span class="h6">Role:</span><br>
            <span class="text-medium-emphasis small">{{userRoles[this.userRole].name}}</span>
          </CListGroupItem>
          <CListGroupItem>
            <CButton class="mb-2 mt-2" color="warning" size="sm" @click="this.logoutUser()">Logout from this device</CButton>
          </CListGroupItem>
        </CListGroup>
      </CCard>
    </CCol>

  </CRow>

  <!-- toast for alerts -->
  <CToaster placement="bottom-center" visible>
    <CToast v-for="(toast, index) in toasts">
      <CToastHeader closeButton style="background-color: rgba(0,0,0,100);">
      <span class="me-auto fw-bold">{{toast.title}}</span>
      <!-- <small>7 min ago</small> -->
      </CToastHeader>
      <CToastBody style="background-color: rgba(255,255,255,100);">
        {{ toast.content }}
      </CToastBody>  
    </CToast>
  </CToaster>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession, decodePayload, closeSession} from '@/store/session'
import {userRoles} from '@/store/roles'
import {default as _nav} from '@/_nav'

export default {
  name: 'My Account',

  data: () => {
    return {

      // headerToken
      toasts: [],
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },
      userRole: vueCookies.get('userRole'),
      USER_PAYLOAD: null,
      userRoles: null,
    }
  }, //end of Data

  methods: {
    pushToast(title, content, color) {
      this.toasts.push({
        title: title,
        content: content,
        color: color,
      })
    },

    logoutUser() {
      this.pushToast("Logged out", "You've been logged out of this device", "warning")
      closeSession(this.$router)
    }
  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.USER_PAYLOAD = decodePayload(vueCookies.get('accessToken'))
    // console.log(this.USER_PAYLOAD)
    this.userRoles = userRoles
    // console.log(this.userRoles)
  },
}
</script>
