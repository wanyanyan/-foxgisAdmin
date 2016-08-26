<template>
<div>
  <foxgis-layout>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
    <div class="mdl-layout__drawer">
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" v-link="{ path: '/management/userManagement' }"><i class="material-icons">account_circle</i>用户管理<span  v-mdl-badge.number="user_nums" ></span></a>
        <a class="mdl-navigation__link" v-link="{ path: '/management/atlasDownload' }"><i class="material-icons">layers</i>图集管理</a>
      </nav>
      <div class="mdl-layout-spacer"></div>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" v-on:click.prevent="signout"><i class="material-icons">exit_to_app</i>注销</a>
      </nav>
    </div>
    <div class="mdl-layout__content">
      <router-view></router-view>
    </div>
  </div>
  </foxgis-layout>
</div>
</template>


<script>
import Cookies from 'js-cookie'

export default {
  methods: {
    signout: function(){
      Cookies.remove('super-username');
      Cookies.remove('super-access_token');
      Cookies.remove('super-name');
      Cookies.remove('super-phone');
      Cookies.remove('super-email');
      Cookies.remove('super-location');
      Cookies.remove('super-organization');
      window.location.href = '#!/loginManagement';
    }
  },
  ready() {
    /*global componentHandler */
    componentHandler.upgradeElement(this.$el.firstElementChild);
  },
  attached: function() {
     //判断是否登陆
    let username = Cookies.get('super-username');
    if(username === undefined){
      window.location.href = "#!/loginManagement";
    }else{
      this.username = username;
    }
  },
  data: function(){
    return {
      user_nums:0
    }
  },
  events: {
    "user_nums":function(msg) {
      this.user_nums= parseInt(msg);
    }
  }
}

</script>


<style scoped>
.mdl-layout {
  /*height: calc(100% - 100px);*/
}

/*.mdl-layout__content {
  height: calc(100% - 100px);
}*/

.mdl-layout--fixed-drawer>.mdl-layout__content {
  background-color: #e4e4e4;
  /*background-image: radial-gradient(50% 50%,circle cover,#ddd,#e1eab1 60%);*/
}

.mdl-navigation {
  border-top: 1px solid rgba(0,0,0,.1);
}

.mdl-navigation a {
  cursor: pointer;
}

.material-icons {
  padding-right: 10px;
}

.v-link-active {
  background-color: #e0e0e0;
}

.mdl-badge {
    position: absolute;
    white-space: nowrap;
    margin-right: 24px;
    right: 76px;
}

.mdl-badge:after {
  top: -3px!important;  
  right: -70px!important;
}

</style>

