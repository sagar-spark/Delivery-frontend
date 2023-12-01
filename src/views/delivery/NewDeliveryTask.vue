<template>
  <CRow>
    <CCol :xs="12" class="mb-2">
      <h2>New Delivery Task</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :xs="12">
      <div v-if="this.newTaskView == false">
        <CButton class="me-2" color="primary" size="sm" @click="this.$router.push('/delivery-manifest')">All Deliveries</CButton>
        <CButton class="me-2" variant="outline" color="primary" size="sm" @click="() => {this.newTaskView = true; this.newTask = this.newTaskTemplate}">New Task</CButton>
      </div>

      <CCard v-if="this.newTaskView == true">
        <CCardBody class="mb-0 pb-0">
          <CCardTitle>Specify task details</CCardTitle>
        </CCardBody>
        <CListGroup flush>

          <!-- Pick location -->
          <CListGroupItem>
            <span class="h6">Pick-up location:</span>
            <br>
            <p class="text-medium-emphasis small mb-2" v-if="this.editPickLocation == false">
              {{this.getAddressLine(this.newTask.pickLocation)}}
            </p>
            <CRow v-if="this.editPickLocation == true" class="mt-2">
              <CCol :xs="12">
                <CFormInput type="text" v-model="this.newTask.pickLocation.street" floatingLabel="Address Line 1" class="mb-2" placeholder="Address Line 1" required />
              </CCol>
              <CCol :xs="12">
                <CFormInput type="text" v-model="this.newTask.pickLocation.street2" floatingLabel="Address Line 2" class="mb-2" placeholder="Address Line 2" required />
              </CCol>
              <CCol :xs="6">
                <CFormInput type="text" v-model="this.newTask.pickLocation.city" floatingLabel="City" class="mb-2" placeholder="City" required />
              </CCol>
              <CCol :xs="6">
                <CFormInput type="text" v-model="this.newTask.pickLocation.state" floatingLabel="State" class="mb-2" placeholder="State" required />
              </CCol>
              <CCol :xs="6">
                <CFormInput type="text" v-model="this.newTask.pickLocation.country" floatingLabel="Country" class="mb-2" placeholder="Country" required />
              </CCol>
              <CCol :xs="6">
                <CFormInput type="text" v-model="this.newTask.pickLocation.zip" floatingLabel="Zip" class="mb-2" placeholder="Zip" required />
              </CCol>
            </CRow>
            <CButton class="mb-2" color="warning" size="sm" @click="() => {this.editPickLocation = !this.editPickLocation}">
              <CIcon icon="cil-pencil" size="sm" />&nbsp;&nbsp;
              <span v-if="this.editPickLocation == false">Edit</span>
              <span v-if="this.editPickLocation == true">Save</span>
            </CButton>
          </CListGroupItem>


          <!-- Drop location -->
          <CListGroupItem>
            <span class="h6">Drop location:</span>
            <br>
            <p class="text-medium-emphasis small mb-2" v-if="this.editDropLocation == false">
              {{this.getAddressLine(this.newTask.dropLocation)}}
            </p>
            <CRow v-if="this.editDropLocation == true" class="mt-2">
              <CCol :xs="12">
                <CFormInput type="text" v-model="this.newTask.dropLocation.street" floatingLabel="Address Line 1" class="mb-2" placeholder="Address Line 1" required />
              </CCol>
              <CCol :xs="12">
                <CFormInput type="text" v-model="this.newTask.dropLocation.street2" floatingLabel="Address Line 2" class="mb-2" placeholder="Address Line 2" required />
              </CCol>
              <CCol :xs="6">
                <CFormInput type="text" v-model="this.newTask.dropLocation.city" floatingLabel="City" class="mb-2" placeholder="City" required />
              </CCol>
              <CCol :xs="6">
                <CFormInput type="text" v-model="this.newTask.dropLocation.state" floatingLabel="State" class="mb-2" placeholder="State" required />
              </CCol>
              <CCol :xs="6">
                <CFormInput type="text" v-model="this.newTask.dropLocation.country" floatingLabel="Country" class="mb-2" placeholder="Country" required />
              </CCol>
              <CCol :xs="6">
                <CFormInput type="text" v-model="this.newTask.dropLocation.zip" floatingLabel="Zip" class="mb-2" placeholder="Zip" required />
              </CCol>
            </CRow>
            <CButton class="mb-2" color="warning" size="sm" @click="() => {this.editDropLocation = !this.editDropLocation}">
              <CIcon icon="cil-pencil" size="sm" />&nbsp;&nbsp;
              <span v-if="this.editDropLocation == false">Edit</span>
              <span v-if="this.editDropLocation == true">Save</span>
            </CButton>
          </CListGroupItem>


          <!-- Receiver details -->
          <CListGroupItem>
            <span class="h6">Receiver details:</span>
            <br>
            <p class="text-medium-emphasis small mb-2" v-if="this.editReceiverDetails == false">
              {{this.getKeyValue(this.newTask.receiverDetails, "name")}}
              {{this.getKeyValue(this.newTask.receiverDetails, "email")}}
              {{this.getKeyValue(this.newTask.receiverDetails, "phone")}}
            </p>
            <CRow v-if="this.editReceiverDetails == true" class="mt-2">
              <CCol :xs="12">
                <CFormInput type="text" v-model="this.newTask.receiverDetails.name" floatingLabel="Name" class="mb-2" placeholder="Name" required />
              </CCol>
              <CCol :xs="6">
                <CFormInput type="email" v-model="this.newTask.receiverDetails.email" floatingLabel="Email address" class="mb-2" placeholder="Email address" required />
              </CCol>
              <CCol :xs="6">
                <CFormInput type="text" v-model="this.newTask.receiverDetails.phone" floatingLabel="Phone number" class="mb-2" placeholder="Phone number" required />
              </CCol>
            </CRow>
            <CButton class="mb-2" color="warning" size="sm" @click="() => {this.editReceiverDetails = !this.editReceiverDetails}">
              <CIcon icon="cil-pencil" size="sm" />&nbsp;&nbsp;
              <span v-if="this.editReceiverDetails == false">Edit</span>
              <span v-if="this.editReceiverDetails == true">Save</span>
            </CButton>
          </CListGroupItem>


          <!-- Choose vendor if not Vendor user -->
          <CListGroupItem v-if="this.userRole != 5">
            <span class="h6">Vendor details:</span>
            <br>
            <CRow class="mt-2">
              <CCol :xs="12">
                <CFormSelect class="mb-2" v-model="this.newTask.vendorId" required>
                  <option value="">Choose Vendor</option>
                  <option v-for="vendor in this.allVendors" :value=vendor.id>
                    {{vendor.vendorDetails.name}}
                  </option>
                </CFormSelect>
              </CCol>
            </CRow>
          </CListGroupItem>


          <!-- Create Job -->
          <CListGroupItem>
            <CButton class="me-2 mt-2 mb-2" color="primary" size="sm" @click="this.addTask()">Add Task</CButton>
            <CButton class="me-2 mt-2 mb-2" variant="outline" color="info" size="sm" @click="() => { this.newTask = this.newTaskTemplate}">Clear Details</CButton>
            <CButton class="me-2 mt-2 mb-2" variant="outline" color="info" size="sm" @click="() => { this.newTask = this.newTaskSample}">Sample fill</CButton>
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
import {validateSession, decodePayload} from '@/store/session'


export default {
  name: "New Delivery Task",
  
  data: () => {
    return {

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorisation': vueCookies.get('accessToken')
      },
      userRole: vueCookies.get('userRole').toString(),
      USER_PAYLOAD: null,

      // toasts
      toasts: [],

      // models
      validatedCustom01: null,
      allVendors: null,
      newTaskView: true,
      newTask: null,
      newTaskTemplate: {
        pickLocation: {
          street: null,
          street2: null,
          city: null,
          state: null,
          country: null,
          zip: null
        },
        dropLocation: {
          street: null,
          street2: null,
          city: null,
          state: null,
          country: null,
          zip: null
        },
        receiverDetails: {
          name: null,
          email: null,
          phone: null,
        },
        receiverKey: null,
        vendorId: null
      },
      newTaskSample: {
        pickLocation: {
          street: "Bren Imperia",
          street2: "15 Main",
          city: "Bangalore",
          state: "Karnataka",
          country: "India",
          zip: "560103"
        },
        dropLocation: {
          street: "Saroj Dynasty",
          street2: "Doddakannelli",
          city: "Bangalore",
          state: "Karnataka",
          country: "India",
          zip: "560035"
        },
        receiverDetails: {
          name: "Chandra Prakash",
          email: "cp@the-rita.com",
          phone: "+987654567"
        },
        receiverKey: "cp@the-rita.com",
        vendorId: 5
      },

      //edit modes
      editPickLocation: false,
      editDropLocation: false,
      editReceiverDetails: false,
      
    }
  }, //end of Data

  methods: {

    handleSubmitCustom01(event) {

      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.addTask()
      }
      this.validatedCustom01 = true
    },

    pushToast(title, content, color) {
      this.toasts.push({
        title: title,
        content: content,
        color: color,
      })
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

    getAllVendors() {

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: this.APIHOST + '/infra/vendorgetall',
        headers: this.headers
      }

      axios.request(config)
      .then(response => {
        console.log(response.data)
        this.allVendors = response.data.vendors
      })
      .catch(error => {
        this.pushToast("Error - Vendor details", error.message, "danger")
        console.log(error)
      })
    },

    addTask() {

      // add remaining payload
      if (this.userRole == 5) {
        this.newTask.vendorId = this.USER_PAYLOAD.user.vendorId  
      }
      this.newTask.receiverKey = "somekey"
      console.log(this.newTask)

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: this.APIHOST + '/infra/createOrder',
        headers: this.headers,
        data: this.newTask
      }

      axios.request(config)
      .then(response => {
        console.log(response.data)
        this.pushToast("Success", "New Delivery Task created", "success")
        this.newTaskView = false
      })
      .catch(error => {
        this.pushToast("Error", error.message, "danger")
        console.log(error)
      })
    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.USER_PAYLOAD = decodePayload(vueCookies.get('accessToken'))
    this.newTask = this.newTaskTemplate
    if (this.userRole != 5) {
      this.getAllVendors()
    }
  }, // end created

}

</script>


<style scoped>

</style>