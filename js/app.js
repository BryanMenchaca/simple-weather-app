document.addEventListener('DOMContentLoaded', () => {

    moment.locale('es-us');

    const baseURL = 'https://api.weatherapi.com/v1';
    // Generate a private API KEY with an account in https://www.weatherapi.com/
    const apiKey = '79d95c6c22e14117b7f42244202403';

    const getWeatherInfo = (myLocation) => {
        const lng = myLocation.coords.longitude;
        const lat = myLocation.coords.latitude;
        
        axios.get(`${baseURL}/forecast.json?key=${apiKey}&q=${lat},${lng}&days=3&lang=es`)
            .then(({data}) => setWeatherInfo(data));
    };

    const setWeatherInfo = ({location, current, forecast}) => {
        document.querySelector('#tmp').innerHTML = `${current.temp_c}°`; // Set temp
        document.querySelector('#location').innerHTML = `${location.name}, ${location.region}`; // Set location name
        document.querySelector('#current-icon').src = current.condition.icon; // Set condition icon

        let mappedForecastDays = forecast.forecastday.map(element => {
            let nameDay = moment(element.date).format('dddd').substring(0,3);
            let maxtmp = parseInt(element.day.maxtemp_c);
            let mintmp = parseInt(element.day.mintemp_c);
            return `
                <div class="w-hour">
                    <div class="d-block">
                        <span id="w-maxtmp-hour">${maxtmp}°</span>
                        <span id="w-mintmp-hour">${mintmp}°</span>
                    </div>
                    <img src="${element.day.condition.icon}" id="w-icon" alt="${element.day.condition.code}">
                    <span id="w-clock-hour">${nameDay}</span>
                </div>
            `
        });

        document.querySelector('.forecast').innerHTML = mappedForecastDays.join('\n');

        document.querySelector('#wind').innerHTML = `${current.wind_kph} km/h`
        document.querySelector('#humidity').innerHTML = `${current.humidity} %`
        document.querySelector('#visibility').innerHTML = `${current.vis_km} km`
    };

    // Get location and fetch data
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherInfo);
    } else {
        alert('Geolocation is necessary to get the weather information.');
    }

});