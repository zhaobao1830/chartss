<?php
header('Content-Type:application/vnd.ms-excel');
header('Content-Disposition:attachmen;filename=demo.xls');
header('Pragma:no-cache');
header('Expires:0');

$title=array('bianhao','xingmng','3','4');
$data=array(
  array(1,2,3,4),
  array(1,2,3,4),
  array(1,2,3,4),
  array(1,2,3,4)
);

echo iconv('utf-8','gbk',implode("\t",$title)),"\n";
foreach($data as $value){
	echo iconv('utf-8','gbk',implode("\t",$value)),"\n";
}
?>