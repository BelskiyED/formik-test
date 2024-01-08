import { createApp } from 'vue'
import App from './App.vue'
import components from "@/components/UI"
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

components.forEach(component => {
    app.component(component.name, component)
});

app
    .use(ElementPlus)
    .use(store)
    .mount('#app')
