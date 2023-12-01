<template>
  <CRow>
    <CCol :xs="12" class="mb-2">
      <h2>Delivery Manifest</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :xs="12">
  
      <span v-if="this.allOrders == null">
        <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading...
      </span>
      <CRow v-if="this.allOrders != null">
        <CCol :xs="12" class="mb-3">
          <span class="h3">{{this.allOrders.length}}</span>&nbsp;<span class="h5">delivery packages to be processed</span>
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
                  <CButton class="me-2" color="primary" size="sm" @click="this.openInMap(this.getMapsUrl(this.getAddressLine(order.pickLocation), this.getAddressLine(order.dropLocation)))">
                    <CIcon icon="cil-location-pin" size="sm" />
                  </CButton>
                  <span v-if="order.status == 'AGENT ASSIGNED' || order.status == 'NOT DELIVERED'">
                    <CButton class="me-2" color="primary" size="sm" @click="this.updateDeliveryStatus(order.id, 'OUT FOR DELIVERY')"><CIcon icon="cil-arrow-right" size="sm" />&nbsp;&nbsp;Delivery</CButton>  
                  </span>
                  <span v-if="order.status == 'OUT FOR DELIVERY'">
                    <CButton class="me-2" color="warning" size="sm" @click="this.showStatusModal(orderIndex)">Update status</CButton>
                  </span>
              </CListGroupItem>
            </CListGroup>
          </CCard>
        </CCol>
      </CRow>

    </CCol>
  </CRow>


  <!-- Modal for Update status -->
  <CModal
    alignment="center"
    backdrop="static"
    :visible="viewStatusModal"
    @close="this.clearStatusModal()">

    <CModalHeader dismiss @close="this.clearStatusModal()">
      <CModalTitle>Update status</CModalTitle>
    </CModalHeader>
    <CModalBody>
      
      <CRow>
        <CCol :xs="12">
          <CAlert color="info" class="text-center align-center">
            <p class="text-medium-emphasis small mb-0">Package</p>
            <span class="h4">
              {{this.selectedOrder.shipmentId}}
            </span>
          </CAlert>
        </CCol>
        <CCol :xs="6">
          <CAlert color="success" class="text-center align-center" @click="this.markDelivered(this.selectedOrder.id)">
            <span class="h4">Mark<br>Delivered</span>
          </CAlert>
        </CCol>
        <CCol :xs="6">
          <CAlert color="danger" class="text-center align-center" @click="() => { this.showUndeliveredReason = true }">
            <span class="h4">Not<br>Delivered</span>
          </CAlert>
        </CCol>
      </CRow>
      

      <CRow v-if="this.showUndeliveredReason">
        <CCol :xs="12">

          <span class="h5">Specify reason for non-delivery</span>
          <br><br>

          <CForm class="row needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

            <span v-if="this.unDeliveredReasons.length > 0">
              <CFormSelect size="lg" class="mb-3" v-model="this.unDeliveredReason.reason" required>
                <option value="">Choose reason</option>
                <option v-for="reason in this.unDeliveredReasons" :value=reason>{{reason}}</option>
              </CFormSelect>
              <CFormTextarea v-model="this.unDeliveredReason.remark" rows="2" placeholder="Add remark (mandatory if Other is selected)"></CFormTextarea>
              <br>
              <CButton color="primary" size="sm" @click="this.markNotDelivered(this.selectedOrder.id)">Mark Not Delivered</CButton>
            </span>
          </CForm>

        </CCol>
      </CRow>

    </CModalBody>
    <!-- <CModalFooter>
      <CButton color="secondary" size="sm" class="me-2" @click="this.clearStatusModal()">Close</CButton>
    </CModalFooter> -->
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
  name: "Delivery Manifest",
  
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

      // modals - undelivered
      viewStatusModal: false,
      selectedOrder: null,
      showUndeliveredReason: false,
      unDeliveredReason: {
        reason: null,
        desc: null,
      },

      // toasts
      toasts: [],

      unDeliveredReasons: [
        "Person unreachable",
        "Incorrect address",
        "Other",
      ],
      
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

      // this.allOrders = null

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: this.APIHOST + '/infra/getAllOrders?status=OUT FOR DELIVERY,AGENT ASSIGNED,NOT DELIVERED',
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

    showStatusModal(orderIndex) {
      this.selectedOrder = this.allOrders[orderIndex]
      this.viewStatusModal = true
    },

    clearStatusModal() {
      this.selectedOrder = null
      this.showUndeliveredReason = false
      this.viewStatusModal = false
    },

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

    updateDeliveryStatus(orderId, status) {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: this.APIHOST + '/infra/updateOrderStatus',
        headers: this.headers,
        data: {
          orderId: orderId,
          status: status,
        }
      }

      axios.request(config)
      .then(response => {
        console.log(response.data)
        this.pushToast("Message", 'Updated status ' + status + ' for package.', "success")
        this.getAllOrders()
      })
      .catch(error => {
        this.pushToast("Error - Update delivery status", error.message, "danger")
        console.log(error)
      })
    },

    markDelivered(orderId) {
      let response = confirm("Are you delivering this package on right location to right person?")
      if (response == true) {
        this.pushToast("Message", 'Package delivered', "success")
        this.updateDeliveryStatus(orderId, 'DELIVERED')
        this.clearStatusModal()
        this.getAllOrders()
      }
    },

    markNotDelivered(orderId) {
      if (this.unDeliveredReasons.includes(this.unDeliveredReason.reason) == false) {
        this.pushToast("Error", 'Choose reason', "danger")
      }
      else if (this.unDeliveredReason.reason == 'Other' && this.unDeliveredReason.desc == null) {
        this.pushToast("Error", 'Add remark for Other reason', "danger") 
      }
      else {
        let response = confirm("Are you sure you want to mark this package undelivered?")
        if (response == true) {
          this.pushToast("Message", 'Package marked not delivered', "success")
          this.updateDeliveryStatus(orderId, 'NOT DELIVERED')
          this.clearStatusModal()
          this.getAllOrders()
        }
      }
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