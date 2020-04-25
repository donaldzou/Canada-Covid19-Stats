var temp_lat;
var longtitude;

var local_geocode = {}
var group_local = L.featureGroup();
var age_chart;
var gen_chart;
var geo_code = {}
var geo_temp;
var screen_width = $(window).width()
var region_dataset = [];
var region_data = {};
var region_chart;




function cases() {
    if ($('.cases_link').hasClass("active") == false) {
        if ($(".cases").hasClass('loaded')){
            $(".nav-link").removeClass("active");
            $(".cases_link").addClass("active");
            $(".tab").fadeOut()
            $(".cases").fadeIn()
        }
        else{
        $(".cases").addClass("loaded")
        $.ajax({
            type: "GET",
            url: "https://raw.githubusercontent.com/sitrucp/canada_covid_health_regions/master/health_regions_lookup.csv",
            dataType: "text",
            success: function (data) {
                geo_temp = $.csv.toObjects(data)
                for (var n in geo_temp) {
                    if (geo_code[geo_temp[n]['province']] == undefined) {
                        geo_code[geo_temp[n]['province']] = {}
                    }
                    geo_code[geo_temp[n]['province']][geo_temp[n]['statscan_arcgis_health_region']] = geo_temp[n]['authority_report_health_region']
                }
            }
        })
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
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/dark-v10',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZG9uYWxkem91IiwiYSI6ImNrOHN1M2JrZTBjZGEzbnI0amhzNG13dTYifQ.uTvTibSyi2lvdrbT4ipj4w'
        }).addTo(mymap);
        $.ajax({
            type: "GET",
            url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/timeseries_hr/cases_timeseries_hr.csv",
            dataType: "text",
            async: false,
            success: function (data) {
                var temp = $.csv.toObjects(data)
                for (var n in temp){
                    if (region_data[temp[n]['province']] == undefined){
                        region_data[temp[n]['province']] = {}
                    }
                    if (region_data[temp[n]['province']][temp[n]['health_region']] == undefined){
                        region_data[temp[n]['province']][temp[n]['health_region']] = {}
                    }
                    region_data[temp[n]['province']][temp[n]['health_region']][temp[n]['date_report']] = temp[n]['cumulative_cases']
                    
                }
                
            }
        })
        load_age_graph();
        load_gender_graph();
        load_region_graph()
        setTimeout(function () {
            load_map()
        }, 500)
    }
}
}

function load_age_graph() {
    if (screen_width <= 768) {
        $(".age-table .card-body").append('<canvas id="prov_chart" class="cases_mod" width="500" height="400"></canvas><p class="graph_note" style="text-align: right; font-size:10px"></p>')
    }
    else {
        $(".age-table .card-body").append('<canvas id="prov_chart" class="cases_mod" width="500" height="200"></canvas><p class="graph_note" style="text-align: right; font-size:10px"></p>')
    }
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
    if ($("#province-select").val() == 'Canada') {
        var chart_label = Object.keys(age).sort()
        var data_label = age
        $(".age-table .graph_note").text('*' + data_label['Not Reported'] + ' cases not reported.')
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

function update_age_graph() {
    if ($("#province-select").val() != "Canada") {
        prov_age = {}
        for (var n in caseDict['count'][$("#province-select").val()]['cases']) {
            if (prov_age[caseDict['count'][$("#province-select").val()]['cases'][n]['age']] == undefined) {
                prov_age[caseDict['count'][$("#province-select").val()]['cases'][n]['age']] = 1
            }
            else {
                prov_age[caseDict['count'][$("#province-select").val()]['cases'][n]['age']]++
            }
        }
        var chart_label = Object.keys(prov_age).sort()
        var data_label = prov_age
        $(".age-table .graph_note").text('*' + data_label['Not Reported'] + ' cases not reported.')
        if (chart_label.includes("Not Reported")) {
            chart_label.splice(chart_label.indexOf("Not Reported"), 1)
        }
        removeData(age_chart)
    }
    else {
        var chart_label = Object.keys(age).sort()
        var data_label = age
        $(".age-table .graph_note").text('*' + data_label['Not Reported'] + ' cases not reported.')
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
    if (screen_width <= 768) {
        $(".gender-table .card-body").append('<canvas id="gender_chart" class="cases_mod" width="500" height="400"></canvas><p class="graph_note" style="text-align: right; font-size:10px"></p>')
    }
    else {
        $(".gender-table .card-body").append('<canvas id="gender_chart" class="cases_mod" width="500" height="200"></canvas><p class="graph_note" style="text-align: right; font-size:10px"></p>')
    }
    var ctx = document.getElementById("gender_chart");
    gen_chart = new Chart(ctx, {
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
    if ($("#province-select").val() == 'Canada') {
        removeData(gen_chart)
        var gen = ['Male', 'Female']
        $(".gender-table .graph_note").text('*' + gender['Not Reported'] + ' cases not reported.')
        for (var n in gen) {
            gen_chart.data.labels.push(gen[n])
            gen_chart.data.datasets.forEach((dataset) => {
                dataset.data.push(gender[gen[n]]);
            });
            gen_chart.update();
        }
    }
}


function update_gender_graph() {
    if ($("#province-select").val() == 'Canada') {
        removeData(gen_chart)
        var gen = ['Male', 'Female']
        $(".gender-table .graph_note").text('*' + gender['Not Reported'] + ' cases not reported.')
        for (var n in gen) {
            gen_chart.data.labels.push(gen[n])
            gen_chart.data.datasets.forEach((dataset) => {
                dataset.data.push(gender[gen[n]]);
            });
            gen_chart.update();
        }
    }
    else {
        prov_gender = {}
        removeData(gen_chart)
        for (var n in caseDict['count'][$("#province-select").val()]['cases']) {
            if (prov_gender[caseDict['count'][$("#province-select").val()]['cases'][n]['sex']] == undefined) {
                prov_gender[caseDict['count'][$("#province-select").val()]['cases'][n]['sex']] = 1
            }
            else {
                prov_gender[caseDict['count'][$("#province-select").val()]['cases'][n]['sex']]++
            }
        }
        var gen = ['Male', 'Female']
        $(".gender-table .graph_note").text('*' + prov_gender['Not Reported'] + ' cases not reported.')
        for (var n in gen) {
            gen_chart.data.labels.push(gen[n])
            gen_chart.data.datasets.forEach((dataset) => {
                dataset.data.push(prov_gender[gen[n]]);
            });
            gen_chart.update();
        }

    }
}

var geo;
var prov;
function load_map() {
    var list_data = [];
    if ($("#province-select").val() == 'Canada') {
        var width = $(window).width();
        if (width <= 768) {
            mymap.setView([57.133, -95.455], 3)
        }
        else {
            mymap.setView([57.133, -95.455], 4)
        }

        mymap.addLayer(group_national)
        mymap.removeLayer(group_local)
        $(".region_table").fadeOut()
    }
    else {
        mymap.removeLayer(group_local)
        mymap.removeLayer(group_national)
        group_local = L.featureGroup();

        prov = {}
        for (var n in caseDict["count"][$("#province-select").val()]['cases']) {
            var current_case = caseDict["count"][$("#province-select").val()]['cases'][n]
            if (prov[current_case.health_region] == undefined) {
                prov[current_case.health_region] = 1
            }
            else {
                prov[current_case.health_region]++;
            }
        }

        $.ajax({
            type: "GET",
            url: "geo_data/" + $("#province-select").val() + '.json',
            dataType: "text",
            async: false,
            success: function (data) {
                geo = JSON.parse(data)
                for (var n in geo["features"]) {
                    if (prov[geo_code[$("#province-select").val()][geo["features"][n]["properties"]["ENG_LABEL"]]] == undefined) {
                        geo["features"][n]["properties"]["AMOUNT"] = '0'
                        geo["features"][n]["properties"]["AMOUNT_INT"] = 0
                        geo["features"][n]["properties"]["NAME"] = geo_code[$("#province-select").val()][geo["features"][n]["properties"]["ENG_LABEL"]]
                    }
                    else {
                        geo["features"][n]["properties"]["AMOUNT"] = prov[geo_code[$("#province-select").val()][geo["features"][n]["properties"]["ENG_LABEL"]]].toString();
                        geo["features"][n]["properties"]["AMOUNT_INT"] = prov[geo_code[$("#province-select").val()][geo["features"][n]["properties"]["ENG_LABEL"]]]
                        geo["features"][n]["properties"]["NAME"] = geo_code[$("#province-select").val()][geo["features"][n]["properties"]["ENG_LABEL"]]
                    }
                }
                L.geoJSON(geo, {
                    style: function (feature) {
                        return {
                            color: getColor(feature.properties.AMOUNT_INT),
                            fillOpacity: 0.3,
                            weight: 1
                        };
                    }
                }).bindPopup(function (layer) {
                    var str = "<h4>" + layer.feature.properties.NAME + "</h4><h6>" + layer.feature.properties.AMOUNT + " cases</h6>"
                    return str;
                }).addTo(group_local);
            }
        })
        mymap.addLayer(group_local)
        mymap.setView(new L.LatLng(prov_geocode[$("#province-select").val()]['lat'], prov_geocode[$("#province-select").val()]['lon']), 5);
        $(".spinner-cases").fadeOut()
        $("#mapid").fadeIn()
        load_table()
        $(".region_table").fadeIn()


    }
    //--------------------------------
    $(".spinner-cases").fadeOut();
    $("#search-spinner").fadeOut();
    $(".cases_mod").fadeIn();
    $("#mapid").css("opacity", 1)
    mymap.invalidateSize();
    //--------------------------------
}



function getColor(n) {
    return n > 3000 ? '#B90000'
        : n > 2000 ? '#FF0000'
        : n > 1000 ? '#FF4E00'
        : n > 500 ? '#FF5E00'
        : n > 250 ? '#FF8100'
        : n > 100 ? '#FFAA00'
        : n > 50 ? '#FFAA00'
        : n > 10 ? '#FFAA00'
        : n > -1 ? '#ffffff'
        : '#ffffff';
}


function load_table() {
    if ($("#province-select").val() != "Canada") {
        $(".region_table tbody").html('');
        var l = Object.keys(prov).sort()
        for (var n in l) {
            $(".region_table tbody").append('<tr><td scope="row">' + l[n] + '</td><td>' + prov[l[n]] + '</td></tr>')
        }
    }
}

function load_region_graph(){
    

    region_dataset = province_dataset
    region_dataset.shift()
    var ctx = document.getElementById("regionChart");
    region_chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        responsive: true,
        options: {
            scales: {
                yAxes: [{
                    gridLines:{
                        color:'rgba(255,255,255,0.2)'
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'white'
                    },
                    scaleLabel:{
                        display: true,
                        labelString:"Cases"
                    }
                }],
                xAxes: [{   
                    ticks: {
                        fontColor: "white"
                    },
                    gridLines:{
                        color:'rgba(255,255,255,0.2)'
                    },
                    scaleLabel:{
                        display:true,
                        labelString:"Dates"
                    }
                }]
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white'
                }
            },  
        }
    });
    if ($("#province-select").val() == 'Canada'){
        region_chart.data.labels = label
        region_chart.data.datasets = region_dataset
        region_chart.update();
    }  
}

function update_region_graph(){
    if ($("#province-select").val() == 'Canada'){
        region_chart.data.labels = label
        region_chart.data.datasets = province_dataset
        region_chart.update();
    } 
    else{
        var region_label = Object.keys(region_data['Ontario']['Toronto'])
        region_dataset = []
        var current_data = region_data[$("#province-select").val()]

        for (var n in Object.keys(current_data)){
            if (Object.keys(current_data)[n] != 'Not Reported'){
                var current_region = current_data[Object.keys(current_data)[n]]
                var region_temp = {
                    label: Object.keys(current_data)[n],
                    data:[],
                    borderColor: '#'+Math.floor(Math.random()*16777215).toString(16),
                    fill: false
                }
                for (var a in Object.keys(current_region)){
                    region_temp.data.push(current_region[Object.keys(current_region)[a]])
                }
                region_dataset.push(region_temp)
            }
            
        }
        region_chart.data.labels = region_label
        region_chart.data.datasets = region_dataset
        region_chart.update()
    }
}

$('#get_province').click(function () {
    $("#province_title").text($("#province-select").val())
    $(".map .card-header").text('Map | ' + $("#province-select").val() + ' Reported Cases')
    $(".age-table .card-header").text('Map | ' + $("#province-select").val() + ' Reported Cases Age Cumulative')
    $(".province_total_case .totalCases").text(custom_data[$("#province-select").val()]['today'] + ' cases in ' + $("#province-select").val())
    $(".province_total_case .compare_yesterday").text(custom_data[$("#province-select").val()]['new'] + ' New cases')
    $("#search-spinner").css('display', 'inline-block');
    $(".region_table .card-header").html('Table | ' + $("#province-select").val() + ' Health Regions Cases<i class="fas fa-times" aria-hidden="true"></i>')
    close_button()
    update_region_graph()
    update_age_graph();
    update_gender_graph();
    $("#mapid").css("opacity", 0.3)
    setTimeout(function () {
        load_map()
    }, 500)
})

function close_button() {
    $(".fas.fa-times").click(function () {
        if ($(this).parent().parent().find(".card-body").css('display') == 'none') {
            $(this).parent().parent().find(".card-body").fadeIn()
            $(this).css('transform', 'rotate(0deg)')
        }
        else {
            $(this).parent().parent().find(".card-body").fadeOut()
            $(this).css('transform', 'rotate(135deg)')
        }

    });
}



