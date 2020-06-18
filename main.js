var caseDict = { "cases": [], "count": {} }
var report_dates = {}
var death_report = {}
var report_country_amount = []
var deathDict = { "cases": [], 'age': {}, 'gender': {}, "prov_gender": {}, "prov_age": {} }
var death_report_dates = {}
var recovDict = {}
var testDict = {}
var province_list;
var code = ["ON", "BC", "QC", "AB", "SK", "MB", "NB", "PE", "NL", "RP", "NS", "NT", "YT", "NU"]
var full_name = []
var province_data_list = []
var total_Case = 0;
var total_Death = 0;
var custom_data = {}
var today_Cases = 0;
var today_Death = 0;
var temp_l = {}
var temp_percent = {}
var label;
var main_chart;
var travel_history = {}
var graph_data = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
var global;
var prov_recov = {}
prov_geocode = {
    "Ontario": { "lat": 49.919, "lon": -84.737 },
    "BC": { "lat": 54.536, "lon": -126.557 },
    "Quebec": { "lat": 54.729, "lon": -68.413 },
    "Alberta": { "lat": 54.872, "lon": -115.003 },
    "Saskatchewan": { "lat": 54.873, "lon": -105.684 },
    "Manitoba": { "lat": 54.872, "lon": -95.485 },
    "New Brunswick": { "lat": 46.528, "lon": -66.378 },
    "PEI": { "lat": 46.514, "lon": -63.202 },
    "NL": { "lat": 54.019, "lon": -60.18 },
    "Nova Scotia": { "lat": 45.347, "lon": -63.043 },
    "NWT": { "lat": 65.736, "lon": -118.667 },
    "Yukon": { "lat": 65.260, "lon": -132.406 },
    "Nunavut": { "lat": 73.818, "lon": -90.099 }
}
var recov_today = 0;
var recov_yesterday = 0;

var test_today = 0;
var test_yesterday = 0;
var temp_prov_list;
var today_date = new Date();
var twoDigitMonth_today = ("0" + (today_date.getMonth() + 1)).slice(-2)
var twoDigitDay_today = ("0" + today_date.getDate()).slice(-2)
var today = twoDigitDay_today + "-" + twoDigitMonth_today + "-" + today_date.getFullYear();

var prov_age = {}
var prov_gender = {}
var url = 'https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/update_time.txt';
var update_time;
var update_time_split;
var group_national = L.featureGroup();
var age = {}
var gender = {}

var temp_list = [];

var mymap;


var geo_code = {}
var geo_temp;


province_dataset = [
    {
        label: 'Canada',
        data: report_country_amount,
        borderColor: "#FF5252",
        fill: false
    }
]

function ScrollTop() {
    $("html, body").animate({ scrollTop: 0 }, 500);
}


function main() {
    $(".tab").hide();
    $(".main").fadeIn();
    $(".search-bar").hide()
    $(".double_nav").hide()
}

function color(amount) {
    if (amount < 100) {
        return "#FFAA00"
    }
    else if (amount >= 100 && amount < 500) {
        return "#FF8100"
    }
    else if (amount >= 500 && amount < 1000) {
        return "#FF5E00"
    }
    else if (amount >= 1000 && amount < 5000) {
        return "#FF4E00"
    }
    else if (amount >= 5000 && amount < 10000) {
        return "#FF0000"
    }
    else if (amount > 10000) {
        return "#B90000"
    }

}
function thousands_separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}


function getCases() {
    $(".progress-bar").css("width","30%")
    status = false
    casedata = $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/cases.csv",
        dataType: "text",
        async: true,
        success: function (data) {
            schedule_array = $.csv.toObjects(casedata.responseText)
            status = 'true';
            if (status == "true") {
                for (var i in schedule_array) {
                    current = schedule_array[i];

                    caseDict["cases"].push(current)
                    total_Case++;


                    if (report_dates[current.date_report] == undefined) {
                        if (Object.keys(report_dates).length > 1) {
                            var last_dates = Object.keys(report_dates)[Object.keys(report_dates).length - 1].split('-')
                            last_dates = new Date(last_dates[2] + '-' + last_dates[1] + '-' + last_dates[0])
                            var current_date = current.date_report.split('-')
                            current_date = new Date(current_date[2] + '-' + current_date[1] + '-' + current_date[0])
                        }

                        report_dates[current.date_report] = { "count": 0, "province": {} }
                        report_dates[current.date_report]["count"]++;


                    }
                    else {
                        report_dates[current.date_report]["count"]++;
                    }
                    if (report_dates[current.date_report]["province"][current.province] == undefined) {

                        report_dates[current.date_report]["province"][current.province] = 0;
                        report_dates[current.date_report]["province"][current.province]++;
                    }
                    else {
                        report_dates[current.date_report]["province"][current.province]++;
                    }
                    if (caseDict["count"][current.province] == undefined) {
                        caseDict["count"][current.province] = { 'count': 0, 'cases': [] }
                        caseDict["count"][current.province]['cases'].push(current)
                        full_name.push(current.province)
                        caseDict["count"][current.province]['count']++;
                    }
                    else {
                        caseDict["count"][current.province]['count']++
                        caseDict["count"][current.province]['cases'].push(current)
                    }
                    if (current.date_report == update_time_split) { today_Cases++ }

                    if (age[current.age] == undefined) {
                        age[current.age] = 1;
                    }
                    else {
                        age[current.age]++;
                    }

                    if (gender[current.sex] == undefined) {
                        gender[current.sex] = 1;
                    }
                    else {
                        gender[current.sex]++;
                    }
                    if (travel_history[current.travel_history_country] == undefined) {
                        var temp = current.travel_history_country.split(', ')
                        for (var n in temp) {
                            travel_history[temp[n]] = 1;
                        }

                    }
                    else {
                        var temp = current.travel_history_country.split(', ')
                        for (var n in temp) {
                            travel_history[temp[n]]++;
                        }
                    }


                }
                if (full_name.includes("Nunavut") == false) {
                    caseDict['count']['Nunavut'] = { 'count': 0, 'cases': [] }
                    full_name.push("Nunavut")
                }
                
            }

            getRecov();

            for (var i = 0; i < code.length; i++) {
                current_code = code[i]
                if (current_code != "RP") {
                    var amount = caseDict['count'][full_name[i]]['count']
                    var color_prov = color(amount)
                    simplemaps_canadamap_mapdata['state_specific'][current_code]['description'] = thousands_separators(amount) + " cases";
                    simplemaps_canadamap_mapdata['state_specific'][current_code]['color'] = color_prov;
                    simplemaps_canadamap_mapdata['state_specific'][current_code]['hover_color'] = color_prov;
                    var width = $(window).width();
                    if (width <= 768) {
                        simplemaps_canadamap_mapdata['main_settings']['width'] = 'responsive'
                    }
                    else {
                        simplemaps_canadamap_mapdata['main_settings']['width'] = '400'
                    }

                }
            }

            //Chart start
            for (var n in Object.keys(report_dates)) {
                if (n > 0) {
                    report_country_amount.push(report_dates[Object.keys(report_dates)[n]]["count"] + report_country_amount[n - 1])
                }
                else { report_country_amount.push(report_dates[Object.keys(report_dates)[n]]["count"]) }

            }
            province_list = Object.keys(caseDict['count'])
            province_list.splice(province_list.indexOf('Repatriated'), 1)
            color_list = ['#00bcd4', '#009688', '#259b24', '#8bc34a', '#ffc107', '#ff9800', '#ff5722', "#ffffff", "#e91e63", '#9c27b0', '#673ab7', '#3f51b5', '#5677fc', '#03a9f4']
            for (var n in province_list) {
                var current_province = province_list[n]
                if (current_province != "Repatriated") {
                    var data_temp = {
                        label: current_province,
                        data: [],
                        borderColor: color_list[n],
                        fill: false
                    }
                    for (var k in Object.keys(report_dates)) {
                        var current_date = Object.keys(report_dates)[k]
                        if (report_dates[current_date]['province'][current_province] != undefined) {
                            if (k > 0) {
                                data_temp['data'].push(report_dates[current_date]['province'][current_province] + data_temp["data"][k - 1])
                            }
                            else {
                                data_temp['data'].push(report_dates[current_date]['province'][current_province])
                            }
                        }
                        else {
                            if (k > 0) {
                                data_temp['data'].push(data_temp["data"][k - 1])
                            }
                            else { data_temp['data'].push(0) }
                        }
                    }
                    province_dataset.push(data_temp)
                }

            }
            if (width <= 768) {
                $(".myChartDiv").append('<canvas id="myChart" width="500" height="800"></canvas><p style="text-align: right;font-size:10px">*Click province name can show/hide on the graph</p>')

            }
            else {
                $(".myChartDiv").append('<canvas id="myChart"></canvas><p style="text-align: right; font-size:10px">*Click province name can show/hide on the graph</p>');
            }
            var ctx = document.getElementById("myChart");
            Chart.defaults.global.defaultFontColor = 'white';
            label = Object.keys(report_dates)
            for (var i in label) {
                var t = label[i].split('-')
                label[i] = t[2] + '-' + t[1] + '-' + t[0]
            }
            label.sort()
            main_chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: label,
                    datasets: province_dataset
                },

                options: {
                    responsive: true,
                    scales: {
                        yAxes: [{
                            gridLines: {
                                color: 'rgba(255,255,255,0.2)'
                            },
                            ticks: {
                                beginAtZero: true,
                                fontColor: 'white'
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Cases"
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: "white"
                            },
                            gridLines: {
                                color: 'rgba(255,255,255,0.2)'
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Dates"
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
            //Chart end

            //Initialize Map
            var width = $(window).width();
            var nation = L.map('nation_map').setView([57.133, -95.455], 3);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/dark-v10',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiZG9uYWxkem91IiwiYSI6ImNrOHN1M2JrZTBjZGEzbnI0amhzNG13dTYifQ.uTvTibSyi2lvdrbT4ipj4w'
            }).addTo(nation);
            for (var n in province_list) {
                var rad = caseDict['count'][province_list[n]]['count'] * 30
                var circle = L.circle([prov_geocode[province_list[n]]['lat'], [prov_geocode[province_list[n]]['lon']]], {
                    color: color_list[n],
                    fillColor: color_list[n],
                    fillOpacity: 0.5,
                    radius: rad
                }).addTo(group_national);
                circle.bindPopup("<h5>" + province_list[n] + "</h5><h6>" + thousands_separators(caseDict['count'][province_list[n]]['count']) + " cases</h6>")
            }

            nation.addLayer(group_national)
            $("#nation_map").fadeIn()
            nation.invalidateSize();
        }
    }
    )
};

function getDead() {
    $(".progress-bar").css("width","80%")
    status = false
    deathdata = $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/mortality.csv",
        dataType: "text",
        success: function (data) {
            deathArray = $.csv.toObjects(deathdata.responseText)
            status = 'true';
            if (status == "true") {
                for (var i = 0; i < deathArray.length; i++) {
                    current = deathArray[i];
                    deathDict["cases"].push(current)
                    total_Death++;
                    date_death = current.date_death_report
                    if (date_death == update_time_split) {
                        today_Death++;
                    }

                    if (death_report_dates[date_death] == undefined) {
                        death_report_dates[date_death] = { 'province': {} }
                    }
                    if (death_report_dates[date_death]['province'][current.province] == undefined) {
                        death_report_dates[date_death]['province'][current.province] = 1
                    }
                    else {
                        death_report_dates[date_death]['province'][current.province]++
                    }
                    if (death_report_dates[date_death]['count'] == undefined) {
                        death_report_dates[date_death]['count'] = 1
                    }
                    else {
                        death_report_dates[date_death]['count']++
                    }
                    //Prov death age
                    if (deathDict.prov_gender[current.province] == undefined) {
                        deathDict.prov_gender[current.province] = {}
                    }
                    if (deathDict.prov_gender[current.province][current.sex] == undefined) {
                        deathDict.prov_gender[current.province][current.sex] = 1
                    }
                    else {
                        deathDict.prov_gender[current.province][current.sex]++
                    }
                    //Prov death gender
                    if (deathDict.prov_age[current.province] == undefined) {
                        deathDict.prov_age[current.province] = {}
                    }
                    if (deathDict.prov_age[current.province][current.age] == undefined) {
                        deathDict.prov_age[current.province][current.age] = 1
                    }
                    else {
                        deathDict.prov_age[current.province][current.age]++
                    }

                }

            }
            $(".totalDeath").text(thousands_separators(total_Death));
            $(".compare_yesterday_death").text(thousands_separators(today_Death) + " New deaths")

            //Handle Table
            for (var k in province_dataset) {
                var num = parseInt(k) + 1
                var current_province_name = province_dataset[k]['label']
                var case_length = province_dataset[k]['data'].length
                var case_today = province_dataset[k]['data'][case_length - 1]
                var case_new = case_today - province_dataset[k]['data'][case_length - 2]

                var death_today = 0
                var death_new = 0

                var recov_today_province = 0
                var recov_new_province = 0

                var tested_today = 0
                var tested_new = 0

                if (current_province_name == 'Canada') {
                    death_today = thousands_separators(total_Death)
                    death_new = thousands_separators(today_Death)
                    recov_today_province = thousands_separators(recov_today)
                    recov_new_province = thousands_separators(recov_today - recov_yesterday)
                    tested_today = thousands_separators(test_today)
                    tested_new = thousands_separators(test_today - test_yesterday)
                }
                else {
                    temp_list = Object.keys(death_report_dates)
                    var data_list = []
                    for (var a in temp_list) {
                        if (death_report_dates[temp_list[a]]['province'][current_province_name] != undefined) {
                            if (a > 0) {
                                data_list.push(data_list[a - 1] + parseInt(death_report_dates[temp_list[a]]['province'][current_province_name]))
                            }
                            else {
                                data_list.push(parseInt(death_report_dates[temp_list[a]]['province'][current_province_name]))
                            }
                        }
                        else {
                            if (a > 0) {
                                data_list.push(data_list[a - 1])
                            }
                            else {
                                data_list.push(0)
                            }
                        }
                    }

                    temp_list = Object.keys(recovDict);
                    for (var a in recovDict[temp_list[0]]['cases']) {
                        if (current_province_name == recovDict[temp_list[0]]['cases'][a]['province']) {
                            recov_today_province = parseInt(recovDict[temp_list[0]]['cases'][a]['cumulative_recovered'])
                        }
                    }
                    for (var a in recovDict[temp_list[1]]['cases']) {
                        if (current_province_name == recovDict[temp_list[0]]['cases'][a]['province']) {
                            recov_new_province = recov_today_province - parseInt(recovDict[temp_list[1]]['cases'][a]['cumulative_recovered'])
                        }
                    }
                    temp_list = Object.keys(testDict)
                    for (var a in testDict[temp_list[0]]['cases']) {
                        if (current_province_name == testDict[temp_list[0]]['cases'][a]['province']) {
                            tested_today = parseInt(testDict[temp_list[0]]['cases'][a]['cumulative_testing'])
                        }
                    }
                    for (var a in testDict[temp_list[1]]['cases']) {
                        if (current_province_name == testDict[temp_list[1]]['cases'][a]['province']) {
                            tested_new = thousands_separators(tested_today - parseInt(testDict[temp_list[1]]['cases'][a]['cumulative_testing']))
                        }
                    }

                    death_today = data_list[data_list.length - 1]
                    death_new = thousands_separators(death_today - data_list[data_list.length - 2])
                    death_today = thousands_separators(death_today)

                }
                var temp_html = '<tr><td class="table_province_name">' + current_province_name + '</td><td class="table_province_cases">' + thousands_separators(case_today) + '</td><td class="table_province_new_cases">' + thousands_separators(case_new) + '</td><td class="table_province_new_cases">' + thousands_separators(death_today) + '</td><td class="table_province_new_cases">' + thousands_separators(death_new) + '</td></td><td class="table_province_new_cases">' + thousands_separators(recov_today_province) + '</td></td><td class="table_province_new_cases">' + thousands_separators(recov_new_province) + '</td></td><td class="table_province_new_cases">' + thousands_separators(tested_today) + '</td></td><td class="table_province_new_cases">' + thousands_separators(tested_new) + '</td></tr>'
                custom_data[current_province_name] = { 'today': case_today, 'new': case_new }
                $(".table_body").append(temp_html)
            }
            setTimeout(function () {
                $.ajax({
                    url: "https://api.covid19api.com/summary",
                    dataType: 'json',
                    async: true,
                    success: function (data) {
                        setTimeout(function (){
                            $(".progress").fadeOut();
                        },300)
                        global = data;
                        $(".spinner-global").fadeOut();
                        $("#TotalConfirmed").append(thousands_separators(global.Global.TotalConfirmed));
                        $("#TotalDeaths").append(thousands_separators(global.Global.TotalDeaths));
                        $("#TotalRecovered").append(thousands_separators(global.Global.TotalRecovered));
                        $(".NewConfirmed").append(thousands_separators(global.Global.NewConfirmed) + " New Confirmed");
                        $(".NewDeaths").append(thousands_separators(global.Global.NewDeaths) + " New Deaths");
                        $(".NewRecovered").append(thousands_separators(global.Global.NewRecovered) + " New Recovered")
                    },
                    error: function(request, status, error){
                        console.log(status)
                    }
                });
            },1000)
            $(".progress-bar").css("width","100%")
            $(".spinner-loader").fadeOut();
            $(".totalCases").text(thousands_separators(total_Case));
            $(".compare_yesterday").text(thousands_separators(today_Cases) + " New cases")
            $(".today_date").text("Update Time: " + update_time)
        }
    }
    )
};

function getRecov() {
    $(".progress-bar").css("width","50%")
    status = false
    recovdata = $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/recovered_cumulative.csv",
        dataType: "text",
        async: true,
        success: function (data) {
            recovArray = $.csv.toObjects(recovdata.responseText)
            status = 'true';
            if (status == "true") {
                for (var i = 0; i < recovArray.length; i++) {
                    current = recovArray[i];
                    recov_date = current.date_recovered
                    if (recovDict[recov_date] == undefined) {
                        recovDict[recov_date] = { "cases": [] }
                        recovDict[recov_date]["cases"].push(current)
                    }
                    else {
                        recovDict[recov_date]["cases"].push(current)
                    }

                    
                }
                recov_today = 0
                today_key = Object.keys(recovDict)[0]
                recov_yesterday = 0
                yesterday_key = Object.keys(recovDict)[1]
                for (var i = 0; i < recovDict[today_key]["cases"].length; i++) {
                    if (recovDict[today_key]["cases"][i]['cumulative_recovered'] != "NA") {
                        recov_today += parseInt(recovDict[today_key]["cases"][i]['cumulative_recovered'])
                    }
                    var prov_n = recovDict[today_key]["cases"][i]['province']
                    if (prov_recov[prov_n] == undefined){
                        prov_recov[prov_n] = parseInt(recovDict[today_key]["cases"][i]['cumulative_recovered'])
                    }

                }
                for (var i = 0; i < recovDict[yesterday_key]["cases"].length; i++) {
                    if (recovDict[yesterday_key]["cases"][i]['cumulative_recovered'] != 'NA') {
                        recov_yesterday += parseInt(recovDict[yesterday_key]["cases"][i]['cumulative_recovered'])
                    }

                }
                $('.totalRecov').text(thousands_separators(recov_today))
                $(".compare_yesterday_recov").text(thousands_separators(recov_today - recov_yesterday) + " New Recovered")
                getTested();
            }
        }
    }
    )
};

function getTested() {
    $(".progress-bar").css("width","70%")
    status = false
    testdata = $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/testing_cumulative.csv",
        dataType: "text",
        async: true,
        success: function (data) {
            testArray = $.csv.toObjects(testdata.responseText)
            status = 'true';
            if (status == "true") {
                for (var i = 0; i < testArray.length; i++) {
                    current = testArray[i];
                    test_date = current.date_testing
                    if (testDict[test_date] == undefined) {
                        testDict[test_date] = { "cases": [] }
                        testDict[test_date]["cases"].push(current)
                    }
                    else {
                        testDict[test_date]["cases"].push(current)
                    }
                }
                test_today = 0
                test_today_key = Object.keys(testDict)[0]
                test_yesterday = 0
                test_yesterday_key = Object.keys(testDict)[1]
                for (var i = 0; i < testDict[test_today_key]["cases"].length; i++) {
                    var current_tested = parseInt(testDict[test_today_key]["cases"][i][['cumulative_testing']])
                    if (current_tested != "NA") {
                        test_today = test_today + current_tested
                    }
                }
                for (var i = 0; i < testDict[test_yesterday_key]["cases"].length; i++) {
                    if (testDict[test_yesterday_key]["cases"][i]['cumulative_testing'] != 'NA') {
                        test_yesterday += parseInt(testDict[test_yesterday_key]["cases"][i]['cumulative_testing'])
                    }
                }
                $('.totalTest').text(thousands_separators(test_today))
                $(".compare_yesterday_test").text(thousands_separators(test_today - test_yesterday) + " New Tested")
                getDead();
            }
        }
    }
    )
};

fetch(url)
    .then(function (response) {
        response.text().then(function (text) {
            update_time = text;
            update_time_split = update_time.split("-")
            update_time_split[2] = update_time_split[2].split(" ")
            update_time_split = update_time_split[2][0] + "-" + update_time_split[1] + "-" + update_time_split[0]
            getCases();
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
            });
        });
    });



$(document).ready(function () {
    $(".tab").hide()
    main();
})
