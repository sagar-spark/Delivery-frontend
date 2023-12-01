<template>
  <CRow>
    <CCol :xs="12" class="mb-2">
      <h2>Users</h2>
    </CCol>
  </CRow>
  
  <span v-if="this.allUsers.length == 0">
    <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading...
  </span>
  <CRow v-if="this.allUsers.length > 0">
    <CCol :xs="12" class="mb-3">
      <CButton class="me-2" color="primary" size="sm" @click="() => { addUserModalView = true }">Add User</CButton>
    </CCol>
    <CCol :xs="6" :md="4" :lg="4" class="mb-3" v-for="user in this.allUsers">
      <CCard>
        <CCardBody>
          <CCardTitle>{{user.name}}</CCardTitle>
          <CCardText>
            <CBadge color="dark" shape="rounded-pill">{{this.userRoles[user.role]}}</CBadge>
          </CCardText>
        </CCardBody>
        <CListGroup flush>
          <CListGroupItem>
            <h6 class="mb-0">Email:</h6>
            <p class="text-medium-emphasis small mb-0">
              {{user.email}}
            </p>
          </CListGroupItem>
          <CListGroupItem>
            <h6 class="mb-0">Phone:</h6>
            <p class="text-medium-emphasis small mb-0">
              {{user.payload.phone}}
            </p>
          </CListGroupItem>
        </CListGroup>
      </CCard>
    </CCol>
  </CRow>

  <CModal
    size="lg"
    alignment="center"
    scrollable
    backdrop="static"
    :visible="addUserModalView"
    @close="this.clearAddUserModal()">

    <CModalHeader dismiss @close="this.clearAddUserModal()">
      <CModalTitle>Add new User</CModalTitle>
    </CModalHeader>

    <CModalBody>
      
      <CRow>
        <CCol :xs="12">
          
          <CForm class="row needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">
            <span>
              <CFormInput type="text" v-model="this.newUser.name" floatingLabel="User name" class="mb-3" placeholder="User name" required />
              <CFormInput type="email" v-model="this.newUser.email" floatingLabel="Email address" class="mb-3" placeholder="Email address" required />
              <CFormInput type="password" v-model="this.newUser.password" floatingLabel="Password" class="mb-3" placeholder="Password" required />
              <CFormInput type="text" v-model="this.newUser.payload.phone" floatingLabel="Phone" class="mb-3" placeholder="Phone number" required />
              <CFormFloating>
                <CFormSelect floatingLabel="User role" v-model.number="this.newUser.role" required>
                  <option value="">Choose role</option>
                  <option value="0">Delivery</option>
                  <option value="2">Manager</option>
                </CFormSelect> 
              </CFormFloating>
              <br>
              <CButton color="primary" size="sm" class="me-2" type="submit" :disabled="this.successAddUserMessage != null">Add User</CButton>
            </span>
          </CForm>

          <CAlert color="success" class="mb-2 mt-2" v-if="this.successAddUserMessage != null">
            {{this.successAddUserMessage}}
          </CAlert>

        </CCol>
      </CRow>

    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" size="sm" class="me-2" @click="this.clearAddUserModal()">Close</CButton>
    </CModalFooter>
  </CModal>


</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Orders",
  
  data: () => {
    return {

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorisation': vueCookies.get('accessToken')
      },


      // models
      validatedCustom01: null,
      userRoles: {
        "0" : "Delivery",
        //"1" : "User",
        "2" : "Manager",
        "3" : "Admin",
        "4" : "Super Admin",
        "5" : "Vendor",
      },
      allUsers: [],
      newUserTemplate: {
        name: null,
        email: null,
        password: null,
        role: null,
        payload: {
          phone: null,
        }
      },

      // modals
      addUserModalView: false,
      newUser: null,
      successAddUserMessage: null,
      
    }
  }, //end of Data

  methods: {

    handleSubmitCustom01(event) {

      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.addUser()
      }
      this.validatedCustom01 = true
    },

    getAllUsers() {

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: this.APIHOST + '/infra/usergetall',
        headers: this.headers
      }

      axios.request(config)
      .then(response => {
        console.log(response.data)
        this.allUsers = response.data.users
      })
      .catch(error => {
        this.pushToast("Error - All users", error.message, "danger")
        console.log(error)
      })
    },

    addUser() {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: this.APIHOST + '/infra/usersignup',
        headers: this.headers,
        data: this.newUser
      }

      axios.request(config)
      .then(response => {
        console.log(response.data)
        this.successAddUserMessage = "User added successfully"
        this.getAllUsers()
      })
      .catch(error => {
        this.pushToast("Error - Add user", error.message, "danger")
        console.log(error)
      })
    },

    clearAddUserModal() {
      this.successAddUserMessage = null
      this.newUser = this.newUserTemplate
      this.addUserModalView = false
    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getAllUsers()
    this.newUser = this.newUserTemplate
  }, // end created

}

</script>


<style scoped>

</style>