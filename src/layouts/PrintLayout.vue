 <template>
  <CContainer lg>
    <router-view />
  </CContainer>
</template>
<script>
import { CContainer } from '@coreui/vue-pro'

export default {
  name: 'PrintLayout',
  components: {
    CContainer,
  },
}
</script>
