var temp_lat;

var longtitude;
var prov_age = {}
var prov_geocode = {}
var group1 = L.featureGroup();
var age_chart;
var news_link = {
    "Canada":{'link':['https://www.cbc.ca/news/covid-19']},
    "Ontario": { 'link': ['https://www.cbc.ca/news/canada/toronto', 'https://www.cbc.ca/news/canada/ottawa', 'https://www.cbc.ca/news/canada/manitoba', 'https://www.cbc.ca/news/canada/sudbury', 'https://www.cbc.ca/news/canada/london', 'https://www.cbc.ca/news/canada/kitchener-waterloo', 'https://www.cbc.ca/news/canada/hamilton', 'https://www.cbc.ca/news/canada/windsor'] },
    "BC": { 'link': ['https://www.cbc.ca/news/canada/british-columbia'] },
    "Quebec": { 'link': ['https://www.cbc.ca/news/canada/montreal', 'https://www.cbc.ca/news/canada/north',] },
    "Alberta": { 'link': ['https://www.cbc.ca/news/canada/calgary', 'https://www.cbc.ca/news/canada/edmonton'] },
    "Saskatchewan": { 'link': ['https://www.cbc.ca/news/canada/saskatchewan', 'https://www.cbc.ca/news/canada/saskatoon'] },
    "Manitoba": { 'link': ['https://www.cbc.ca/news/canada/manitoba'] },
    "New Brunswick": { 'link': ['https://www.cbc.ca/news/canada/new-brunswick'] },
    "PEI": { 'link': ['https://www.cbc.ca/news/canada/prince-edward-island'] },
    "NL": { 'link': ['https://www.cbc.ca/news/canada/newfoundland-labrador'] },
    "Nova Scotia": { 'link': ['https://www.cbc.ca/news/canada/nova-scotia'] },
    "NWT": { 'link': ['https://www.cbc.ca/news/canada/north'] },
    "Yukon": { 'link': ['https://www.cbc.ca/news/canada/north'] },
    "Nunavut": { 'link': ['https://www.cbc.ca/news/canada/north'] }
}

function cases() {
    if($('.cases_link').hasClass("active") == false){
        $(".nav-link").removeClass("active");
        $(".cases_link").addClass("active");
        $(".tab").fadeOut()
        $(".cases").fadeIn()
        for (var a in province_list) {
            $("#province-select").append('<option value="' + province_list[a] + '">' + province_list[a] + '</option>')
        }
        $(".cases_mod").hide()
        mymap = L.map('mapid').setView([58.972, -97.486], 4);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/dark-v10',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZG9uYWxkem91IiwiYSI6ImNrOHN1M2JrZTBjZGEzbnI0amhzNG13dTYifQ.uTvTibSyi2lvdrbT4ipj4w'
        }).addTo(mymap);
        load_age_graph();
        load_gender_graph();
        load_news()
        setTimeout(function () {
            load_map()
        }, 500)
    }
}

function load_age_graph() {
    var ctx = document.getElementById("prov_chart");
    age_chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: "# of cases",
                data: [],
                borderWidth: 1,
                backgroundColor: '#17a2b8',
            }]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{

                    gridLines: {
                        color: 'rgba(255,255,255,0.2)'
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 80
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Ages"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(255,255,255,0.2)'
                    },
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "# of cases"
                    }
                }]
            }
        }
    });
    if ($("#province-select").val() == 'Canada'){
        var chart_label = Object.keys(age).sort()
        var data_label = age
        chart_label.splice(chart_label.indexOf("Not Reported"), 1)
        removeData(age_chart)
    }
    for (var n in chart_label) {
        age_chart.data.labels.push(chart_label[n])
        age_chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data_label[chart_label[n]]);
        });
        age_chart.update();
    }
}

function update_age_graph(){
    if ($("#province-select").val() != "Canada"){
        prov_age = {}
        for (var n in caseDict['count'][$("#province-select").val()]['cases']){
            if (prov_age[caseDict['count'][$("#province-select").val()]['cases'][n]['age']] == undefined){
                prov_age[caseDict['count'][$("#province-select").val()]['cases'][n]['age']] = 1
            }
            else{
                prov_age[caseDict['count'][$("#province-select").val()]['cases'][n]['age']]++
            }
        }
        var chart_label = Object.keys(prov_age).sort()
        var data_label = prov_age
        if (chart_label.includes("Not Reported") ){
            chart_label.splice(chart_label.indexOf("Not Reported"), 1)
        }
        removeData(age_chart)
    }
    else{
        var chart_label = Object.keys(age).sort()
        var data_label = age
        chart_label.splice(chart_label.indexOf("Not Reported"), 1)
        removeData(age_chart)
    }
    for (var n in chart_label) {
        age_chart.data.labels.push(chart_label[n])
        age_chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data_label[chart_label[n]]);
        });
        age_chart.update();
    }
}



function removeData(chart) {
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    chart.update();
}

function load_gender_graph() {
    var ctx = document.getElementById("gender_chart");
    var myChart2 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                label: "# of cases",
                data: [gender['Male'], gender['Female']],
                borderWidth: 1,
                backgroundColor: '#17a2b8',
            }]
        },
        options: {
            // responsive: true,
            scales: {
                xAxes: [{
                    barPercentage: 0.5,
                    gridLines: {
                        color: 'rgba(255,255,255,0.2)'
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 80
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Gender"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(255,255,255,0.2)'
                    },
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "# of cases"
                    }
                }]
            }
        }
    });
}


function load_news(){
    $('#twitter-container .carousel-inner').html('')
    $('#twitter-container .carousel-inner').html('')
    link_length = news_link[$("#province-select").val()]['link'].length
    for (var n = 0; n<link_length; n++){
        $('#twitter-container .carousel-indicators').append('<li data-target="#carouselExampleIndicators" data-slide-to="'+n+'" class="active"></li>')
        if (n == 0){
            $('#twitter-container .carousel-inner').append('<div class="carousel-item active"><iframe class="twi-iframe" src="'+news_link[$("#province-select").val()]['link'][n]+'"></iframe></div>')
        }
        else{
            $('#twitter-container .carousel-inner').append('<div class="carousel-item"><iframe class="twi-iframe" src="'+news_link[$("#province-select").val()]['link'][n]+'"></iframe></div>')
        }
        
    }
}


function load_map() {

    var list_data = [];


    if ($("#province-select").val() == 'Canada') {
        mymap.setView([58.972, -97.486], 4)
        for (var n in province_list) {
            if (province_list[n] == 'NWT') { var address = 'Northwest Territories Canada'; }
            else if (province_list[n] == 'PEI') { var address = 'Prince Edward Island Canada'; }
            else { var address = province_list[n] + ' Canada'; }
            temp_lat = $.ajax({
                type: "GET",
                url: 'https://nominatim.openstreetmap.org/search?format=json&q=' + address,
                dataType: 'text',
                async: false,
                success: function (data) {
                    list_data.push(JSON.parse(data))
                    var cur = list_data[list_data.length - 1][0]
                    prov_geocode[province_list[n]] = { 'lat': cur['lat'], 'lon': cur['lon'] }
                    var rad = caseDict['count'][province_list[list_data.length - 1]]['count'] * 40
                    var circle = L.circle([cur['lat'], cur['lon']], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: rad,

                    }).addTo(group1);
                    circle.bindPopup("<h5>" + province_list[list_data.length - 1] + "</h5><p>" + caseDict['count'][province_list[list_data.length - 1]]['count'] + " cases</p>")
                }
            })
        }
        mymap.addLayer(group1)
    }
    else {
        mymap.removeLayer(group1)
        group1 = L.featureGroup();
        var prov = {}
        for (var n in caseDict["count"][$("#province-select").val()]['cases']) {
            var current_case = caseDict["count"][$("#province-select").val()]['cases'][n]
            if (prov[current_case.health_region] == undefined) {
                prov[current_case.health_region] = 1
            }
            else {
                prov[current_case.health_region]++;
            }
        }

        var t = Object.keys(prov)
        for (var n in t) {
            if (t[n] != 'Not Reported'){
                if (t[n] == "PEI") {
                    t[n] = "Prince Edward Island"
                }
                if (t[n] == "NWT") {
                    t[n] = "Northwest Territories"
                }
                var temp = t[n]
                if ($("#province-select").val() == 'Nova Scotia' || $("#province-select").val() == 'New Brunswick') {
                    temp = temp.replace('Zone', '')
                    temp = temp.replace('-', '')
                    temp = temp.replace(/[0-9]/g, "")
                    temp = temp.replace('(','')
                    temp = temp.replace(')','')
                    temp = temp.replace(' area','')
                }
                var address = temp + ' ' + $("#province-select").val() + " Canada"
                temp_lat = $.ajax({
                    type: "GET",
                    url: 'https://geocoder.ls.hereapi.com/search/6.2/geocode.json?languages=en-US&maxresults=4&searchtext='+address+'&apiKey=1VOe2SSnYK_atMeC1iN-KrCYh_T9T8oqALHXPv_O0FE',
                    dataType: 'text',
                    async: false,
                    success: function (data) {
                        // list_data.push(JSON.parse(data))
                        var cur = JSON.parse(data)
                        console.log(cur)
                        cur = cur["Response"]["View"][0]["Result"][0]["Location"]['NavigationPosition'][0]
                        
                        console.log(address)
                        var rad = prov[t[n]] * 10
                        if (cur != undefined){
                            var circle = L.circle([cur['Latitude'], cur['Longitude']], {
                                color: 'red',
                                fillColor: '#f03',
                                fillOpacity: 0.5,
                                radius: rad,
        
                            }).addTo(group1);
                            circle.bindPopup("<h5>" + t[n] + "</h5><p>" + prov[t[n]] + " cases</p>")
                        }
                        else{
                            $.ajax({
                                type: "GET",
                                url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+address+'.json?access_token=pk.eyJ1IjoiZG9uYWxkem91IiwiYSI6ImNrOHN1M2JrZTBjZGEzbnI0amhzNG13dTYifQ.uTvTibSyi2lvdrbT4ipj4w',
                                dataType: 'text',
                                async: false,
                                success: function (data) {
                                   var result = JSON.parse(data)
                                   console.log(t[n])
                                   console.log(result['features'][0])
                                }
                            })
                        }
                    }
                })
            }
            
        }
        mymap.addLayer(group1)
        mymap.setView(new L.LatLng(prov_geocode[$("#province-select").val()]['lat'], prov_geocode[$("#province-select").val()]['lon']), 5);
        $(".spinner-cases").fadeOut()
        $("#mapid").fadeIn()
    }
    //--------------------------------
    $(".spinner-cases").fadeOut();
    $("#search-spinner").fadeOut();
    $(".cases_mod").fadeIn();
    $("#mapid").css("opacity",1)
    mymap.invalidateSize();
    //--------------------------------
}





$('#get_province').click(function () {
    $("#province_title").text($("#province-select").val())
    $(".map .card-header").text('Map | ' + $("#province-select").val() + ' Reported Cases')
    $(".age-table .card-header").text('Map | ' + $("#province-select").val() + ' Reported Cases Age Cumulative')
    $(".province_total_case .totalCases").text(custom_data[$("#province-select").val()]['today'] + ' cases in ' + $("#province-select").val())
    $(".province_total_case .compare_yesterday").text(custom_data[$("#province-select").val()]['new'] + ' New cases')
    $("#search-spinner").css('display','inline-block');
    // $(".cases_mod").fadeOut()

    
    
    
    update_age_graph();
    load_news();
    $("#mapid").css("opacity",0.3)
    setTimeout(function () {
        
        load_map()
    }, 1000)

})