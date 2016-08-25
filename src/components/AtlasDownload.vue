<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">layers</i><span>图集下载</span></h5>
  <div>
    <span>制图区域</span>
    <select>
      <option value="">请选择</option>
      <option value="{{location.location}}" v-for="location in locations">{{location.location}}</option>
    </select><br/>
    <span>制图时间</span>
    <select>
      <option value="">请选择</option>
      <option value="{{year.year}}" v-for="year in years">{{year.year}}</option>
    </select><br/>
    <span>上传单位</span>
    <select>
      <option value="">请选择</option>
      <option value="{{user.organization}}" v-for="user in userData">{{user.organization}}</option>
    </select><br/>
    <span>上传时间</span>
    <select>
      <option value="">请选择</option>
      <option value="{{year}}" v-for="year in updateYears">{{year}}</option>
    </select><br/>
    <mdl-anchor-button accent raised v-mdl-ripple-effect style="min-width: 88px;" @click="downloadAtlas">下载</mdl-anchor-button>
  </div>

</div>
</template>


<script>
import Cookies from 'js-cookie'
export default {
  methods: {
    downloadAtlas:function(){
      
    }
  },

  computed:{
  },

  attached() {
    let username = Cookies.get('super-username')
    if(username === undefined){
      return 
    }
    let access_token = Cookies.get('super-access_token')
    let url = SERVER_API.users;
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      let data = response.data;
      this.userData=data;
    }, function(response) {
      this.$broadcast("mailSent",{message:"用户信息获取失败",timeout:3000});
    });

    //获取制图区域统计信息
    var locationUrl = SERVER_API.stats+"/location";
    this.$http({ url: locationUrl, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        let data = response.data
        this.locations = data;
      }
    },function(response){

    });

    //获取制图年份统计信息
    var yearUrl = SERVER_API.stats+"/year";
    this.$http({ url: yearUrl, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        let data = response.data
        this.years = data;
      }
    },function(response){

    });
  },
  data() {
    return {
      userData:[],
      locations:[],
      years:[],
      updateYears:[2014,2015,2016,2017,2018,2019,2020]
    }
  },

  events:{
    "delete_tileset":function(msg){
      for(let i = 0;i<this.dataset.length;i++){
        if(this.dataset[i].tileset_id === msg){
          this.dataset.splice(i,1);
        }
      }
    }
  }
}
</script>


<style scoped>
.data {
  height: 100%;
  width: 83.3333%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

h5 {
  margin-top: 40px;
}

.material-icons {
  padding: 10px;
  margin-right: 5px;
  vertical-align: middle;
  border-radius: 50%;
  color: #FB8C00;
  background-color: #FFF;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
}

span {
  vertical-align: middle;
}

.search {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.foxgis-search {
  width: calc(100% - 100px);
}

.foxgis-search + .mdl-button {
  height: 40px;
}

.foxgis-data-cards {
  margin-top: 40px;
}

/* 进度条样式 */
.progress-bar{
  display: block;
  position: relative;
  height: 4px;
  width: calc(100% - 100px);
  max-width: 100%;
}

.progress-bar .bufferbar{
  z-index: 0;
  left: 0;
  background-color: #c2d6d4;
  width: 100%;
}
.progress-bar .activebar{
  z-index: 1;
  left: 0;
  width: 0;
  background-color: #009688;
}

.progress-bar .bar{
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    transition: width .2s cubic-bezier(.4,0,.2,1);
}
/* 上传文件按钮 */
#picker{
  width: 88px;
  height: 40px;
  position: relative;
  display: inline-block;
  line-height: 1.428571429;
  vertical-align: middle;
}
</style>
