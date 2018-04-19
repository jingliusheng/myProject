window.onload=function(){
	fn();
	function fn () {
		var w = window.innerWidth /3.2;
		var html = document.querySelector("html");
		html.style.fontSize = w +"px";
	}
	window.onresize = fn;
}
