function recov(){
    ScrollTop()

    if ($(".recov_link").hasClass("active") == false){
        if ($(".recov").hasClass("loaded")){
            $(".nav-link").removeClass("active");
            $(".recov_link").addClass("active");
            $(".tab").fadeOut()
            $(".recov").fadeIn()
            //
            $(".double_nav").hide();
            $(".recov_nav").fadeIn();
            //
        }
        else{
            $(".totalRecov").text(recov_today+" Recovered")
            $(".recov").addClass("loaded");
            $(".nav-link").removeClass("active");
            $(".recov_link").addClass("active");
            $(".tab").fadeOut();
            $(".recov").fadeIn();
            $(".search-bar").fadeIn();
            $(".double_nav").hide();
            $(".recov_nav").fadeIn();
        }
    }
}