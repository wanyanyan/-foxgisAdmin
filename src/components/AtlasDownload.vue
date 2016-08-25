<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">layers</i><span>图集下载</span></h5>
  <div id="atlas-download">
    <div class="map-location">
      <span>制图区域</span>
      <select>
        <option value="">选择制图区域</option>
        <option value="{{location.location}}" v-for="location in locations">{{location.location}}</option>
      </select>
    </div>
    <div class="map-year">
      <span>制图时间</span>
      <select>
        <option value="">选择制图时间</option>
        <option value="{{year.year}}" v-for="year in years">{{year.year}}</option>
      </select>
    </div>
    <div class="user-orga">
      <span>上传单位</span>
      <select>
        <option value="">选择上传单位</option>
        <option value="{{user.username}},{{user.organization}}" v-for="user in userData">{{user.organization}}</option>
      </select>
    </div>
    <div class="upload-year">
      <span>上传时间</span>
      <select>
        <option value="">选择上传时间</option>
        <option value="{{year}}" v-for="year in uploadYears">{{year}}</option>
      </select>
    </div>
    
    <mdl-anchor-button accent raised v-mdl-ripple-effect style="min-width: 88px;" @click="downloadAtlas" id="btn-download">下载</mdl-anchor-button>

    <div>
      <span id="url-text" style="color:red"></span>
    </div>
  </div>

</div>
</template>


<script>
import Cookies from 'js-cookie'
export default {
  methods: {
    downloadAtlas:function(){
      let username = Cookies.get('super-username');
      let access_token = Cookies.get('super-access_token');
      let url = SERVER_API.uploads+"/"+username+"/"+"download?";
      var mapLocation = $(".map-location select").val();
      var mapYear = $(".map-year select").val();
      var organization =  $(".user-orga select").val();
      var upload =  $(".upload-year select").val();
      if(mapLocation===""&&mapYear===""&&organization===""&&upload===""){
        $("#url-text").text("请选择参数");
        return;
      }
      if(mapLocation){url = url+"&location="+mapLocation;}
      if(mapYear){url = url+"&year="+mapYear;}
      if(organization){url = url+"&user="+organization;}
      if(upload){url = url+"&createdAt="+upload;}
      url = url.replace("&","");
      url = url + "&access_token=" + access_token;
      if((/Trident\/7\./).test(navigator.userAgent)||(/Trident\/6\./).test(navigator.userAgent)){
      //IE10/IE11
        var aLink = document.createElement('a')
        aLink.className = 'download_link'
        var text = document.createTextNode('&nbsp;')
        aLink.appendChild(text)
        aLink.href = url
        aLink.click()
      }else{//Chrome,Firefox
        var iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style = "display:none";
        document.body.appendChild(iframe);
      }
    }
  },

  attached() {
    let username = Cookies.get('super-username')
    if(username === undefined){
      window.location.herf = "#!/loginManagement" 
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

    var currYear = new Date().getFullYear();
    var t = [];
    for(var i = 0;i<10;i++){
      t.push(currYear-i);
    }
    this.uploadYears = t;
  },
  data() {
    return {
      userData:[],
      locations:[],
      years:[],
      uploadYears:[]
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

#atlas-download div{
  margin-top: 5px;
  margin-bottom: 10px;
}

#atlas-download select{
  width: 150px;
}
</style>
