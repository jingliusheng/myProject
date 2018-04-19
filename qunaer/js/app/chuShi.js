/*
 * 使用require的text插件来加载html和css等其他需要用到的文本模块，
 * 语法就是text!后面跟上文件的路径名，
 */
define(['text!view/chuShi.html','text!css/chuShiPage.css','text!css/swiper.min.css','jquery'],function(html,css,css1,$){
	
	function render(){
		$('#outer').html(html);
		$("style").eq(0).html(css);
		$("style").eq(1).html(css1);
		//动态获取数据创建中间banner商品列表
	/*
	 * 动态创建列表的方法二
	 * 
	 */
//		buildList();
//		function buildList(){
//			
//	        $.ajax({
//	            url:'data/zhuye-list.json',
//	            error:function(data){
//	                alert(data);
//	            },
//	            success:function(data){
//	                if(typeof data ==="string"){
//                 	 data = JSON.parse(data);
//              	}
//	                
//	                var html = [];
//	                for(var i= 0,len = data.result.length;i<len;i++){
//	                    var item = data.result[i];
//	                    html.push(renderItem(item));
//	                }
//	
//	                $('#goods ul').html(html.join('')); 
//	            }
//	       	 });
//			}
//	
//		function renderItem(data){
//          var str='<li>\
//						<a href="#/lieBiao">\
//							<img src="'+data.img+'" />\
//							<div>\
//								<p>'+data.name+'</p>\
//								<span>'+data.jieshao+'</span>\
//								<span>'+data.price+'</span>\
//							</div>\
//							<i></i>\
//						</a>\
//					</li>';
//          return str;
//      }
  }
	return {
		render:render
	}
	
})