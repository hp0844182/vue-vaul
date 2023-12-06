import Vue from 'vue'
import App from './App.vue'
import './src/style.css'
import './tailwind.css'

new Vue({
  render(h) {
    return h(App)
  },
}).$mount('#app')
