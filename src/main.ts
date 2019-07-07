import Vue from 'vue'
import App from '@/App.vue'
import router from './router'
import store from './store'
import Chat from 'vue-beautiful-chat'
import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Dialog,
  Checkbox,
  Select,
  Option,
  Tooltip,
  Row,
  Col,
  Divider,
  Message,
  Container,
  Aside,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Header,
  Main,
  Table,
  TableColumn,
  Tag,
} from 'element-ui'
import 'tachyons/css/tachyons.min.css'
import lang from 'element-ui/lib/locale/lang/pt-br'
import locale from 'element-ui/lib/locale'

// configure language
locale.use(lang)

Vue.config.productionTip = false

// Chat Component
Vue.use(Chat)

// Element UI Components
Vue.use(Button)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(Tag)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tooltip)
Vue.use(Row)
Vue.use(Col)
Vue.use(Divider)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Header)
Vue.use(Main)
Vue.prototype.$message = Message

// Init Vue
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
