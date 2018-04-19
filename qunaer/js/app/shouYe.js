/*
 * 使用require的text插件来加载html和css等其他需要用到的文本模块，
 * 语法就是text!后面跟上文件的路径名，
 */
define(['text!view/shouYe.html','text!css/shouYe.css','text!css/swiper.min.css','jquery'],function(html,css,css1,$){
	
	function render(){
		$('#outer').html(html);
		$("style").eq(0).html(css);
		$("style").eq(1).html(css1);
		//动态获取数据创建列表
		
		getData();
		function getData(){
			//获取数据
			$.ajax({
				type:"get",
				url:"data/p1.json",
				success:function(data){
					if(typeof data ==="string"){
                   	 data = JSON.parse(data);
                	}
                    //顶部轮播图
					 var aSlider=data.slider;
					 //中间两个大图
					 var aArealist=data.arealist;
					 //下面的列表
					 var aReclist=data.reclist;
	                
	                var html = [];
	                var html1=[];
	                var html2=[];
	                for(var i= 0;i<aSlider.length;i++){
	                    var item = aSlider[i];
	                    html.push(renderItem(item));
	                }
					//把上面那个叫html的数组用join()的方法转换成字符串,并追加到父级中
	                $('.swiper-wrapper').html(html.join('')); 
	                
	                for(var j=0;j<aArealist.length;j++){
	                	var item = aArealist[j];
	                    html1.push(renderItem1(item));
	                }
	                $('.section-two').html(html1.join('')); 
	                
	                for(var j=0;j<aReclist.length;j++){
	                	var item = aReclist[j];
	                    html2.push(renderItem2(item));
	                }
	                $('.section-thire ul').html(html2.join('')); 
				}
			});
			
			function renderItem(data){
	            var str='<div class="swiper-slide">\
						      <a href="#">\
						    	  <img src="'+data.img+'"/>\
						      </a>\
						 </div>';
	            return str;
			}
			
			function renderItem1(data){
	            var str='<div>\
	            			<a href="'+data.href+'">\
	            				<img src="'+data.img+'"/>\
	            			</a>\
	            		</div>';
	            return str;
			}
			
			function renderItem2(data){
	            var str='<li>\
							<a href="#">\
								<img src="'+data.img+'"/>\
							</a>\
						</li>';
	            return str;
			}
			
		
		
		}//getdata的括号
		
  	} //render的括号
	
	return {
		render:render
	}
	
})