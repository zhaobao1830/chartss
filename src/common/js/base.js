import axios from 'axios'
import jQuery from 'jquery'
import "common/js/jquery.pagination.js"
require('es6-promise').polyfill()
// 获取列表
/*
 param [String] year 年份
 param [String] city 区域（省份）
 param [String] seriesName 种类（计划OR直报）
 param [Object] This 需要配置的vue对象
 */
export function getListData (This) {
  init(This)
  axios({
    methods: 'GET',
    url: 'api/mysql/createsql.php',
    params: {
      mytype: 'getListDataC',
      year: This.yearSelect,
      city: This.citySelect || '',
      seriesName: This.seriesName,
      classify: This.classifyly
    }
  }).then(function (res) {
    This.loadingShow = false
    if (!res.data) {
      console.log('请求错误！')
    }
    // console.log(res.data)
    var mapData = res.data.data
    if (res.data.dataSum) {
      if (This.jhState) {
        This.jhslTotal = res.data.dataSum[0].totalcgsl
        This.jhycgslTotal = res.data.dataSum[0].totalzxsl
        This.jhsyslTotal = res.data.dataSum[0].totalsysl
      } else if (This.zbState) {
        This.zbslTotal = res.data.dataSum[0].totalsl
        This.zbycgslTotal = res.data.dataSum[0].totalycgsl
        This.zbsyslTotal = res.data.dataSum[0].totalsyslfrom
      }
    }

    for (var i = 0; i < mapData.length; i++) {
      mapData[i].id = i + 1
    }

    if (This.seriesName === This.constName) {
      This.jhAllData = mapData
      setListData(This.jhAllData, 'jhListData', This)
    } else {
      This.zbAllData = mapData
      setListData(This.zbAllData, 'zbListData', This)
    }
  }).catch(function (err) {
    console.log(err)
  })
}
// 初始化列表查询值
export function init (This) {
  This.jhListData = []
  This.zbListData = []
  This.jhAllData = []
  This.zbAllData = []
}
/*
 设置列表数据
 param [Json] data 列表数据
 param [Json] listDataName 列表数据
 param [Object] obj 需要配置的vue对象
 */
function setListData (data, listDataName, obj) {
  var totalpage = data.length - 1
  // 初始化分页
  jQuery('.M-box').pagination({
    // pageCount:50,
    totalData: totalpage,
    showData: obj.pageSize,
    jump: true,
    coping: true,
    homePage: '首页',
    endPage: '末页',
    prevContent: '上页',
    nextContent: '下页',
    callback: function (api) {
      var objDom = document.querySelectorAll('.' + obj.Domclass)[0]
      objDom.scrollTop = 0
      obj.nowpage = api.getCurrent()

      obj[listDataName] = []
      var nowPage = api.getCurrent() - 1

      for (var i = 0; i < obj.pageSize; i++) {
        if (obj.pageSize * nowPage + i > data.length - 1) {
          break
        }
        obj[listDataName][i] = data[obj.pageSize * nowPage + i]
      }
    }
  }, function (api) {
    obj.totalPage = api.getPageCount()
    obj[listDataName] = []
    obj.nowpage = api.getCurrent()
    var nowPage = api.getCurrent() - 1
    for (var i = 0; i < obj.pageSize; i++) {
      if (obj.pageSize * nowPage + i > data.length - 1) {
        break
      }
      obj[listDataName][i] = data[obj.pageSize * nowPage + i]
    }
  })
}

export function DownLoadFile (options) {
  var config = $.extend(true, { method: options.method || 'GET' }, options)
  var $iframe = $('<iframe id="down-file-iframe" />')
  var $form = $('<form target="down-file-iframe" method="' + config.method + '" />')
  $form.attr('action', config.url)
  for (var key in config.data) {
    $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />')
  }
  $iframe.append($form)
  $(document.body).append($iframe)
  $form[0].submit()
  $iframe.remove()
}
// 绘制地图
export function setMap (This) {
  axios({
    methods: 'GET',
    url: 'api/mysql/createsql.php',
    params: {
      mytype: 'getmapData',
      year: This.yearSelect
    }
  }).then(function (res) {
    if (!res.data) {
      console.log('请求出错!')
    }

    var mapData = res.data.data
    // 物资
    var MapDataUpright = []
    // 设备
    var MapDataPlot = []
    var pushData = {
      name: '',
      value: 0
    }
    for (var i in mapData) {
      var province = mapData[i].province
      // 除内蒙古外全部截取前两位
      var rel = /(内蒙古)|(黑龙江)/g
      if (!rel.test(mapData[i].province)) {
        mapData[i].province = province.substr(0, 2)
      } else {
        mapData[i].province = province.substr(0, 3)
      }
      mapData[i].mount = Math.round(parseFloat(mapData[i].mount) / 100) / 100 // 数值转为万吨
      switch (mapData[i].type) {
        case '1':
          pushData = {
            name: mapData[i].province,
            value: mapData[i].mount
          }
          MapDataUpright.push(pushData)
          break
        case '2':
          pushData = {
            name: mapData[i].province,
            value: mapData[i].mount
          }
          MapDataPlot.push(pushData)
          break
      }
    }
    buildChart (MapDataUpright, MapDataPlot, This)
  }).catch(function (err) {
    console.log(err)
  })
}

function buildChart (MapDataUpright, MapDataPlot, This) {
  var legendName = ['计划（万吨）', '直报（万吨）'];

  function randomData() {
    return Math.round(Math.random() * 1000);
  }
  // 柱状图--存放省的数据
  var resultdataDa1 = [];
  var resultdataDa2 = [];

  // 柱状图 y轴名称
  var titledata = ['东北区', '华北区', '华东区', '中南区', '西南区', '西北区' ,'港澳台区'];
  // 直报
  var ColumnUpright = setColumn(MapDataUpright);
  // 计划
  var ColumnPlot = setColumn(MapDataPlot, 7);
  function setColumn(data, areaLength){
    areaLength = areaLength || 7;
    var resultdataDa = [];
    for (var arrI = 0 ; arrI < areaLength ; arrI++) {
      resultdataDa[arrI] = {
        name: '',
        value: 0
      }
    }
    for (var i = 0; i < data.length; i++) {
      var city = data[i].name;
      // 东北
      if (city === '辽宁' || city === '吉林' || city === '黑龙江') {
        resultdataDa[0].name = '东北区';
        resultdataDa[0].value += data[i].value * 100;
      }
      // 华北区
      if (city === '山东' || city === '内蒙古' || city === '河北' || city === '天津' ||  city === '山西' || city === '北京') {
        resultdataDa[1].name = '华北区';
        resultdataDa[1].value += data[i].value * 100;

      }
      // 华东区
      if (city === '福建' || city === '江西' || city === '浙江' || city === '江苏' || city === '上海' || city === '安徽') {
        resultdataDa[2].name = '华东区';
        resultdataDa[2].value += data[i].value * 100;

      }
      // 中南区
      if (city === '海南' || city === '广西' || city === '河南' || city === '湖北' || city === '湖南' || city === '广东') {
        resultdataDa[3].name = '中南区';
        resultdataDa[3].value += data[i].value * 100;
      }
      // 西南区
      if (city === '西藏' || city === '四川' || city === '贵州' || city === '云南' || city === '重庆') {
        resultdataDa[4].name = '西南区';
        resultdataDa[4].value += data[i].value * 100;
      }
      // 西北区
      if (city === '甘肃' || city === '新疆' || city === '宁夏' || city === '青海' || city === '陕西') {
        resultdataDa[5].name = '西北区';
        resultdataDa[5].value += data[i].value * 100;
      }
      // 港澳台区
      if (city === '台湾' || city === '香港' || city === '澳门') {
        resultdataDa[6].name = '港澳台区';
        resultdataDa[6].value += data[i].value * 100;
      }
    }
    for(var i = 0 ; i < resultdataDa.length ; i++){
      resultdataDa[i].value = resultdataDa[i].value / 100;
    }
    return resultdataDa;
  }

  let option = {
    title: [{
      text: '数据统计',
      // subtext: '纯属虚构',
      left: 'center'
    }],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: legendName,
      selectedMode: 'single'
    },
    visualMap: {
      min: 0,
      max: 50000,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true,
      colorLightness: [0, 5000000],
      // color: ['#08348B','#0654A4','#276DAE','#4386BF','#72ABD7'],
      color: ['#255288','#2B6399','#3370A5','#3E8FBF','#58B3DB'],
      // color: ['#c05050','#e5cf0d','#5ab1ef'],
      dimension: 0
    },
    /*
     toolbox: {
     show: true,
     orient: 'vertical',
     left: 'right',
     top: 'center',
     feature: {
     dataView: {
     readOnly: false
     },
     restore: {},
     saveAsImage: {}
     }
     },
     */
    grid: {
      right: 40,
      top: 100,
      bottom: 40,
      width: '30%'
    },
    xAxis: [{
      show:false,
      position: 'top',
      type: 'value',
      boundaryGap: false,
      boundaryGap: false,
      // 网线
      splitLine: {show: true},
      axisLine: {show: true},
      axisTick: {show: true}
    }],
    yAxis: [{
      type: 'category',
      data: titledata,
      axisTick: {
        alignWithLabel: false
      },
      splitLine: {show: false},
      axisLine: {show: false},
      axisTick: {show: false},
    }],
    series: [{
      z: 1,
      name: legendName[0],
      type: 'map',
      map: 'china',
      left: '0',
      top: 100,
      // roam: true,
      zoom: 0.8,
      label: {
        normal: {
          color:'black',
          show: true
        }
      },
      showLegendSymbol: false,
      data: MapDataPlot
    },{
      z: 1,
      name: legendName[1],
      type: 'map',
      map: 'china',
      left: '0',
      top: 100,
      // roam: true,
      zoom: 0.8,
      label: {
        normal: {
          color:'black',
          show: true
        }
      },
      showLegendSymbol: false,
      data: MapDataUpright
    },{
      name: legendName[0],
      z: 2,
      type: 'bar',
      left: 0,
      bottom: 0,
      barWidth : 60,
      barGap: '10px',
      barCategoryGap: '10px',
      label: {
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        emphasis: {
          color: "rgb(254,153,78)"
        }
      },
      data: ColumnPlot
    }, {
      name: legendName[1],
      z: 2,
      type: 'bar',
      left: 0,
      bottom: 0,
      barWidth : 60,
      barGap: '10px',
      barCategoryGap: '10px',
      label: {
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        emphasis: {
          color: "rgb(254,153,78)"
        }
      },
      data: ColumnUpright
    }]
  };

  This.myChart.setOption(option);
}
