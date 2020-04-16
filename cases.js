var temp_lat;

var longtitude;

var prov_geocode = {}
var group1 = L.featureGroup();



function cases() {
    $(".nav-link").removeClass("active");
    $(".cases-link").addClass("active");



    $(".tab").fadeOut()
    $(".cases").fadeIn()
    for (var a in province_list) {
        $("#province-select").append('<option value="' + province_list[a] + '">' + province_list[a] + '</option>')
    }

    $("#mapid").hide()
    $("#prov_chart").hide()
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
    setTimeout(function () {
        load_map()
    }, 500)
}

function load_age_graph(){
    var ctx = document.getElementById("prov_chart");
    var chart_label = Object.keys(age)
    chart_label.splice(chart_label.indexOf("Not Reported"), 1)
    var chart_data = []
    for (var n in chart_label) {
        chart_data.push(age[chart_label[n]])
    }
    var myChart1 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chart_label,
            datasets: [{
                label: "# of cases",
                data: chart_data,
                borderWidth: 1,
                backgroundColor: '#17a2b8',
            }]
        },
        options: {
            // responsive: true,
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

        console.log(prov)
        var t = Object.keys(prov)
        for (var n in t) {

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
            }
            var address = temp + ' ' + $("#province-select").val() + " Canada"
            console.log(address)
            temp_lat = $.ajax({
                type: "GET",
                url: 'https://nominatim.openstreetmap.org/search?format=json&q=' + address,
                dataType: 'text',
                async: false,
                success: function (data) {
                    list_data.push(JSON.parse(data))
                    var cur = list_data[list_data.length - 1][0]
                    var rad = prov[t[n]] * 10
                    var circle = L.circle([cur['lat'], cur['lon']], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: rad,

                    }).addTo(group1);
                    circle.bindPopup("<h5>" + t[n] + "</h5><p>" + prov[t[n]] + " cases</p>")
                }
            })
        }
        mymap.addLayer(group1)
        mymap.setView(new L.LatLng(prov_geocode[$("#province-select").val()]['lat'], prov_geocode[$("#province-select").val()]['lon']), 5);
        $(".spinner-cases").fadeOut()
        $("#mapid").fadeIn()
    }

    $(".spinner-cases").fadeOut()
    $("#mapid").fadeIn();
    $("#prov_chart").fadeIn();
    mymap.invalidateSize();
}


$('#get_province').click(function () {
    $("#province_title").text($("#province-select").val())
    $(".map .card-header").text('Map | ' + $("#province-select").val() + ' Reported Cases')
    $(".age-table .card-header").text('Map | ' + $("#province-select").val() + ' Reported Cases Age Cumulative')
    $(".province_total_case .totalCases").text(custom_data[$("#province-select").val()]['today'] + ' cases in ' + $("#province-select").val())
    $(".province_total_case .compare_yesterday").text(custom_data[$("#province-select").val()]['new'] + ' New cases')
    $(".spinner-cases").fadeIn()
    $("#mapid").fadeOut()
    $("#prov_chart").fadeOut()
    setTimeout(function () {
        load_map()
    }, 500)

})