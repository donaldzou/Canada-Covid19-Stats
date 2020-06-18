var recovMap;
var recov_chart;
var prov_recov_list = {}
function recov(){
    ScrollTop()
    prov_recov["Nunavut"] = 0
    if ($(".recov_link").hasClass("active") == false){
        if ($(".recov").hasClass("loaded")){
            $(".nav-link").removeClass("active");
            $(".recov_link").addClass("active");
            $(".tab").fadeOut()
            $(".recov").fadeIn()
            $(".search-bar").fadeIn();
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
            
            $(".search-bar").fadeIn();
            $(".double_nav").hide();
            $(".recov_nav").fadeIn();

            recovMap = L.map('recov_map').setView([58.972, -97.486], 4);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/dark-v10',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiZG9uYWxkem91IiwiYSI6ImNrOHN1M2JrZTBjZGEzbnI0amhzNG13dTYifQ.uTvTibSyi2lvdrbT4ipj4w'
            }).addTo(recovMap);
            
            $(".recov").fadeIn(function(){
                recovMap.invalidateSize();
            });

            for (var n in Object.keys(prov_recov)){
                var prov_name = Object.keys(prov_recov)[n]
                if (prov_recov[prov_name] == NaN){
                    var rad = 0 
                }
                else{
                    var rad = prov_recov[prov_name]
                }
                if (prov_name != "Repatriated"){
                    var circle = L.circle([prov_geocode[prov_name]['lat'],prov_geocode[prov_name]['lon']], {
                        color: color_list[n],
                        fillColor: color_list[n],
                        fillOpacity: 0.5,
                        radius: rad * 30 + 1000
                    }).addTo(recovMap).on('mouseover',function() {
                        this.openPopup();
                    }).on('mouseout',function() {
                        this.closePopup();
                    }).bindPopup("<h5>" + prov_name + "</h5><h6>" + rad + " Recovered</h6>",{className: 'my-popup'})
                }
            }
        }
    }
}

function popUp(c){
    c.openPopup()
}