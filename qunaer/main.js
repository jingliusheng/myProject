		
		
		requirejs.config({
			paths:{
			       'jquery'    :'js/jquery-1.12.3',
				   'router'    :'router',
				   'backbone'  :'js/backbone',
				   'underscore':'js/underscore',
				   'text'      :'js/text',
				   'swiper'    :'js/swiper-3.3.1.min',
				   'shiPing'   :'js/app/shiPing',
				   'back'      :'js/app/backTop',
   				   'bt'        :'js/bt',
 			}
		});
		
		require(['backbone','router'],function(Backbone){
				//启动路由
				Backbone.history.start();
			})
