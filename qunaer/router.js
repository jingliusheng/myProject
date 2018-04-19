				
define(["backbone"],function(backbone){
		var Router=Backbone.Router.extend({
			/*
			 * routes下面的对应关系是当链接地址跳转的相应的链接的时候，就执行后面相应的方法，
			 */
			routes:{
				""          :"shouYe",
				"shouYe"    :"shouYe",
				"leYuan"    :"leYuan",
				"leXiangKa":"leXiangKa",
				"woDe"      :"woDe",
				"zhangHu"   :"zhangHu",
				"pay"       :"pay",
				"fenXiang"  :"fenXiang",
			},
			
			chuShi:function(){
				require(['js/app/chuShi'],function(chuShi){
					chuShi.render();
				})
			},
			shouYe:function(){
				/*
				 * 在require中对应要执行该方法需要用到的js文件就从这里加载进去，
				 * 可以在mainjs中提前配置好文件的路径，这里就可以直接使用，也可以在这里写路径
				 */
				require(['js/app/shouYe','swiper'],function(shouYe){
					shouYe.render();
				})
			},
			leYuan:function(){
				require(['js/app/leYuan'],function(leYuan){
					leYuan.render();
				})
			},
			leXiangKa:function(){
				require(['js/app/leXiangKa'],function(leXiangKa){
					leXiangKa.render();
				})
			},
			woDe:function(){
				require(['js/app/woDe'],function(woDe){
					woDe.render();
				})
			},
			zhangHu:function(){
				require(['js/app/zhangHu'],function(zhangHu){
					zhangHu.render();
				})
			},
			pay:function(){
				require(['js/app/pay'],function(pay){
					pay.render();
				})
			},
			fenXiang:function(){
				require(['js/app/fenXiang'],function(fenXiang){
					fenXiang.render();
				})
			},
		})
		
		var router=new Router();
		return router;
})
