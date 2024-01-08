import { createStore } from 'vuex'
import { formModule } from '@/store/formModule'

export default createStore({
 modules: {
  form: formModule,
 }
})
