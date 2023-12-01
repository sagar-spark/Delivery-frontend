<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center bg-pattern3-repeat">
    <CContainer>
      <CRow class="justify-content-center text-center text-align-center align-items-center">
        <CCol :xs="12" :xm="4" :xl="4">
          <CCard class="p-4 customcard-border-primary">
            <CCardBody>
              <CSpinner color="primary"/>
              <br><br>
              <span class="h6">
                Checking Single Sign-on credentials..
              </span>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Interstitial SSO',
  methods: {
    redirect_login() {
      this.$router.push('/pages/login')
    },
  }, // end methods

  created() {
    setTimeout(this.redirect_login, 5000)
  }, // end created
}
</script>
