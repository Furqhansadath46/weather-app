const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("#location"),
    searchBtn = inputPart.querySelector("#searchBtn"),
    weatherPart = wrapper.querySelector(".weather-part"),
    wIcon = weatherPart.querySelector("img"),
    arrowBack = wrapper.querySelector("header i");
let api;
inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

inputField.addEventListener("input", () => {
    if (inputField.value.trim() === "") {
        infoTxt.classList.remove("error");
    }
})

searchBtn.addEventListener("click", () => {
    if (inputField.value != "") {
        requestApi(inputField.value);
    } else {
        infoTxt.innerText = "Enter a city name";
        infoTxt.classList.add("error");
    }
})
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support geolocation api");
    }
});
function requestApi(city) {
    const apiKey = "69aeebafd82a8efa4a8b2ba705b00bd3";
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}
function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    const apiKey = "69aeebafd82a8efa4a8b2ba705b00bd3";
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}
function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}
function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() => {
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}
function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { temp, feels_like, humidity } = info.main;
        if (id == 800) {
            wIcon.src = "image/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "image/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "image/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "image/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "image/cloud.svg";
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            wIcon.src = "image/rain.svg";
        }

        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}
arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});