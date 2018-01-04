<template>
  <div class="LDpage" v-cloak>
    <div class="LDheader">
      <div class="LDHeaderC">
        <div class="leaderLogo">
          <img src="http://static.crecgec.com/leader/leaderLOGO.png">
        </div>
        <div class="leaderLogin">
          <a href="javascript:;">请登录</a>
        </div>
      </div>
    </div>
    <div class="LDcont">
      <div class="projectC">
        <div class="title">
          <span class='leftT'>项目分布</span>
          <div class="year" >
            <select @change='changeYear($event)'>
              <option v-for='(val, index) in year' :value="val" >{{val}}年</option>
            </select>
            <!--:class='{yearSelected:ySelected == true}'
            <div @click='selectOpen'>
                {{selectYear}}年
            </div>
            <ul class="yearList">
                <li v-for='(val, index) in year'>{{val}}年</li>
            </ul>
            -->
          </div>
        </div>
        <div class="chartsArea">
          <div id="china-map"></div>
          <div class="areaMeng">
            <table>
              <thead>
              <tr>
                <td>
                  省份
                </td>
                <td>
                  数量（万吨）
                </td>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>广西省</td>
                <td>332132.00</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="meng" v-show='mengHide'>
      <div class="mengCont">
        <div class="mengTitle">
          项目分部
          <a href="javascript:;" class="close" @click='close()'></a>
        </div>


        <div class="mengC">
          <div class="classChioce">
            <a href="javascript:;" @click='selectChioce("")' :class="{select: classifySe == ''}">全部</a>
            <a href="javascript:;" @click='selectChioce("钢材")' :class="{select: classifySe == 'gc'}">钢材</a>
            <a href="javascript:;" @click='selectChioce("水泥")' :class="{select: classifySe == 'sn'}">水泥</a>
            <a href="javascript:;" class="select daochu" @click='download()'>导出</a>
          </div>
          <div class="tableList" id="tableList">
            <!-- 计划 -->
            <table class="listTab jhTable" v-show='jhState'>
              <thead>
              <tr>
                <td width='40'>
                  序号
                </td>
                <td width='80'>
                  区域
                </td>
                <td width='80'>
                  省份
                </td>
                <td width='150'>
                  二级单位名称
                </td>
                <td width='100'>
                  地区
                </td>
                <td width='210'>
                  工程项目
                </td>
                <td width='120'>
                  物料种类
                </td>
                <td width='130'>
                  计划数量（吨）
                </td>
                <td width='130'>
                  已采购数量（吨）
                </td>
                <td>
                  剩余数量（吨）
                </td>
              </tr>
              </thead>
            </table>
            <div v-show='jhState' class="tabouter">
              <table class="listTab jhTable">
                <tbody>
                <tr v-for='(val, key) in jhListData'>
                  <td width='40'>
                    {{val.id}}
                  </td>
                  <td width='80'>
                    {{val.qy}}
                  </td>
                  <td width='80'>
                    {{val.sf}}
                  </td>
                  <td width='150'>
                    {{val.ejdwmc}}
                  </td>
                  <td width='100'>
                    {{val.dq}}
                  </td>
                  <td width='210'>
                    {{val.ggxm}}
                  </td>
                  <td width='120'>
                    {{val.wlzl}}
                  </td>
                  <td width='130'>
                    {{val.cgsl | countTofixed}}
                  </td>
                  <td width='130'>
                    {{val.zxsl | countTofixed}}
                  </td>
                  <td>
                    {{val.sysl | countTofixed}}
                  </td>
                </tr>
                <tr v-show='totalPage === nowpage'>
                  <td>

                  </td>
                  <td>

                  </td>
                  <td>

                  </td>
                  <td>

                  </td>
                  <td>

                  </td>
                  <td>

                  </td>
                  <td>
                    合计：
                  </td>
                  <td>
                    {{jhslTotal | countTofixed}}
                  </td>
                  <td>
                    {{jhycgslTotal | countTofixed}}
                  </td>
                  <td>
                    {{jhsyslTotal | countTofixed}}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <!-- 直报 -->
            <table class="listTab jhTable" v-show='zbState'>
              <thead>
              <tr>
                <td width="40">
                  序号
                </td>
                <td width="80">
                  区域
                </td>
                <td width="80">
                  省份
                </td>
                <td width="200">
                  二级单位名称
                </td>
                <td width='100'>
                  地区
                </td>
                <td width="160">
                  工程项目
                </td>
                <td width="160">
                  物料种类
                </td>
                <td width="114">
                  计划数量（吨）
                </td>
                <td width="114">
                  已采购数量（吨）
                </td>
                <td>
                  剩余数量（吨）
                </td>
              </tr>
              </thead>
            </table>

            <div v-show='zbState' class="tabouter">
              <table>
                <tbody>
                <tr v-for='(val, key) in zbListData'>
                  <td width="40">
                    {{val.id}}
                  </td>
                  <td width="80">
                    {{val.qy}}
                  </td>
                  <td width="80">
                    {{val.sf}}
                  </td>
                  <td width="200">
                    {{val.ejdw}}
                  </td>
                  <td width="100">
                    {{val.dq}}
                  </td>
                  <td width="160">
                    {{val.xm}}
                  </td>
                  <td width="160">
                    {{val.zl}}
                  </td>
                  <td width="114">
                    {{val.sl | countTofixed}}
                  </td>
                  <td width="114">
                    {{val.ycgsl | countTofixed}}
                  </td>
                  <td>
                    {{val.sysl | countTofixed}}
                  </td>
                </tr>
                <tr v-show='totalPage === nowpage'>
                  <td>
                  </td>
                  <td>
                  </td>
                  <td>
                  </td>
                  <td>
                  </td>
                  <td>
                  </td>
                  <td >
                  </td>
                  <td >
                    合计：
                  </td>
                  <td>
                    {{zbslTotal | countTofixed}}
                  </td>
                  <td>
                    {{zbycgslTotal | countTofixed}}
                  </td>
                  <td>
                    {{zbsyslTotal | countTofixed}}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <!-- loading -->
            <div class="loading" v-show='loadingShow'>
              <img src="http://static.crecgec.com/leader/loading.gif">
            </div>
          </div>
          <div class="page">
            <!-- 分页 TOP -->
            <div id="gray" class="M-box">
            </div>
            <!-- 分页 BTM -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getListData, DownLoadFile, setMap} from 'common/js/base'
  let echarts = require('echarts/lib/echarts')
  import {buildChart} from 'common/js/mychart'
  require('echarts/map/js/china')

  export default {
    data () {
      return {
        pageSize: 50,
        nowpage: 0,
        mengHide: false,
        area: '',
        year: [2017, 2018],
        yearSelect: 2017, // 年份
        citySelect: '', // 省份
        seriesName: '', // 直报OR计划
        classify: '', // 分类
        classifyly: '', // 分类字段
        classifySe: '',
        loadingShow: true, // loading显示
        // ySelected: false,
        // 总数计算Top
        zbslTotal: 0,
        zbycgslTotal: 0,
        zbsyslTotal: 0,
        jhslTotal: 0,
        jhycgslTotal: 0,
        jhsyslTotal: 0,
        totalPage: 99,
        // 总数计算Btm
        constName: '计划（万吨）',
        myChart: null,
        jhState: false,
        zbState: false,
        jhAllData: [],
        zbAllData: [],
        jhListData: [],
        zbListData: [],
        Domclass: 'tabouter',
        areaData: [
          {
            'area': '东北区',
            'city': ['辽宁', '吉林', '黑龙江'],
            'data': [
              { name: "辽宁" },
              { name: "吉林" },
              { name: "黑龙江" },
              { name: "东北区" }
            ]
          },
          {
            'area': '港澳台区',
            'city': ['台湾', '香港', '澳门'],
            'data': [
              { name: "台湾" },
              { name: "香港" },
              { name: "澳门" },
              { name: "港澳台区" }
            ]
          },
          {
            'area': '华北区',
            'city': ['山东', '内蒙古', '河北', '天津',  '山西', '北京'],
            'data': [
              { name: "山东" },
              { name: "内蒙古" },
              { name: "河北" },
              { name: "天津" },
              { name: "山西" },
              { name: "北京" },
              { name: "华北区" }
            ]
          },
          {
            'area': '华东区',
            'city': ['福建', '江西', '浙江', '江苏', '上海', '安徽'],
            'data': [
              { name: "福建" },
              { name: "江西" },
              { name: "浙江" },
              { name: "江苏" },
              { name: "上海" },
              { name: "安徽" },
              { name: "华东区" }
            ]
          },
          {
            'area': '中南区',
            'city': ['海南', '广西', '河南', '湖北', '湖南', '广东'],
            'data': [
              { name: "海南" },
              { name: "广西" },
              { name: "河南" },
              { name: "湖北" },
              { name: "湖南" },
              { name: "广东" },
              { name: "中南区"}
            ]
          },
          {
            'area': '西南区',
            'city': ['西藏', '四川', '贵州', '云南', '重庆'],
            'data': [
              { name: "西藏" },
              { name: "四川" },
              { name: "贵州" },
              { name: "云南" },
              { name: "重庆" },
              { name: "西南区" }
            ]
          },
          {
            'area': '西北区',
            'city': ['甘肃', '新疆', '宁夏', '青海', '陕西'],
            'data': [
              {name: "甘肃" },
              { name: "新疆" },
              { name: "宁夏" },
              { name: "青海" },
              { name: "陕西" },
              { name: "西北区" }
            ]
          }
        ]
      }
    },
    mounted () {
      var This = this
      this.myChart = echarts.init(document.getElementById('china-map'), 'infographic');
      setMap(This)
      // 监听鼠标移入
      This.myChart.on('mouseover', function (params) {
        var city = params.name
        for (var i = 0; i < This.areaData.length; i++) {
          /* 省市选择
           if (areaData[i].city.includes(city)) {
           This.myChart.dispatchAction({
           type: 'highlight',
           batch: areaData[i].data
           });
           }
           */
          if (This.areaData[i].area === city) {
            This.myChart.dispatchAction({
              type: 'highlight',
              batch: This.areaData[i].data
            })
          }
        }
      })
      // 监听鼠标移出
      This.myChart.on('mouseout', function(params) {
        var city = params.name
        for (var i = 0; i < This.areaData.length; i++) {
          if (This.areaData[i].city.includes(city) || This.areaData[i].area === city) {
            This.myChart.dispatchAction({
              type: 'downplay',
              batch: This.areaData[i].data
            })
          }
        }
      })
      // 监听鼠标点击 -- 点击省时展示
      This.myChart.on('click', function(params) {
//        var year = This.yearSelect
        var city = params.name
        var seriesName = params.seriesName

        var rel = /区/g

        if (rel.test(city)) {
          return false
        }

        This.loadingShow = true
        This.citySelect = city
        This.seriesName = seriesName

        This.mengHide = true
        if (seriesName === This.constName) {
          This.jhState = true;
        } else {
          This.zbState = true
        }
        getListData(This)
        for (var i = 0; i < This.areaData.length; i++ ) {
          if (This.areaData[i].city.includes(city) || This.areaData[i].area === city) {
            This.mengHide = true
            This.area = this.areaData[i].area
          }
        }
      })
    },
    methods: {
      // 关闭蒙版层
      close: function () {
        this.mengHide = false;
        this.zbState = false;
        this.jhState = false;
        this.classifySe = '';
        this.classify = "钢材"
        init(this)
      },
      // 选择分类
      selectChioce: function (classify) {
        this.loadingShow = true
        this.nowpage = 0
        if (classify === '钢材') {
          this.classifySe = 'gc'
          this.classifyly = '盘条","圆钢","建筑钢筋'
        } else if (classify === '水泥') {
          this.classifySe = 'sn'
          this.classifyly = '水泥'
        } else {
          this.classifySe = ''
          this.classifyly = ''
        }
        getListData(this)
      },
      // 选择年
      changeYear: function (event) {
        this.yearSelect = event.target.value
        setMap(this)
      },
      // 下载exel
      download: function () {
        /*
         axios({
         methods: 'GET',
         // url: './mysql/createsql.php',
         url: './mysql/download.php',
         params: {
         mytype: 'downloadExel',
         seriesName: this.seriesName
         }
         }).then(function(res){
         console.log(res)
         if(!res.data){
         console.log('请求错误！')
         }
         // console.log(res.data)
         }).catch(function(err){
         console.log(err)
         })
         */
        var data = {
          mytype: 'downloadExel',
          name: this.yearSelect + '_' + (this.constName) + '一览表',
          year: this.yearSelect,
          city: this.citySelect,
          seriesName: this.seriesName,
          classify: this.classifyly
        }
        DownLoadFile({
          url: './mysql/createsql.php',
          data: data
        })
      }
    },
    filters: {
      countTofixed: function (val) {
        val = val || 0
        return parseFloat(val).toFixed(2)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/css/base.styl"
  @import "~common/css/common.styl"
  @import "~common/css/pagination.styl"
  @import "~common/css/reset.styl"
  @import "~common/css/smartpaginator.styl"
</style>
