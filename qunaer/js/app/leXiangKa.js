/*
 * 使用require的text插件来加载html和css等其他需要用到的文本模块，
 * 语法就是text!后面跟上文件的路径名，
 */
define(['text!view/leXiangKa.html','text!css/leXiang.css','text!css/swiper.min.css','jquery'],function(html,css,css1,$){
	
	function render(){
		$('#outer').html(html);
		$("style").eq(0).html(css);
		$("style").eq(1).html(css1);
		//动态获取数据创建中间banner商品列表
		
		
  	}
	return {
		render:render
	}
	
})