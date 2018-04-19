
	//返回顶部
	function Back(id){
		$(window).scroll(function() {
			if($(this).scrollTop() != 0) {
				$(id).fadeIn();
			} else {
				$(id).fadeOut();
			}
		});
		 
		$(id).click(function() {
			$('body,html').animate({scrollTop:0},500);
		});
	}


	
	
	
