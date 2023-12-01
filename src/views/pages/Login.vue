<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center bg-pattern3-repeat">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :xs="12" :xm="4" :xl="4">

            <CCard class="p-4 customcard-border-primary">
              <CCardBody>
                <CForm
                  class="needs-validation"
                  novalidate
                  :validated="validatedCustom01"
                  @submit="handleSubmitCustom01"
                  @submit.prevent=";"
                >
                  <img class="d-block w-100 mb-2" :src="ccMainLogo" alt="ConnectCo main logo" />
                  <h2 class="mb-2">Transport Portal</h2>
                  

                  <div v-if="this.checkCredentialsSpin == true">
                    <p class="text-medium-emphasis mb-3">Checking credentials</p>
                    <CSpinner color="primary" size="sm" />
                  </div>

                  <div v-if="this.checkCredentialsSpin == false">
                    <p class="text-medium-emphasis mb-3">Enter credentials to continue</p>
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autocomplete="username"
                        v-model="username"
                        required
                      />
                    </CInputGroup>


                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autocomplete="current-password"
                        v-model="password"
                        required
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol :xs="6">
                        <CButton color="primary" class="px-4" type="submit"> Login </CButton>
                      </CCol>
                    </CRow>
                  </div>

                </CForm>
              </CCardBody>
            </CCard>
          
          
        </CCol>
      </CRow>
    </CContainer>
  </div>

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
  import vueRouter from 'vue-router'
  // import {storeUserRole} from '@/store/store_userrole'

  import ccMainLogo from '@/assets/images/connectco/logo_main_with_tagline.png'

  export default {
    name: 'Login',

    data: () => {

      return {

        // headerToken
        APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json; charset=utf-8',
        },

        // toasts
        toasts: [],

        // markers
        validatedCustom01: null,

        // data models
        username: null,
        password: null,
        userrole: null,

        //flags
        checkCredentialsSpin: true,


      } // end data return
    }, // end data


    methods: {

      preventSubmit() {
        console.log('Default submit prevented')
      },

      handleSubmitCustom01(event) {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        } else {
           this.userLogin()
        }
        this.validatedCustom01 = true
      },

      userLogin() {

        let params = JSON.stringify({
          email: this.username,
          password: this.password
        })

        let api_config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: this.APIHOST + '/infra/userlogin',
          headers: { 'Content-Type': 'application/json' },
          data: params
        }

        axios.request(api_config)
        .then(response => {
          if (response.status == 200) {
            // save in cookie
            // https://www.npmjs.com/package/vue-cookies
            this.checkCredentialsSpin = true
            console.log(response.data)
            // setTimeout(vueCookies.set('accessToken', response.data.access_token, '1d'), 500)
            // setTimeout(vueCookies.set('userRole', response.data.role, '1d'), 500)
            setTimeout(this.setCookies('accessToken', response.data.access_token, '1d'), 500)
            setTimeout(this.setCookies('userRole', response.data.role, '1d'), 500)

            // land to dashboard
            setTimeout(this.redirect_dashboard, 500)
            //this.$router.push('/dashboard')
          }
        })
        .catch(error => {
          this.pushToast(error.message, "Unauthorized / Incorrect username & password credentials", "danger")
          console.log(error)
        });

      }, // end user login

      redirect_dashboard() {
        this.$router.push('/dashboard')
      },

      setCookies(name, data) {
        vueCookies.set(name, data, '1d')
      },

      pushToast(title, content, color) {
        this.toasts.push({
          title: title,
          content: content,
          color: color,
        })
      },

    }, // end methods


    beforeCreate() {
      
    }, // end beforeCreate

    created() {
      let access_token = vueCookies.get('accessToken')
      // validate access token
      if (access_token != null || access_token != undefined) {
        //this.$router.push('/dashboard')
        // this.checkCredentialsSpin = true
        this.redirect_dashboard()
      } else {
        this.checkCredentialsSpin = false
      }
    }, // end created

    setup() {
      return {
        ccMainLogo
      }
    }, // end setup

  } // end export
</script>

