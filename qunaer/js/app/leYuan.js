/*
 * 使用require的text插件来加载html和css等其他需要用到的文本模块，
 * 语法就是text!后面跟上文件的路径名，
 */
define(['text!view/leYuan.html','text!css/leYuan.css','text!css/swiper.min.css','jquery'],function(html,css,css1,$){
	
	function render(){
		$('#outer').html(html);
		$("style").eq(0).html(css);
		$("style").eq(1).html(css1);
		//动态获取数据创建中间banner商品列表
		getData();
		function getData(){
			//获取数据
			$.ajax({
				url:"data/p20QC.json",
				success:function(data){
					if(typeof data ==="string"){
                   	 data = JSON.parse(data);
                	}
                    //默认列表
					 var aData=data.data;
	                var html = [];
	                for(var i= 0;i<aData.length;i++){
	                    var item = aData[i];
	                    html.push(renderItem(item));
	                }
					//把上面那个叫html的数组用join()的方法转换成字符串,并追加到父级中
	                $('section .list').html(html.join('')); 
				}
			});
			
			function renderItem(data){
	            var str='<li>\
						<a href="#">\
							<div class="div1"><img src="'+data.img+'"/></div>\
							<i></i>\
							<i></i>\
							<p>\
								<span>'+data.dist+'</span><span>公里</span>\
							</p>\
							<p>\
								<span>'+data.name+'</span>\
								<span>'+data.address+'</span>\
							</p>\
					    </a>\
					</li>';
	            return str;
			}
		}//getdata的括号
		
		//给分类按钮添加点击事件
  		$('.classify>li').click(function(){
  			var f=$('.classify>li').index(this);
  			
  			//点击之后出现蒙版,再出现每个选项对应的列表
  			$('.wrap').css('display','block');
  			
  			$('.classify ul').eq(f).css('display','block').parent().siblings().children('ul').css('display','none');
  			$('.classify>li').eq(f).addClass('active').siblings().removeClass('active');
  		})
  		//分类列表弹出之后点击任意一个子项,商品列表项的内容重新获取数据加载,并且蒙版层和弹出的列表消失
  		$('.classify ul li').click(function(e){
  			//上面给他的父级添加了点击事件,这里先阻止冒泡
			e.stopPropagation();
			
			//进来后先判断点击的是哪个li,获取属性吗
			var val=$(this).attr('class');
			//按位置排列
			var url1="data/p20"+val+".json";

			//选择所在地区
			$.ajax({
				type:"get",
				url:url1,
				success:function(data){
					if(typeof data ==="string"){
                   	 data = JSON.parse(data);
                	}
                    //加载对应的列表
					var aData=data.data;
	                var html = [];
	                for(var i= 0;i<aData.length;i++){
	                    var item = aData[i];
	                    html.push(renderItem(item));
	                }
					//把上面那个叫html的数组用join()的方法转换成字符串,并追加到父级中
	                $('section .list').html(html.join('')); 
				}
			})
			function renderItem(data){
	            var str='<li>\
						<a href="#">\
							<div><img src="'+data.img+'"/></div>\
							<i></i>\
							<i></i>\
							<p>\
								<span>'+data.dist+'</span><span>公里</span>\
							</p>\
							<p>\
								<span>'+data.name+'</span>\
								<span>'+data.address+'</span>\
							</p>\
					    </a>\
					</li>';
	            return str;
			}
		
			//列表和蒙版隐藏
  			$('.classify ul').css('display','none');
  			$('.wrap').css('display','none');
  			
  		})
  	
	}//render的括号
	return {
		render:render
	}
	
})