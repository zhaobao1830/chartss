<?php

	header("Content-type: text/html; charset=utf-8");   
	$type = $_GET['mytype'];

	if($type == '' || $type == null){
		echo json_encode('{"state":"error","msg":"错误的请求"}');
	}
	else {
		switch ($type) {
			case 'getmapData':
				$year = $_GET['year'];
				if($year == '' || $year == null){
					echo json_encode('{"state":"error","msg":"参数错误！"}');
				}
				else{
					$res = getMapData($year);
				}
				break;
			case 'getListDataC':
				$year = $_GET['year'];
				$city = $_GET['city'];
				$seriesName = $_GET['seriesName'];
				$classify = $_GET['classify'];
				if($year == null || $city == null || $seriesName == null){
					echo json_encode('{"state":"errorData","msg":"参数错误列表！"}');
				}
				else{

					getListData($year, $city, $seriesName, $classify);
					// echo count($resultData);
				}
				break;
			
			case 'downloadExel':
				$name = $_GET['name'];
				$year = $_GET['year'];
				$city = $_GET['city'];
				$seriesName = $_GET['seriesName'];
				$classify = $_GET['classify'];
				if($name == '' || $name == null){
					echo json_encode('{"state":"error","msg":"参数错误！"}');
				}
				else{
					$res = downloadExel($name, $year, $city, $seriesName, $classify);
				}
				break;
			default:
				# code...
				break;
		}
	}

	// 获取地图信息
	function getMapData($year) {

		$db = mysqli_init();
		$db->real_connect('localhost', 'root', '123456', 'my_db_charts'); 
		$db->set_charset("utf8");
		#地图表展示结果
		// $getSql = 'select * from ditubiao where type = 1';
		$getSql = "select * from ditubiao where year = $year";
		//判断是否连接成功
		//mysqli_connect_error()?die("连接失败"):"";

		//执行sql语句
		$result = $db->query($getSql);//返回结果集对象
		$n = $result->fetch_row();//这里的$result是一个对，存到变量$n里面。
		$data = $result->fetch_all(MYSQLI_ASSOC);
		$resultData = $data;
		if($n[0]>0)//n>0代表能够匹配到，就能够登陆成功。然后跳转到主页面。在外部再建一个主页面main.php.$n是一个数组，要取里面的元素来判断。
		{
			echo '{"state":"sucess","msg":"请求成功","data":'.json_encode($data)."}";
		}
		else//如果匹配不成功
		{
			echo json_encode('{"state":"error","msg":"错误的请求"}');
		}
	}
	// 获取列表信息
	function getListData($year, $city, $seriesName, $classify) {

		$data = searchprovince($year, $city, $seriesName, $classify, true);
		if(count($data[0])>0)//n>0代表能够匹配到，就能够登陆成功。然后跳转到主页面。在外部再建一个主页面main.php.$n是一个数组，要取里面的元素来判断。
		{
			echo '{"state":"sucess","msg":"请求成功","data":'.json_encode($data[0]).',"dataSum":'.json_encode($data[1]).'}';
			return json_encode($data);
		}
		else{
			//如果匹配不成功
			echo json_encode('{"state":"noData","msg":"无查询结果"}');
		}
	}

	// 查询
	function searchprovince($year, $city, $seriesName, $classify, $getTotal = false){
		$returnData = Array();
		$db = mysqli_init();
		$db->real_connect('localhost', 'root', '123456', 'my_db_charts'); 
		$db->set_charset("utf8");
		#地图表展示结果
		if ($seriesName == '计划（万吨）') {
			$getSql = 'select (@i:=@i+1) as i,qy,sf,ejdwmc,dq,ggxm,wlzl,cgsl,zxsl,sysl from zbsgjhcx,(select @i:=0) as it where nd = "'.$year.'" and sf like "'.$city.'%"';
			$getSqlSum = 'select sum(cgsl ) as totalcgsl,sum(zxsl ) as totalzxsl,sum(sysl ) as totalsysl from zbsgjhcx where nd = "'.$year.'" and sf like "'.$city.'%"';
			if ($classify) {
				$getSql = $getSql.' and wlzl in ("'.$classify.'")';
				$getSqlSum = $getSqlSum.'and wlzl in ("'.$classify.'")';
			}
		}
		else if ($seriesName == '直报（万吨）') {
			$getSql = 'select (@i:=@i+1) as i,qy,sf,ejdw,dq,xm,zl,sl,ycgsl,sysl from zbjhcx,(select @i:=0) as it where nd = "'.$year.'" and sf like "'.$city.'%"';
			$getSqlSum = 'select sum(sl ) as totalsl,sum(ycgsl ) as totalycgsl,sum(sysl ) as totalsysl from zbjhcx where nd = "'.$year.'" and sf like "'.$city.'%"';

			if ($classify) {
				$getSql = $getSql.' and zl in ("'.$classify.'")';
				$getSqlSum = $getSqlSum.' and zl in ("'.$classify.'")';
			}
		}
		else {
			echo json_encode('{"state":"classerror","msg":"种类错误！"}');
			exit();
		}
		/*
		var_dump($getSql);
		exit();
		*/

		//执行sql语句
		$result = $db->query($getSql);//返回结果集对象
		//$n = $result->fetch_row();//这里的$result是一个对，存到变量$n里面。

		$listData = $result->fetch_all(MYSQLI_ASSOC);
		array_push($returnData, $listData);
		if($getTotal){
			$result2 = $db->query($getSqlSum);
			$dataSum = $result2->fetch_all(MYSQLI_ASSOC);
			array_push($returnData, $dataSum);
		}
		return $returnData;
	}
	// 下载附件
	function downloadExel($name, $year, $city, $seriesName, $classify) {
		$resData = searchprovince($year, $city, $seriesName, $classify);
		header('Content-Type:application/vnd.ms-excel');
		header('Content-Disposition:attachmen;filename='.$name.'.xls');
		header('Pragma:no-cache');
		header('Expires:0');

		if ($seriesName == '计划（万吨）') {
			$title=array("序号","区域","省份","二级单位名称","地区","工程项目","物料种类","计划数量（吨）","已采购数量（吨）","剩余数量（吨）");
		}
		else if ($seriesName == '直报（万吨）') {
			$title=array("序号","区域","省份","二级单位名称","工程项目","物料种类","计划数量（吨）","已采购数量（吨）","剩余数量（吨）");
		}
		else {
			echo json_encode('{"state":"serieserror","msg":"种类错误！"}');
			exit();
		}
		$data=$resData[0];

		echo iconv('utf-8','gbk',implode("\t",$title)),"\n";
		foreach($data as $value){
			echo iconv('utf-8','gbk',implode("\t",$value)),"\n";
		}
	}
?>