
var caseDict = {"cases":[],"count":{}}
var report_dates = {}
var report_country_amount = []
var deathDict = {"cases":[]}
var recovDict = {}
var testDict = {}
var province_list;
var code = ["ON","BC","QC","AB","SK","MB","NB","PE","NL","RP","NS","NT","YT"]
var full_name = []
var total_Case = 0;
var total_Death = 0;

var today_Cases = 0;
var today_Death = 0;

var today_date = new Date();
var twoDigitMonth_today = ("0" + (today_date.getMonth() + 1)).slice(-2)
var twoDigitDay_today = ("0" + today_date.getDate()).slice(-2)
var today = twoDigitDay_today + "-" + twoDigitMonth_today + "-" + today_date.getFullYear();


var url = 'https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/update_time.txt';
var update_time;
var update_time_split;


province_dataset = [
    {
        label: 'Canada',
        data: report_country_amount,
        borderColor: "#FF5252",
        fill: false
    }
]


function color(amount){
    if (amount < 100){
        return "#FFAA00"
    }
    else if (amount >= 100 && amount < 500){
        return "#FF8100"
    }
    else if(amount >= 500 && amount < 1000){
        return "#FF5E00"
    }
    else if (amount >= 1000 && amount < 5000 ){
        return "#FF4E00"
    }
    else if (amount >= 5000 && amount < 10000){
        return "#FF0000"
    }
    else if (amount > 10000){
        return "#B90000"
    }
    
}



function getCases() {
    status = false
    casedata = $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/cases.csv",
        dataType: "text",
        success: function (data) {
            schedule_array = $.csv.toObjects(casedata.responseText)
            status = 'true';
            if (status == "true"){
                console.log(schedule_array.length)
                for(var i=0;i<schedule_array.length;i++){
                    current = schedule_array[i];
                    caseDict["cases"].push(current)
                    total_Case++;

                    if (report_dates[current.date_report] == undefined){
                        report_dates[current.date_report] = {"count":0,"province":{}}
                        report_dates[current.date_report]["count"]++;
                    }
                    else{
                        report_dates[current.date_report]["count"]++;
                    }
                    if (report_dates[current.date_report]["province"][current.province] == undefined){
                        report_dates[current.date_report]["province"][current.province] = 0;
                        report_dates[current.date_report]["province"][current.province]++;
                    }
                    else{
                        report_dates[current.date_report]["province"][current.province]++;
                    }


                    if (caseDict["count"][current.province] == undefined){
                        caseDict["count"][current.province] = 0
                        full_name.push(current.province)
                        caseDict["count"][current.province]++;
                    }
                    else{
                        caseDict["count"][current.province]++
                    }
                    if (current.date_report == update_time_split) {today_Cases++}
                }
            }
            $(".totalCases").text(total_Case);
            $(".compare_yesterday").text(today_Cases+" New cases")
            $(".today_date").text("Update Time: "+update_time)
            for (var i = 0; i < code.length; i++){
                current_code = code[i]
                if (current_code != "RP"){
                    var amount = caseDict['count'][full_name[i]]
                    var color_prov = color(amount) 
                    simplemaps_canadamap_mapdata['state_specific'][current_code]['description'] = amount +" cases";
                    simplemaps_canadamap_mapdata['state_specific'][current_code]['color'] = color_prov;
                    simplemaps_canadamap_mapdata['state_specific'][current_code]['hover_color'] = color_prov;
                    var width = $(window).width();
                    if (width <= 768){
                        simplemaps_canadamap_mapdata['main_settings']['width'] = 'responsive'
                    }
                    else{
                        simplemaps_canadamap_mapdata['main_settings']['width'] = '400'
                    }
                    
                }
            }
            //Chart start
            for( var n in Object.keys(report_dates)){
                if (n > 0){
                    report_country_amount.push(report_dates[Object.keys(report_dates)[n]]["count"]+report_country_amount[n-1])
                }
                else{report_country_amount.push(report_dates[Object.keys(report_dates)[n]]["count"])}
                
            }
            province_list = Object.keys(caseDict['count'])
            color_list = ["#C2185B","#E040FB",'#1976D2','#00BCD4','#4CAF50','#FF5722','#CDDC39','#616161','#607D8B','#FFC107','#FF9800','#303F9F','#E040FB','#5D4037']
            for (var n in province_list){
                var current_province = province_list[n]
                if (current_province != "Repatriated"){
                    var data_temp = {
                        label: current_province,
                        data:[],
                        borderColor: color_list[n],
                        fill: false
                    }
                    for (var k in Object.keys(report_dates)){
                        var current_date = Object.keys(report_dates)[k]
                        if(report_dates[current_date]['province'][current_province] != undefined){
                            if (k > 0){
                                data_temp['data'].push(report_dates[current_date]['province'][current_province]+data_temp["data"][k-1])
                            }
                            else{
                                data_temp['data'].push(report_dates[current_date]['province'][current_province])
                            }
                        }
                        else{
                            if (k > 0){
                                data_temp['data'].push(data_temp["data"][k-1])
                            }
                            else{data_temp['data'].push(0)}
                        }

                    }
                    province_dataset.push(data_temp)
                }
                
            }

            


            if (width <= 768){
                $(".myChartDiv").append('<canvas id="myChart" width="500" height="600"></canvas>')

            }
            else{$(".myChartDiv").append('<canvas id="myChart" width="500" height="200"></canvas>')}
            var ctx = document.getElementById("myChart");
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(report_dates),
                    datasets: province_dataset
                },
                options: {scales: {yAxes: [{ticks: {beginAtZero:true}}]}}
            });
            //Chart end

            //Initialize Map
            $("head").append('<script src="canadamap.js"></script>')
            
            

        }
    }
    )
};

function getDead() {
    status = false
    deathdata = $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/mortality.csv",
        dataType: "text",
        success: function (data) {
            deathArray = $.csv.toObjects(deathdata.responseText)
            status = 'true';
            if (status == "true"){
                console.log(deathArray.length)
                for(var i=0;i<deathArray.length;i++){
                    current = deathArray[i];
                    deathDict["cases"].push(current)
                    total_Death++;
                    date_death = current.date_death_report
                    
                    if (date_death == update_time_split) {
                        today_Death++;
                    }
                }
            }
            $(".totalDeath").text(total_Death);
            $(".compare_yesterday_death").text(today_Death+" New deaths")
        }
    }
    )
};

function getRecov() {
    status = false
    recovdata = $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/recovered_cumulative.csv",
        dataType: "text",
        success: function (data) {
            recovArray = $.csv.toObjects(recovdata.responseText)
            status = 'true';
            if (status == "true"){
                for(var i=0;i<recovArray.length;i++){
                    current = recovArray[i];
                    recov_date = current.date_recovered
                    if (recovDict[recov_date] == undefined){
                        recovDict[recov_date] = {"cases":[]}
                        recovDict[recov_date]["cases"].push(current)
                    }
                    else{
                        recovDict[recov_date]["cases"].push(current)
                    }
                }
                recov_today = 0
                today_key = Object.keys(recovDict)[0]
                recov_yesterday = 0
                yesterday_key = Object.keys(recovDict)[1]
                for (var i = 0; i < recovDict[today_key]["cases"].length;i++){
                    if (recovDict[today_key]["cases"][i]['cumulative_recovered'] != "NA"){
                        recov_today += parseInt(recovDict[today_key]["cases"][i]['cumulative_recovered'])
                    }
                    
                }
                for (var i = 0; i < recovDict[yesterday_key]["cases"].length;i++){
                    if(recovDict[yesterday_key]["cases"][i]['cumulative_recovered'] != 'NA'){
                        recov_yesterday += parseInt(recovDict[yesterday_key]["cases"][i]['cumulative_recovered'])
                    }
                    
                }
                $('.totalRecov').text(recov_today)
                $(".compare_yesterday_recov").text(recov_today-recov_yesterday +" New Recovered")
            }
        }
    }
    )
};

function getTested() {
    status = false
    testdata = $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/testing_cumulative.csv",
        dataType: "text",
        success: function (data) {
            testArray = $.csv.toObjects(testdata.responseText)
            status = 'true';
            if (status == "true"){
                for(var i=0;i<testArray.length;i++){
                    current = testArray[i];
                    test_date = current.date_testing
                    if (testDict[test_date] == undefined){
                        testDict[test_date] = {"cases":[]}
                        testDict[test_date]["cases"].push(current)
                    }
                    else{
                        testDict[test_date]["cases"].push(current)
                    }
                }
                test_today = 0
                today_key = Object.keys(testDict)[0]
                test_yesterday = 0
                yesterday_key = Object.keys(testDict)[1]
                for (var i = 0; i < testDict[today_key]["cases"].length;i++){
                    if (testDict[today_key]["cases"][i]['cumulative_testing'] != "NA"){
                        test_today += parseInt(recovDict[today_key]["cases"][i]['cumulative_testing'])
                    }
                    
                }
                for (var i = 0; i < testDict[yesterday_key]["cases"].length;i++){
                    if(testDict[yesterday_key]["cases"][i]['cumulative_testing'] != 'NA'){
                        test_yesterday += parseInt(testDict[yesterday_key]["cases"][i]['cumulative_testing'])
                    }
                    
                }
                $('.totalTest').text(test_today)
                $(".compare_yesterday_test").text(test_today-test_yesterday +" New Recovered")
            }
        }
    }
    )
};

fetch(url)
  .then(function(response) {
    response.text().then(function(text) {
        update_time = text;
        update_time_split = update_time.split("-")
        update_time_split[2] = update_time_split[2].split(" ")
        update_time_split = update_time_split[2][0] + "-" + update_time_split[1] + "-" + update_time_split[0]
        
        getDead();
        getRecov();
        getTested();
        getCases();
        
        
        $(".main").fadeIn();
    });
  });
