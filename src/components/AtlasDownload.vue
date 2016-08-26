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
      </select><span style="font-size:12px;">且</span>
    </div>
    <div class="map-year">
      <span>制图时间</span>
      <select>
        <option value="">选择制图时间</option>
        <option value="{{year.year}}" v-for="year in years">{{year.year}}</option>
      </select><span style="font-size:12px;">且</span>
    </div>
    <div class="user-orga">
      <span>上传单位</span>
      <select>
        <option value="">选择上传单位</option>
        <option value="{{user.username}},{{user.organization}}" v-for="user in userData">{{user.organization}}</option>
      </select><span style="font-size:12px;">且</span>
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

  <h5><i class="material-icons">layers</i><span>图集清理</span></h5>
  <div id="atlas-delete">
    <mdl-anchor-button accent raised v-mdl-ripple-effect style="min-width: 88px;float: left;" @click="deleteAtlas" id="btn-delete">删除</mdl-anchor-button>
    <div class="delete_owner">
      <span>上传者</span>
      <select id="delete_owner" @change="selectOwner">
        <option value="">选择上传者</option>
        <option value="{{u}}" v-for="u in owners">{{u}}</option>
      </select><span style="font-size:12px;"></span>
    </div>
    <mdl-anchor-button primary raised v-mdl-ripple-effect style="right: 200px;position: absolute;" @click="selectAll" id="select-all">全选</mdl-anchor-button>
    <mdl-anchor-button primary raised v-mdl-ripple-effect style="right: 100px;position: absolute;" @click="inverseSelect">反选</mdl-anchor-button>
    
    <div id="atlas-items">
      <table>
        <tr>
          <th style="width:16%;">图名</th>
          <th style="width:8%;">上传者</th>
          <th style="width:10%;">上传时间</th>
          <th style="width:10%;">删除时间</th>
          <th style="width:7%;">制图区域</th>
          <th style="width:6%;">制图年份</th>
          <th style="width:3%;">格式</th>
          <th style="width:7%;">图幅大小</th>
          <th style="width:3%;text-align:center;">选择</th>
        </tr>
        <tr v-for="u in displayUploads">
          <td title="{{u.name}}">{{u.name}}</td>
          <td title="{{u.owner}}">{{u.owner}}</td>
          <td title="{{u.createdAt}}">{{u.createdAt}}</td>
          <td title="{{u.updatedAt}}">{{u.updatedAt}}</td>
          <td title="{{u.location}}">{{u.location}}</td>
          <td title="{{u.year}}">{{u.year}}</td>
          <td title="{{u.format}}">{{u.format}}</td>
          <td title="{{u.dimensions}}">{{u.dimensions}}</td>
          <td style= "cursor:pointer;width: 30px;">
            <input type="checkbox" name="select-map" value="{{u.upload_id}}" @click="selectOne(u.upload_id)" style="width:15px;height:15px;">
          </td>
        </tr>
      </table>
    </div>
  </div>
</div>

<foxgis-dialog id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog>
</template>


<script>
import Cookies from 'js-cookie'
import _ from 'lodash'
import util from '../components/util.js'
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
    },

    selectOne:function(upload_id){//单选
      for(let i = 0;i<this.displayUploads.length;i++){
        if(this.displayUploads[i].upload_id === upload_id){
          if(this.displayUploads[i].checked==true){
            this.displayUploads[i].checked=false;
            $("[name='select-map']")[i].checked = false;
          }else{
            this.displayUploads[i].checked=true;
            $("[name='select-map']")[i].checked = true;
          }
          break;
        }
        
      }
    },

    selectAll:function(){//全选
      for(let i = 0;i<this.displayUploads.length;i++){
        this.displayUploads[i].checked=true;
        $("[name='select-map']")[i].checked = true;
      }
    },

    inverseSelect:function(){//反选
      for(let i = 0;i<this.displayUploads.length;i++){
        if(this.displayUploads[i].checked==true){
          this.displayUploads[i].checked=false;
          $("[name='select-map']")[i].checked = false;
        }else{
          this.displayUploads[i].checked=true;
          $("[name='select-map']")[i].checked = true;
        }
      }
    },

    deleteAtlas:function(){
      let t = 0;
      let deleteIds = [];
      for(var i = 0;i<this.displayUploads.length;i++){
        if(this.displayUploads[i].checked === true){
          deleteIds.push(this.displayUploads[i].upload_id);
          t++;
        }
      }
      if(t===0){
        this.$broadcast("mailSent",{message:"未选择任何选项！",timeout:3000});
      }else{
        this.dialogcontent.title = "确定删除吗？";
        document.getElementById('delete-dialog').style.display = 'block';
        this.deleteUploadId = deleteIds;
      }
    },

    deleteAction: function(status) {
      if (status === 'ok') {
        let length = this.displayUploads.length;
        var username = Cookies.get('super-username');
        var access_token = Cookies.get('super-access_token');
        for(let i=0;i<this.deleteUploadId.length;i++){
          let upload_id = this.deleteUploadId[i];
          let url = SERVER_API.uploads + '/' + username + "?upload_id=" + upload_id;
          this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
          .then(function(response){
          if(response.ok){
            for(let i = 0;i<this.uploads.length;i++){
              if(this.uploads[i].upload_id === upload_id){
                this.uploads.splice(i,1);
              }
            }
          }
          }, function(response) {
            alert('未知错误，请稍后再试');
          });
        }
        if(length === this.deleteUploadId.length){
          for(let j = 0;j<this.owners.length;j++){
            if(this.owners[j] === this.select_owner){
              this.owners.splice(j,1);
              break;
            }
          }
          $("#delete_owner option[value='']").attr("selected",true);
          this.select_owner = "";
        }else{
          $("#delete_owner option[value='"+this.select_owner+"']").attr("selected",true);
        }
        this.deleteUploadId = [];//重置deleteUploadId
      }
    },

    selectOwner:function(){//选择上传者
      this.select_owner = "";
      let owner = $(".delete_owner select").val();
      if(owner){
        this.select_owner = owner;
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

    let delete_url = SERVER_API.uploads + '?limit=99999&sort=-updatedAt&is_deleted=true';
    let that = this;
    //获取被删除的图集数据列表
    this.$http({ url: delete_url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        let data = response.data;
        data = data.map(function(d) {
          if (d.size / 1024 > 1024) {
            d.size = (d.size / 1048576).toFixed(2) + 'MB';
          } else {
            d.size = (d.size / 1024).toFixed(2) + 'KB';
          }
          d.createdAt = util.dateFormat(new Date(d.createdAt));
          d.updatedAt = util.dateFormat(new Date(d.updatedAt));
          return d;
        })
        this.uploads = data;
        for(let i=0;i<this.uploads.length;i++){
          this.owners.push(this.uploads[i].owner);
          this.uploads[i].checked = false;//增加checked属性，标记卡片是否被选中
          if(!this.uploads[i].location){
            this.uploads[i].location = "未指定";
          }
          if(!this.uploads[i].year){
            this.uploads[i].year = "未指定";
          }
        }
        this.owners = _.uniq(this.owners);
      }
    }, function(response) {
      this.$broadcast("mailSent",{message:"被删除的图集数据列表获取失败",timeout:3000});
    });
  },

  computed: {
    displayUploads: function(){
      let temp = [];
      let tempUploads = this.uploads;
      for(let i=0;i<tempUploads.length;i++){
        if(tempUploads[i].owner === this.select_owner){
          temp.push(tempUploads[i]);
        }
      }
      if(temp.length===0){
        temp=this.uploads;
      }
      return temp;
    }
  },

  data() {
    return {
      userData:[],
      locations:[],
      years:[],
      uploadYears:[],
      uploads:[],
      owners:[],
      select_owner:"",
      deleteUploadId:[],
      dialogcontent: {
        title: '',//对话框标题
        tips:'',//对话框中的提示性文字
        textCancel:'取消',
        textOk:'删除'
      },

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

#atlas-items {
  margin-top:10px; 
  margin-bottom: 100px;
  overflow: auto;
  max-height: 600px;
  float: left;
}
#atlas-items table {
  width: calc(100% - 5px);
  font-family: verdana,arial,sans-serif;
  font-size:11px;
  color:#333333;
  border-width: 1px;
  border-color: #666666;
  border-collapse: collapse;
  table-layout: fixed;
}
#atlas-items table th {
  border: 1px solid #666666;
  padding: 5px 1px 5px 1px;
  background-color: #dedede;
}
#atlas-items table td {
  border: 1px solid #666666;
  padding: 5px 2px 5px 2px;
  background-color: #ffffff;
  word-break:keep-all;/* 不换行 */
  white-space:nowrap;/* 不换行 */
  overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
#delete-dialog{
  display: none;
}
.delete_owner{
  text-align: center;
  width: 200px;
  float: left;
  position: relative;
  top: 7px;
}
</style>
