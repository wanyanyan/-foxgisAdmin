require('material-design-lite/material.min.js')
require('material-design-lite/material.min.css')
require('material-design-icons/iconfont/material-icons.css')


import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import VueMdl from 'vue-mdl'
import Layout from './management/Layout'
import Dialog from './management/Dialog'
import UserManagement from './management/UserManagement'
import LoginManagement from './management/LoginManagement'
import AtlasDownload from './management/AtlasDownload'
import Management from './management/Management'

Vue.config.debug = true
Vue.use(Router)
Vue.use(VueMdl)
Vue.use(Resource)

Vue.component('foxgis-layout', Layout)
Vue.component('foxgis-dialog',Dialog)

let router = new Router({
  history: false
})

router.map({
  '/': {
    component: function (resolve) {
      require(['./management/LoginManagement.vue'], resolve)
    }
  },
  '/loginManagement': {
    component: function (resolve) {
      require(['./management/LoginManagement.vue'], resolve)
    }
  },
  '/management': {
    component: function (resolve) {
      require(['./management/Management.vue'], resolve)
    },
    subRoutes: {
      '/userManagement': {
        component: function (resolve) {
          require(['./management/UserManagement.vue'], resolve)
        }
      },
      '/atlasDownload': {
        component: function (resolve) {
          require(['./management/AtlasDownload.vue'], resolve)
        }
      }
    }
  },
})


router.start(App, '#app')
