require('material-design-lite/material.min.js')
require('material-design-lite/material.min.css')
require('material-design-icons/iconfont/material-icons.css')


import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import VueMdl from 'vue-mdl'
import App from './components/App'
import Card from './components/Card'
import Layout from './components/Layout'
import Dialog from './components/Dialog'
import UserManagement from './components/UserManagement'
import LoginManagement from './components/LoginManagement'
import AtlasDownload from './components/AtlasDownload'
import Management from './components/Management'

Vue.config.debug = true
Vue.use(Router)
Vue.use(VueMdl)
Vue.use(Resource)

Vue.component('foxgis-layout', Layout)
Vue.component('foxgis-dialog',Dialog)
Vue.component('foxgis-card', Card)

let router = new Router({
  history: false
})

router.map({
  '/': {
    component: function (resolve) {
      require(['./components/LoginManagement.vue'], resolve)
    }
  },
  '/loginManagement': {
    component: function (resolve) {
      require(['./components/LoginManagement.vue'], resolve)
    }
  },
  '/management': {
    component: function (resolve) {
      require(['./components/Management.vue'], resolve)
    },
    subRoutes: {
      '/userManagement': {
        component: function (resolve) {
          require(['./components/UserManagement.vue'], resolve)
        }
      },
      '/atlasDownload': {
        component: function (resolve) {
          require(['./components/AtlasDownload.vue'], resolve)
        }
      }
    }
  },
})


router.start(App, '#app')
