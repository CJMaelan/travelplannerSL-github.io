//const api_url = "http://api.sl.se/api2/typeahead.json?key=2923c1bf60c54b93aebcfa27656446a4&searchstring=blackeberg&stationsonly=true&maxresults=5";
const locationApiKey = "2923c1bf60c54b93aebcfa27656446a4";
const realTimeInfoApiKey = "6e9c27b3666d4b0bbd4057e1c06810e2";
const searchButton = document.getElementById('searchBtnFrom');
const searchButton1 = document.getElementById('searchBtnResults');
const textInput = document.getElementById('inputTextBox');
const searchResults = document.getElementById('searchOutputList');
const searchResultsInfo = document.getElementById('searchOutputTable');
const clearDataButton = document.getElementById('clearEverything');
var stationId = "";
var int, timer, btn = document.getElementById('searchBtnResults');

//fetchar in API:et med API nyckeln samt textInput:en ifrån användaren som jag nu har satt till 1 resultat
//till för att enbart visa avgångar ifrån en station.
//laddas därefter in i JSON som laddar in den i destinationData parametern som sedan används av
//funktionen showStations
function getStations(textInput, searchResults, list) 
{    
fetch('https://api.sl.se/api2/typeahead.json?key=' + locationApiKey + '&searchstring=' + textInput + '&stationsonly=true&maxresults=1')
.then((response) => response.json())
.then((destinationData) => {
    showStations(destinationData, searchResults, list);
   })
}

//funktion som skapar upp element för att visa namnet på platsen samt SiteID:et som göms undan
//läggs in i listan searchResults
function showStations(destinationData, searchResults){
    
    for(let i in destinationData.ResponseData){
        const createEl = document.createElement('li');
        const hiddenValue = document.createElement('input');
        hiddenValue.type = "hidden";

        hiddenValue.value = destinationData.ResponseData[i].SiteId;

        createEl.textContent = destinationData.ResponseData[i].Name;
        searchResults.appendChild(hiddenValue);
        searchResults.appendChild(createEl);
        
        stationId = hiddenValue;
        console.log(stationId);
    }
    
    
}

//Använder Realtids API:et för att visa avgångar ifrån stationen användaren har sökt efter genom att använda
//sig av ID:et på stationen. Hämtar datan och gör den till json som slängs in i ett objekt, som vi sedan går igenom för
//att kolla information som transporttyp, destination, tid till avgång och linje/bussnr. 
//för varje fordon så skapas en ny array som använder sig av tidigare nämnd information
//sedan presenteras information i form av <tr>
function timeDepartures(stationId){

    fetch('https://api.sl.se/api2/realtimedeparturesV4.json?key='+ realTimeInfoApiKey + '&siteid=' + stationId + '&timewindow=10')
    .then(response => response.json())
    .then(function (data) {
        let departureData = data.ResponseData;
        let typeOfTransportMode = [departureData.Metros, departureData.Buses];
        typeOfTransportMode.forEach(vehicle => {
            vehicle.forEach(x => {
            let info = {
                Destination: x.Destination,
                Line: x.LineNumber,
                DisplayTime: x.DisplayTime,
                TransportMode: x.TransportMode
            };
            
            console.log(info);
            
                listOption = document.createElement('tr');
                listOption1 = document.createElement('tr');
                listOption2 = document.createElement('tr');
                listOption3 = document.createElement('tr');
                listOption4 = document.createElement('br');
                listOption.textContent = info.Destination;
                listOption1.textContent = info.DisplayTime;
                listOption2.textContent = info.Line;
                listOption3.textContent = info.TransportMode;
                searchResultsInfo.appendChild(listOption);
                searchResultsInfo.appendChild(listOption1);
                searchResultsInfo.appendChild(listOption2);
                searchResultsInfo.appendChild(listOption3);
                searchResultsInfo.appendChild(listOption4);
                
            
            })
        })

    })

}


//Funktion som körs igång efter att man har klickat på sökknappen som rensar bort gammal resultatdata
//och därefter klickar på den gömda knappen igen för att få fram uppdaterad data. Ska vara 60000 för att uppdatera
//varje minut
function triggerClick(){
    
    document.onclick = function () {
        clearTimeout(timer);
        clearInterval(int);
        timer = setTimeout(function() {
            int = setInterval(function(){
                var table = document.getElementById("searchOutputTable");
                table.innerHTML = "";
                btn.click();
            }, 3000);
        }, 6000);
    }
}

//Sökknappen som först tar inputen av användaren och kör metoden getStations för att få fram
//namnet och SiteID:et. Därefter körs triggerClick metoden 0.5 sekunder senare som klickar på
//searchButtonClick1 som tar fram avgångarna. 
async function searchButtonClick(searchButton, textInput, list)
{
    const searchInput = inputTextBox.value;
    getStations(searchInput, searchResults, list);
    triggerClick();
    var wait = 500;
    setTimeout(function() { 
        btn.click();
    }, wait);   
} 

//Den gömda knappen som vid klick visar avgångarna för platsen
function searchButtonClick1(searchButton1, textInput, list)
{
    const searchStationId = stationId.value;
    timeDepartures(searchStationId, searchResultsInfo, list);
} 
//Rensar allt på sidan genom att ladda om den.
function clearDataButtonClick(clearDataButton){
    window.location.reload();
    /* var table = document.getElementById("searchOutputTable");
                table.innerHTML = "";
    document.getElementById("searchOutputList").innerHTML = ""; */
    
}

/* GAMMAL KOD 
function timeDepartures(stationId, station)
let departureInfo = {Station: station, Departures: []};
departureInfo.Departures.push(info);

async function getapi(url){
    const response = await fetch(url);
    var data = await response.json(url);
    console.log(data);
    //show(data);
    
}
//getapi(api_url);


function show(data){
    let tab = 
    `<tr>
    <th>Name</th>
    <th>Type</th>
    <th>SiteId</th>
    <th>X</th>
    <th>Y</th>
    <th>Sites</th>
    </tr>`;

     for(let r of Object.entries(data)){
       console.log(r);
       tab += `<tr>
        <td>${data.ResponseData[0].Name}</td>
        <td>${data.ResponseData[0].Type}</td>
        <td>${data.ResponseData[0].SiteId}</td>
        <td>${data.ResponseData[0].X}</td>
        <td>${data.ResponseData[0].Y}</td>
        <td>${data.ResponseData[0].Sites}</td>
        </tr>`;
        
    }
    document.getElementById("resultatData").innerHTML = tab;
    
} */


/*
function fetchRealTimeInfo(stationId, searchOutput, list){
    fetch('http://api.sl.se/api2/realtimedeparturesV4.json?key='+ realTimeInfoApiKey + '&siteid=' + stationId + '&timewindow=10')
    .then((response) => response.json())
    .then((departureData) => {
        displayRealTimeInfo(departureData, searchOutput, list);
       
    })
}

function displayRealTimeInfo(departureData, searchOutput, list){
    
    for(let i in departureData.ResponseData){
        listOption = document.createElement('li');
        //const hiddenInput = document.createElement('input');
        //hiddenInput.type = "hidden";

        //hiddenInput.value = destinationData.ResponseData[i].SiteId;

        listOption.textContent = departureData.ResponseData.Metros[i].Destination;
        //searchOutput.appendChild(hiddenInput);
        searchOutput.appendChild(listOption);
        
        console.log(departureData.ResponseData.Metros[i].Destination);
    }
    
} 

<th>StatusCode</th>
    <th>Message</th>
    <th>ExecutionTime</th>
    <th>ResponseData</th>

<td>${data.ResponseData[0].StatusCode}</td>
        <td>${data.ResponseData[0].Message}</td>
        <td>${data.ResponseData[0].ExecutionTime}</td>
        <td>${data.ResponseData[0].ResponseData}</td> */