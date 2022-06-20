// your javascript goes here
import "./../sass/styles.scss";
// importing cookiemanager
import CookieManager from "./CookieManager";
// cookieManager object
let cookieManager = null;
// import Spinner class
import { Spinner } from "spin.js";
// importing Spin.js CSS library
import "./../node_modules/spin.js/spin.css";
// -------------------------------- importing toolkit
import {getXMLData} from "./Toolkit.js";
// -------------------------------------------------- importing the icons
import "./../sass/weather-icons-wind.css";
import "./../sass/weather-icons.min.css";
let CityTheUserChoose;
// ${CityTheUserChoose
// retrieve server sided script
const RETRIEVE_SCRIPT = "http://localhost:5000/cities.xml";
let RETRIEVE_WEATHER = `http://api.openweathermap.org/data/2.5/weather?q=${CityTheUserChoose},CA&mode=xml&units=metric&appid=f61f949e9bbe7110a59681d8e923f309`;

// xmlHttpRequest object for carrying out AJAX
let xmlObject;
let xmlObjectWeather;
// number of samples in XML
let numberofsamples = 0;

// references to objects on page
let dropdown;
let cityName;
let loadingOverlay;
let greyout;
let boolen;

// construct Spinner object
let spinner = new Spinner({ color: '#FFFFFF', lines: 12 }).spin(document.querySelector(".loading-overlay"));
// ------------------------------------------------------- private methods
function populateMe() {
    // populate the dropdown menu with a for loop
    for (let i = 0; i <  numberofsamples; i++) {
        // create element for dropdown
        let option = document.createElement("option");
        option.text = xmlObject.getElementsByTagName("name")[i].textContent + ", " + xmlObject.getElementsByTagName("province")[i].textContent;

        // store data for each sample in the listItem option itself since javascript does not have a clean way to search the XML tree for a target id="#" attribute
        // option.id = xmlObject.getElementsByTagName("sample")[i].getAttribute("id");
        option.name = option.text;
        
        dropdown.add(option);
    }
    // listens for the changes to change the name of the city that the user choose inside the onchanged
    dropdown.addEventListener("change", onChanged);
}

function weatherStuff() {
    // gets the id element and goes inside the xmlObjectWeather where it targets weather and then number to change the icons throught the times as the number changes and for the other one goes inside the xmlObjectWeather and targets the value to display the words next to the icons
    // does the same thing for the other elements that are id and gets their data
    document.getElementById("clouds").innerHTML = '<i class="wi wi-owm-' + xmlObjectWeather.getElementsByTagName("weather")[0].getAttribute("number") + '"></i>' + "<br>" + xmlObjectWeather.getElementsByTagName("weather")[0].getAttribute("value");
    document.getElementById("temperature__current").innerHTML = '<i class="wi wi-thermometer"></i> Temperature' + "<br>" + xmlObjectWeather.getElementsByTagName("temperature")[0].getAttribute("value") + "°C Current";
    document.getElementById("temperature__low").innerHTML = xmlObjectWeather.getElementsByTagName("temperature")[0].getAttribute("min") + "°C Low";
    document.getElementById("temperature__high").innerHTML = xmlObjectWeather.getElementsByTagName("temperature")[0].getAttribute("max") + "°C High";
    document.getElementById("feels__like").innerHTML = "Feels like " + xmlObjectWeather.getElementsByTagName("feels_like")[0].getAttribute("value") + "°C";
    //document.getElementById("get__precipitation").innerHTML = xmlObjectWeather.getElementsByTagName("precipitation")[0].getAttribute("mode");
    // was just testing if it would work this way too
    document.getElementById("get__humidity").innerHTML = '<i class="wi wi-humidity"></i> Humidity' + "<br>" + xmlObjectWeather.getElementsByTagName("humidity")[0].getAttribute("value") + xmlObjectWeather.getElementsByTagName("humidity")[0].getAttribute("unit");
    document.getElementById("get__airpressure").innerHTML = '<i class="wi wi-barometer"></i> Air Pressure' + "<br>" + xmlObjectWeather.getElementsByTagName("pressure")[0].getAttribute("value") + " " + xmlObjectWeather.getElementsByTagName("pressure")[0].getAttribute("unit");
    //document.getElementById("get__wind__direction").innerHTML = xmlObjectWeather.getElementsByTagName("wind")[0].getElementsByTagName("direction")[0].getAttribute("name");
    document.getElementById("get__wind__what__is__it__like").innerHTML = xmlObjectWeather.getElementsByTagName("speed")[0].getAttribute("name");
    let wind__speed = xmlObjectWeather.getElementsByTagName("wind")[0].getElementsByTagName("speed")[0].getAttribute("value") * 3.6;
    document.getElementById("get__wind__speed").innerHTML =  + wind__speed.toFixed(2) + " " + "km/h speed";
    
    // first if statements so if the precipitation == "no" it would display the icon for the precipitation with 0mm of rain showing else it would use the right value and dispaly the icon and amount of rain or snow in mm
    if (xmlObjectWeather.getElementsByTagName("precipitation")[0].getAttribute("mode") == "no") {
        document.getElementById("get__precipitation").innerHTML = '<i class="wi wi-rain"></i> Precipitation<br> 0 mm';
    }
    else {
        document.getElementById("get__precipitation").innerHTML = '<i class="wi wi-rain"></i> Precipitation' + "<br>" + xmlObjectWeather.getElementsByTagName("precipitation")[0].getAttribute("value") + "mm";
    }
    // second if statement if the name == null instead of displaying null it would sat no wind with the wind icon else it would display the the icon and direction of the wind
    if (xmlObjectWeather.getElementsByTagName("wind")[0].getElementsByTagName("direction")[0].getAttribute("name") == null) {
        document.getElementById("get__wind__direction").innerHTML = '<i class="wi wi-wind-direction"></i> Wind<br> No wind';
    }
    else {
        document.getElementById("get__wind__direction").innerHTML = '<i class="wi wi-wind from-'+ xmlObjectWeather.getElementsByTagName("direction")[0].getAttribute("value") +'-deg"></i> Wind' + "<br>" + xmlObjectWeather.getElementsByTagName("wind")[0].getElementsByTagName("direction")[0].getAttribute("name");
    }
    // it detects the changes that the user makes by targetting the menu
   document.querySelector(".nav__menu").addEventListener("change", onUpdatemenu);


}


// ------------------------------------------------------- event handlers
function onUpdatemenu() {
    // greyoutoverlay
    let spinnergreyout = new Spinner({ color: '#FFFFFF', lines: 12 }).spin(document.querySelector(".greyout"));
    greyout.style.display = "block";
     // sets the timer for how long to display the spinner for
    window.setTimeout(() => { 
        spinnergreyout.stop();
        greyout.style.display = "none";
    },500);
    // gets the information from the dropdown menu 
    CityTheUserChoose = document.querySelector(".nav__menu").value;
    console.log(CityTheUserChoose);
    // changes the retrive weather link with the neew infromation form the dropdown menu
    RETRIEVE_WEATHER = `http://api.openweathermap.org/data/2.5/weather?q=${CityTheUserChoose},CA&mode=xml&units=metric&appid=f61f949e9bbe7110a59681d8e923f309`;
    //console.log(RETRIEVE_WEATHER);'
    // grabs the new data from the xml
    getXMLData(RETRIEVE_SCRIPT, onLoaded, onError);
    getXMLData(RETRIEVE_WEATHER, onLoaded2, onError);
    saveData();
    

}

function onChanged(e) {
    // reference to option in sample
    //let option = dropdown.selectedOptions[0];
    // updating interface
    //dropdown.innerHTML = CityTheUserChoose;
    console.log(dropdown);
    cityName.innerHTML = CityTheUserChoose;

}

function onLoaded(result) {
    // save the XML response
    xmlObject = result;
    numberofsamples = xmlObject.getElementsByTagName("city").length;
    if ( numberofsamples > 0) {
        // boolen to stop repopulating the dropdown each time the onLoaded is called
        if (boolen) {
            console.log(boolen);
            populateMe();
            boolen = false;
        }
        onChanged();
        // loading complete - removing loading overlay
        loadingOverlay.style.display = "none";
    }        
}

function onLoaded2(result) {
    // save the XML response
    xmlObjectWeather = result;
     numberofsamples = xmlObjectWeather.getElementsByTagName("current").length;
    
    if ( numberofsamples > 0) {
        weatherStuff();
        //onChanged();
        //loading complete - removing loading overlay
        //loadingOverlay.style.display = "none";
    }        
}

function onError() {
        
        // if the page is not found it would go into this error function and dispaly the warning with making all of the data = ""
        document.querySelector(".content__title").innerHTML = " ***Sorry, We Could Not Find The City That You Were Looking For*** ";
        document.getElementById("clouds").innerHTML = "";
        document.getElementById("temperature__current").innerHTML = "";
        document.getElementById("temperature__low").innerHTML = "";
        document.getElementById("temperature__high").innerHTML = "";
        document.getElementById("feels__like").innerHTML = "";
        document.getElementById("get__precipitation").innerHTML = "";
        // was just testing if it would work this way too
        document.getElementById("get__humidity").innerHTML = "";
        document.getElementById("get__airpressure").innerHTML = "";
        document.getElementById("get__wind__direction").innerHTML = "";
        document.getElementById("get__wind__what__is__it__like").innerHTML = "";
        //let wind__speed = xmlObjectWeather.getElementsByTagName("wind")[0].getElementsByTagName("speed")[0].getAttribute("value") * 3.6;
        document.getElementById("get__wind__speed").innerHTML = "";
        
        if (xmlObjectWeather.getElementsByTagName("precipitation")[0].getAttribute("mode") == "no") {
            document.getElementById("get__precipitation").innerHTML = "";
        }
        else {
            document.getElementById("get__precipitation").innerHTML = "";

        if (xmlObjectWeather.getElementsByTagName("wind")[0].getElementsByTagName("direction")[0].getAttribute("name") == null) {
            document.getElementById("get__wind__direction").innerHTML = "";
        }
        else {
            document.getElementById("get__wind__direction").innerHTML = "";
        }

        console.log("*** Error has occured during AJAX data retrieval");
    }
}
// --------------------------------------------------------- cookies

function saveData(){
    // write cookies to store 
    //console.log(CityTheUserChoose);
    cookieManager.writeCookie("CityTheUserChoose", CityTheUserChoose, 365);
}


// ------------------------------------------------------- main method
function main() {
    boolen = true;
    cookieManager = new CookieManager();

    // get cities data from cookie if it exists
    if (cookieManager.readCookie("CityTheUserChoose") === undefined) {
        // write cookie
        console.log("this is a if statement");
        CityTheUserChoose = "Airdrie, Alberta";
        saveData();
    } else {
        console.log("this is a else statement");
        // read cookie
        CityTheUserChoose = cookieManager.readCookie("CityTheUserChoose");
        document.querySelector(".city").innerHTML = CityTheUserChoose;
        RETRIEVE_WEATHER = `http://api.openweathermap.org/data/2.5/weather?q=${CityTheUserChoose},CA&mode=xml&units=metric&appid=f61f949e9bbe7110a59681d8e923f309`;
        saveData();
    }
    //console.log(CityTheUserChoose);

    // setup references to controls
    dropdown = document.querySelector(".nav__menu");
    cityName = document.querySelector(".content__title");
    loadingOverlay = document.querySelector(".loading-overlay");
    greyout = document.querySelector(".greyout");
   
   
    // send out AJAX request
    getXMLData(RETRIEVE_SCRIPT, onLoaded, onError);
    // ----------------------------------------------------------
    getXMLData(RETRIEVE_WEATHER, onLoaded2, onError);
}

main();