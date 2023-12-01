<template>
  <CRow>
    <CCol :xs="12" class="mb-2">
      <h2>Assign Delivery</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :xs="12">
  
      <span v-if="this.allOrders == null">
        <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading...
      </span>
      <CRow v-if="this.allOrders != null">
        <CCol :xs="12" class="mb-3">
          <span class="h3">{{this.allOrders.length}}</span>&nbsp;<span class="h5">delivery packages pending for delivery</span>
        </CCol>
        <CCol :xs="6" :md="4" :lg="4" class="mb-3" v-for="(order, orderIndex) in this.allOrders">
          <CCard>
            <CCardBody class="pb-0">
              <CCardTitle>{{order.shipmentId}}</CCardTitle>
              <CCardText>
                <CBadge color="dark" shape="rounded-pill" class="me-2 mb-2">{{order.status}}</CBadge>
              </CCardText>
            </CCardBody>
            <CListGroup flush>
              <CListGroupItem>
                <span class="h6">Delivery agent:</span>&nbsp;
                  <span v-if="order.currentUser == undefined">
                    <CBadge v-if="order.currentUser == undefined" color="danger" shape="rounded-pill">UNASSIGNED</CBadge>
                  </span>
                  <span v-else>
                    <CBadge v-if="order.currentUser != undefined" color="success" shape="rounded-pill">ASSIGNED</CBadge>&nbsp;&nbsp;<span class="text-medium-emphasis small">{{order.currentUser.name}}, {{order.currentUser.email}}</span>
                  </span>
              </CListGroupItem>
              <CListGroupItem>
                <span class="h6">Pick location:</span>&nbsp;<span class="text-medium-emphasis small">
                  {{this.getAddressLine(order.pickLocation)}}
                </span>
              </CListGroupItem>
              <CListGroupItem>
                <span class="h6">Drop location:</span>&nbsp;<span class="text-medium-emphasis small">
                  {{this.getAddressLine(order.dropLocation)}}
                </span>
              </CListGroupItem>
              <CListGroupItem class="py-3">
                <span v-if="order.currentUser == undefined">
                  <CButton class="me-2" color="primary" size="sm" @click="this.showAssignDeliveryModal(orderIndex)">Assign</CButton>
                </span>
                <span  v-if="order.currentUser != undefined">
                  <CButton class="me-2" color="primary" size="sm" @click="this.showAssignDeliveryModal(orderIndex)">Re-assign</CButton>
                </span>
                <CButton class="me-2" color="primary" size="sm" @click="this.openInMap(this.getMapsUrl(this.getAddressLine(order.pickLocation), this.getAddressLine(order.dropLocation)))"><CIcon icon="cil-location-pin" size="sm" /></CButton>
              </CListGroupItem>
            </CListGroup>
          </CCard>
        </CCol>
      </CRow>

    </CCol>
  </CRow>

  <!-- Modal for assign delivery agent -->
  <CModal
    alignment="center"
    backdrop="static"
    :visible="viewAssignDeliveryModal"
    @close="this.clearAssignDeliveryModal()">

    <CModalHeader dismiss @close="this.clearAssignDeliveryModal()">
      <CModalTitle>Assign Delivery agent</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CAlert color="info" class="mb-3">
        <CRow>
          <CCol :xs="12">
            <strong>Tracking</strong><br>
            <span class="text-medium-emphasis small">{{this.selectedOrder.shipmentId}}</span>
          </CCol>
          <CCol :xs="12">
            <strong>Drop location:</strong><br>
            <span class="text-medium-emphasis small">
              {{this.selectedOrder.dropLocation.street}}, {{this.selectedOrder.dropLocation.street2}}, {{this.selectedOrder.dropLocation.state}}, {{this.selectedOrder.dropLocation.country}}, {{this.selectedOrder.dropLocation.zip}}
            </span>
          </CCol>
          <CCol :xs="12">
            <strong>Pick location:</strong><br>
            <span class="text-medium-emphasis small">
              {{this.selectedOrder.pickLocation.street}}, {{this.selectedOrder.pickLocation.street2}}, {{this.selectedOrder.pickLocation.state}}, {{this.selectedOrder.pickLocation.country}}, {{this.selectedOrder.pickLocation.zip}}
            </span>
          </CCol>
        </CRow>
      </CAlert>

      <CRow>
        <CCol :xs="12">

          <CForm class="row needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

            <span v-if="this.allDeliveryUsers.length == 0">
              <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading list of Delivery agents...
            </span>
            <span v-if="this.allDeliveryUsers.length > 0">
              <CFormSelect size="lg" class="mb-3" v-model="this.selectedAgent" required>
                <option value="">Choose Delivery agent</option>
                <option v-for="user in this.allDeliveryUsers" :value=user.id>{{user.name}}, {{user.email}}</option>
              </CFormSelect>
              <CButton color="primary" size="sm" type="submit" :disabled="this.successAssignMessage != null">Assign</CButton>
            </span>
          </CForm>

          <CAlert color="success" class="mb-2 mt-2" v-if="this.successAssignMessage != null">
            {{this.successAssignMessage}}
          </CAlert>

        </CCol>
      </CRow>

    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" size="sm" class="me-2" @click="this.clearAssignDeliveryModal()">Close</CButton>
    </CModalFooter>
  </CModal>

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
import {validateSession} from '@/store/session'


export default {
  name: "Assign Delivery",
  
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
      allOrders: null,
      allUsers: [],
      allDeliveryUsers: [],

      // modals - assign delivery
      viewAssignDeliveryModal: false,
      selectedOrder: null,
      selectedAgent: null,
      successAssignMessage: null,

      // toasts
      toasts: [],
      
    }
  }, //end of Data

  methods: {

    handleSubmitCustom01(event) {

      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.assignDeliveryAgent()
      }
      this.validatedCustom01 = true
    },

    getAllOrders() {

      this.allOrders = null

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: this.APIHOST + '/infra/getAllOrders?status=CREATED,AGENT ASSIGNED',
        headers: this.headers
      }

      axios.request(config)
      .then(response => {
        console.log(response.data)
        this.allOrders = response.data.orders
      })
      .catch(error => {
        this.pushToast("Error - Package details", error.message, "danger")
        console.log(error)
      })
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

        // filter for delivery users
        if (this.allUsers.length > 0) {
          this.allDeliveryUsers = this.allUsers.filter(user => user.role == 0)
          // this.allDeliveryUsers = this.allUsers
        }
      })
      .catch(error => {
        this.pushToast("Error - User details", error.message, "danger")
        console.log(error)
      })
    },

    showAssignDeliveryModal(orderIndex) {
      this.getAllUsers()
      this.selectedOrder = this.allOrders[orderIndex]
      this.viewAssignDeliveryModal = true
    },

    clearAssignDeliveryModal() {
      this.selectedOrder = null
      this.viewAssignDeliveryModal = false
      this.allUsers = []
      this.selectedAgent = null
      this.successAssignMessage = null
    },

    assignDeliveryAgent() {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: this.APIHOST + '/infra/assignDeliveryAgentToOrder',
        headers: this.headers,
        data: {
          orderId: this.selectedOrder.id,
          userId: this.selectedAgent
        }
      }

      axios.request(config)
      .then(response => {
        console.log(response.data)
        this.successAssignMessage = "Agent assigned successfully"
        this.getAllOrders()

        // update delivery status
        // this.updateDeliveryStatus(this.selectedOrder.id, 'In-Transit')

      })
      .catch(error => {
        this.pushToast("Error - Assign Delivery Agent", error.message, "danger")
        console.log(error)
      })
    },

    // updateDeliveryStatus(orderId, status) {
    //   let config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: this.APIHOST + '/infra/updateOrderStatus',
    //     headers: this.headers,
    //     data: {
    //       orderId: orderId,
    //       status: status,
    //     }
    //   }

    //   axios.request(config)
    //   .then(response => {
    //     console.log(response.data)
    //     this.pushToast("Message", 'Updated status ' + status + ' for order.', "success")
    //     this.getAllOrders()
    //   })
    //   .catch(error => {
    //     this.pushToast("Error - Update delivery status", JSON.stringify(error), "danger")
    //     console.log(error)
    //   })
    // },

    getAddressLine(address) {
      return this.getKeyValue(address, "street") + this.getKeyValue(address, "street2") + this.getKeyValue(address, "city")+ this.getKeyValue(address, "state")+ this.getKeyValue(address, "country")+ this.getKeyValue(address, "zip")
    },

    getKeyValue(object, key) {
      if (object[key] != undefined) {
        return object[key] + ", "
      } else {
        return ''
      }
    },

    getMapsUrl(origin, destination) {
      let travelmode = "driving"

      // console.log("encd-origin: " + encodeURI(origin))
      // console.log("encd-destination: " + encodeURI(destination))

      let url = "https://www.google.com/maps/dir/?api=1&origin=" + encodeURI(origin) + "&destination=" + encodeURI(destination) + "&travelmode=" + travelmode
      
      // console.log("encd-url: " + url)

      return url
    },

    openInMap(url) {
      console.log(url)
      if (window.jsInterface !== undefined) {
          window.jsInterface.openInMap(url)
      } else {
        window.open(url, '_blank');
      }
    },

    pushToast(title, content, color) {
      this.toasts.push({
        title: title,
        content: content,
        color: color,
      })
    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getAllOrders()
  }, // end created

}

</script>


<style scoped>

</style>