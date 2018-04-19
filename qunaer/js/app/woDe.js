/*
 * 使用require的text插件来加载html和css等其他需要用到的文本模块，
 * 语法就是text!后面跟上文件的路径名，
 */
define(['text!view/woDe.html','text!css/my.css','text!css/swiper.min.css','jquery'],function(html,css,css1,$){
	
	function render(){
		$('#outer').html(html);
		$("style").eq(0).html(css);
		$("style").eq(1).html(css1);
		
		//点击吐槽按钮弹出对话框
		$('.tuCao111').click(function(){
			$('#tuCao').css('display','block');
			
		})
  	}
	return {
		render:render
	}
	
})