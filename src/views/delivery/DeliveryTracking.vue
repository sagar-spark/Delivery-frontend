 <template>
  <CRow>
    <CCol :xs="12" class="mb-2">
      <h2>Delivery Tracking</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :xs="12">
  
      <span v-if="this.allOrders == null">
        <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading...
      </span>

      <CRow v-if="this.allOrders != null">
        <CCol :xs="12">
          <span class="h3">{{this.allOrders.length}}</span>&nbsp;<span class="h5">delivery packages</span>
          <br>
          <CCard class="mt-3">
            <CCardBody>
              
              <CSmartTable
                header
                :items-per-page="20"
                items-per-page-select
                :columns="this.ordersTableColumns"
                :items="this.allOrders"
                pagination
                columnSorter
                :table-props="{
                  hover: true,
                }"
                v-if="this.allOrders.length > 0"
              >
                <template #shipmentId="{ item }">
                  <td>
                    {{item.shipmentId}}<br>
                    <span class="text-medium-emphasis small">{{item.statusHistory[0].datetime}}</span>
                  </td>
                </template>
                <template #status="{ item }">
                  <td>
                    <CBadge :color=this.getDeliveryStatusBadgecolor(item.status) shape="rounded-pill">{{item.status}}</CBadge>
                  </td>
                </template>
                <template #actions="{ item }">
                  <td>
                    <CButton color="secondary" size="sm" @click="this.showTrackingInfo(item)">
                      <CIcon icon="cil-walk" />&nbsp;Track
                    </CButton>
                  </td>
                </template>
              </CSmartTable>

            </CCardBody>
          </CCard>

        </CCol>
      </CRow>

    </CCol>
  </CRow>

  <!-- Modal for assign delivery agent -->
  <CModal
    alignment="center"
    backdrop="static"
    :visible="viewTrackingInfoModal"
    @close="this.clearTrackingInfo()">

    <CModalHeader dismiss @close="this.clearTrackingInfo()">
      <CModalTitle>Delivery tracking details</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol :xs="12">
          <CAlert color="info" class="text-center align-center">
            <p class="text-medium-emphasis small mb-0">Package</p>
            <span class="h4">{{this.selectedOrder.shipmentId}}</span>
            <br>
            <span class="h6">{{this.selectedOrder.status}}</span>
          </CAlert>
        </CCol>
        <CCol :xs="12">
          <CListGroup flush>
            <CListGroupItem>
              <span class="h6">Pick location:</span><br><span class="text-medium-emphasis small">
                {{this.getAddressLine(this.selectedOrder.pickLocation)}}
              </span>
            </CListGroupItem>
            <CListGroupItem>
              <span class="h6">Drop location:</span><br><span class="text-medium-emphasis small">
                {{this.getAddressLine(this.selectedOrder.dropLocation)}}
              </span>
            </CListGroupItem>
            <CListGroupItem>
              <span class="h6">Tracking history:</span><br>
              <CListGroup class="mt-2">
                <CListGroupItem v-for="history in this.selectedOrder.statusHistory">
                  {{history.datetime}}&nbsp;&nbsp;&nbsp;
                  <CBadge :color=this.getDeliveryStatusBadgecolor(history.status) shape="rounded-pill">{{history.status}}</CBadge>
                </CListGroupItem>
              </CListGroup>

            </CListGroupItem>
          </CListGroup>
        </CCol>
      </CRow>

    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" size="sm" class="me-2" @click="this.clearTrackingInfo()">Close</CButton>
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
import {getDeliveryStatusBadgecolor} from '@/store/commonutils'


export default {
  name: "Delivery Tracking",
  
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
      allOrders: null,
      ordersTableColumns: [
        {
          key: 'shipmentId',
          label: 'Shipment/Date',
        },
        {
          key: 'status',
          label: 'Status',
        },
        {
          key: 'actions',
          label: '',
        },
      ],

      // modals - tracking info
      viewTrackingInfoModal: false,
      selectedOrder: null,

      // toasts
      toasts: [],
      
    }
  }, //end of Data

  methods: {

    getAllOrders() {

      this.allOrders = null

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: this.APIHOST + '/infra/getAllOrders',
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

    showTrackingInfo(orderData) {
      this.selectedOrder = orderData
      this.viewTrackingInfoModal = true
    },

    clearTrackingInfo() {
      this.selectedOrder = null
      this.viewTrackingInfoModal = false
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

    pushToast(title, content, color) {
      this.toasts.push({
        title: title,
        content: content,
        color: color,
      })
    },

    getDeliveryStatusBadgecolor(status) {
      switch (status) {
        case 'CREATED': return 'warning'
        case 'DELIVERY AGENT ASSIGNED': return 'dark'
        case 'AGENT ASSIGNED': return 'dark'
        case 'OUT FOR DELIVERY': return 'info'
        case 'DELIVERED': return 'success'
        case 'NOT DELIVERED': return 'danger'
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