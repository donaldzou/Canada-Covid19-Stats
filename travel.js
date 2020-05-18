var travel_map
function travel() {
    $(".search-bar").fadeOut();
    if ($(".travel").hasClass('loaded')) {
        $(".nav-link").removeClass("active");
        $(".travel_link").addClass("active");
        $(".tab").fadeOut()
        $(".travel").fadeIn();
        close_button()
        setTimeout(function(){
            travel_map.invalidateSize();
        },300)
        
    }
    else {
        $(".spinner-cases").fadeIn()
        $(".travel").addClass("loaded")
        $(".nav-link").removeClass("active");
        $(".travel_link").addClass("active");
        $(".tab").fadeOut()
        $(".travel").fadeIn();

        travel_map = L.map('travel_map').setView([20.685, 15.118], 2);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/dark-v10',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZG9uYWxkem91IiwiYSI6ImNrOHN1M2JrZTBjZGEzbnI0amhzNG13dTYifQ.uTvTibSyi2lvdrbT4ipj4w'
        }).addTo(travel_map);



        setTimeout(function () {
            load_travel()
        }, 500)

    }

}

function load_travel() {
    var travel_list = Object.keys(travel_history).sort()
    for (var a in travel_list){
        if (travel_list[a] != '' && travel_list[a] != 'Not Reported'){
            $(".travel tbody").append('<tr><th scope="row">'+travel_list[a]+'</th><td>'+travel_history[travel_list[a]]+'</td></tr>')
        }
    }
    var not = travel_history[''] + travel_history['Not Reported']
    $(".travel tbody").append('<tr><th scope="row">Not Reported</th><td>'+not+'</td></tr>')
    for (var n in Object.keys(travel_history)) {
        var country_name = Object.keys(travel_history)[n]
        if (country_name == 'U.S. Virgin Islands') {
            country_name = 'Virgin Islands'
        }
        $.ajax({
            type: 'GET',
            url: "https://geocoder.ls.hereapi.com/search/6.2/geocode.json?languages=en-US&maxresults=1&searchtext=" + country_name + "&apiKey=1VOe2SSnYK_atMeC1iN-KrCYh_T9T8oqALHXPv_O0FE",
            dataType: "text",
            async: false,
            success: function (data) {
                var temp_travel = JSON.parse(data)
                temp_travel.name = Object.keys(travel_history)[n]
                if (temp_travel.Response.View[0].Result[0].MatchLevel == 'city' || temp_travel.Response.View[0].Result[0].MatchLevel == 'country') {
                    var circle = L.circle([temp_travel.Response.View[0].Result[0].Location.DisplayPosition.Latitude, temp_travel.Response.View[0].Result[0].Location.DisplayPosition.Longitude,], {
                        color: '#6efffd',
                        fillColor: '#6efffd',
                        fillOpacity: 0.5,
                        radius: travel_history[temp_travel.name] * 20000
                    }).addTo(travel_map);
                    circle.bindPopup("<h5>" + temp_travel.name + "</h5><p>" + travel_history[temp_travel.name] + " cases</p>")
                    
                }
            }
        })
    }
    
    $(".spinner-cases").fadeOut();
    $(".t_map").css('opacity',1);
    close_button();
    travel_map.invalidateSize();
    

}