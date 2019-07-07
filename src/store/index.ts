import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { ui } from './ui'

Vue.use(Vuex)

const store: StoreOptions<{}> = {
  modules: {
    ui,
  },
}

export default new Vuex.Store<{}>(store)
