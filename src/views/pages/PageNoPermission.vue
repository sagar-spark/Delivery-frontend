 <template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center text-center">
        <CCol :md="6">
          <span class="clearfix">
            <CCardImage class="rounded-2 mb-4" style="width: 15rem" src="/images/general/captain-permission.jpeg" />
            <h1 class="display-3 p-4">Houston, we have a problem!</h1>
            <h4 class="pt-3 mt-4 mb-4">Appropriate permissions have not been provided!</h4>
            <p class="text-medium-emphasis mt-4">
              Grant asked permissions and reload this app again!
              <br><br>
              <CButton size="sm" color="primary" v-on:click="reloadPage()">Reload</CButton>
            </p>
          </span>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'PageNoPermission',
  methods: {
    reloadPage() {
        location.reload()
    }
  },
}
</script>
