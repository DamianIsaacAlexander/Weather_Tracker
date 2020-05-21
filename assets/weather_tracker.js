let currentCity = "";
let searchedCities = [];
let timecards = []
let time = "15:00:00"


function renderWeatherInfo() {
    let openWeatherKey = "0edb40860099c3ccf44f8e5bf85f28ba"
    let openWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&appid=" + openWeatherKey;
    let currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=" + openWeatherKey;

    //------------------Jumbotron Ajax Call--------------------------------------------------------
    $.ajax({ url: currentWeatherUrl, method: "GET" }).then(function (currentCityResponse) {

        $(".jumbotron").empty();

        let lat = currentCityResponse.coord.lat;
        let lon = currentCityResponse.coord.lon;
        let currentWeatherUVUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + openWeatherKey + "&lat=" + lat + "&lon=" + lon + "&cnt=1";

        let cityName = $("<h2>");
        let cityTemp = $("<p>");
        let cityHum = $("<p>");
        let cityWind = $("<p>");
        let cityUV = $("<p>");
        let cityUVName = $("<p>");

        cityName.text(currentCityResponse.name);
        cityTemp.text("Temperature: " + (parseFloat(currentCityResponse.main.temp) * 9 / 5 - 459.67).toFixed(2) + " " + String.fromCharCode(176) + "F");
        cityHum.text("Humidity: " + currentCityResponse.main.humidity + "%");
        cityWind.text("Wind Speed: " + currentCityResponse.wind.speed + " MPH");
        cityUVName.text("UV Index: ");

        cityName.addClass("display-5");
        cityUVName.addClass("city-uv");
        cityUV.addClass("city-uv color-index");

        $(".jumbotron").append(cityName).append(cityTemp).append(cityHum).append(cityWind).append(cityUVName);

        if (lat != "" && lon != "") {
            $.ajax({ url: currentWeatherUVUrl, method: "GET" }).then(function (UVResponse) {

                let uvIndex = UVResponse[0].value;

                cityUV.text(uvIndex);

                $(".jumbotron").append(cityUV)

                uvIndex = Math.floor(UVResponse[0].value);

                if (uvIndex <= 2) {
                    $(".color-index").css("background-color", "green");
                }
                else if (uvIndex >= 3 && uvIndex <= 5) {
                    $(".color-index").css("background-color", "orange");
                }
                else if (uvIndex >= 6 && uvIndex <= 7) {
                    $(".color-index").css("background-color", "darkorange");
                }
                else if (uvIndex >= 8 && uvIndex <= 10) {
                    $(".color-index").css("background-color", "red");
                }
                else if (uvIndex >= 11) {
                    $(".color-index").css("background-color", "purple");
                }
            });
        }

    }, invalidCityRequest);
    //------------------Weather Card Ajax Call--------------------------------------------------------
    $.ajax({ url: openWeatherUrl, method: "GET" }).then(function (response) {

        timecards.length = 0;

        $(".forecast-row").empty();

        for (let i = 0; i < response.list.length; i += 8) 
        {
            timecards.push(response.list[i]);
        }

        timecards.forEach(function (item) {
            let cityCardDiv = $("<div>")
            let cityCardDate = $("<h4>")
            let cityCardImg = $("<img>")
            let cityCardTemp = $("<p>")
            let cityCardHum = $("<p>")

            let iconCode = item.weather[0].icon;
            cityCardImg.attr("src", "http://openweathermap.org/img/w/" + iconCode + ".png");

            cityCardDate.text(item.dt_txt.slice(0, 11));
            cityCardTemp.text("Temp: " + (parseFloat(item.main.temp) * 9 / 5 - 459.67).toFixed(2) + " " + String.fromCharCode(176) + "F");
            cityCardHum.text("Humidity: " + item.main.humidity + "%");

            cityCardDiv.addClass("col-lg-2 forecast-card");
            cityCardDate.addClass("forecast-card-date");
            cityCardTemp.addClass("forecast-card-item");
            cityCardHum.addClass("foreceast-card-item");

            $(cityCardDiv).append(cityCardDate).append(cityCardImg).append(cityCardTemp).append(cityCardHum);
            $(".forecast-row").append(cityCardDiv)
        });

    });

}

function invalidCityRequest() {
    $(".jumbotron").empty();
    $(".forecast-row").empty();
    let errorName = $("<h2>")
    errorName.text("City Not Found")
    $(".jumbotron").append(errorName);
}

function renderCityBlock() {
    renderWeatherInfo();

    $("#city-block-container-row").empty();

    if (searchedCities.length > 10) {
        searchedCities.length = 0;
    }

    for (let i = 0; i < searchedCities.length; i++) {
        let cityBlockDiv = $("<div>");
        cityBlockDiv.addClass("col-lg-11 city-block").text(searchedCities[i]);
        $("#city-block-container-row").prepend(cityBlockDiv);
    }
}

$("#search-submit").submit(function (event) {
    event.preventDefault()

    if ($("#search-input").val().trim() != "") {
        currentCity = $("#search-input").val().trim();
        searchedCities.push(currentCity);
        renderCityBlock();
    }

});

$(document).on("click", ".city-block", function () {
    currentCity = $(this).text();
    renderWeatherInfo();
});