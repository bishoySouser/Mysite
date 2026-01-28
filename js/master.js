//nav change bg color when scroll
$(document).ready(function(){
  $(window).scroll(function(){
  	var scroll = $(window).scrollTop();
	  if (scroll > 50) {
      $(".navbar").css("background" , "#fff");
	    $(".navbar .nav-link").css("color" , "#000");
      $(".navbar-brand").css("color" , "#000");
	  }

	  else{
		  $(".navbar").css("background" , "rgba(0,0,0,0)").add('fade');
      $(".navbar .nav-link").css("color" , "#ddd");
      $(".navbar-brand").css("color" , "#ddd");
	  }
  })
});
//anchor link with scroll animate
$('a').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 500);
    return false;
});
