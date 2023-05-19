let data; // Declare data variable

fetch('cities-fr.json')
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData; // Update the data variable
    console.log(data)
    const locationSelect = document.getElementById('location-select');

    data.forEach((location, index) => {
      const { id, nm } = location;
      const option = document.createElement('option');
      option.value = id;
      option.text = nm;
      locationSelect.appendChild(option);

      // Setting the first value or name as default option in dropdown list
      if (index === 0) {
        locationSelect.value = id;
      }
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });

  document.getElementById('show-weather-button').addEventListener('click', () => {
    const locationSelect = document.getElementById('location-select');
    const selectedLocationId = locationSelect.value;
    const selectedLocation = data.find(location => location.id == selectedLocationId);
    

    if (selectedLocation) {
      const { id, lat, lon } = selectedLocation;
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=fddb7f912eebd7c32dc411d3e5d20222`;
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(weatherData => {
          const weatherContainer = document.getElementById('weather-container');
          weatherContainer.innerHTML = '';
  
          const dailyForecasts = groupForecastsByDate(weatherData.list).slice(0, 4);
  
          dailyForecasts.forEach(dailyForecast => {
            const date = new Date(dailyForecast[0].dt * 1000);
            const dayName = getDayName(date.getDay());
            const maxTemp = Math.max(...dailyForecast.map(forecast => forecast.main.temp_max)) - 273.15; // Convert from Kelvin to Celsius
            const minTemp = Math.min(...dailyForecast.map(forecast => forecast.main.temp_min)) - 273.15; // Convert from Kelvin to Celsius
            const iconCode = dailyForecast[0].weather[0].icon;
  
            const forecastContainer = document.createElement('div');
            forecastContainer.classList.add('forecast-container');
  
            const dayNameElement = document.createElement('h3');
            dayNameElement.textContent = dayName;
            
            forecastContainer.appendChild(dayNameElement);

            const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
            const iconElement = document.createElement('img');
            iconElement.src = iconUrl;
            forecastContainer.appendChild(iconElement);
  
            const maxTempElement = document.createElement('p');
            maxTempElement.innerHTML = `${maxTemp.toFixed(1)}&deg;C`;
            forecastContainer.appendChild(maxTempElement);
  
            const minTempElement = document.createElement('p');
            minTempElement.innerHTML = `${minTemp.toFixed(1)}&deg;C`;
            forecastContainer.appendChild(minTempElement);
  
            
  
            weatherContainer.appendChild(forecastContainer);
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });
  
  function groupForecastsByDate(forecasts) {
    const dailyForecasts = [];
  
    forecasts.forEach(forecast => {
      const date = forecast.dt_txt.substr(0, 10);
      const existingForecast = dailyForecasts.find(df => df[0].dt_txt.substr(0, 10) === date);
  
      if (existingForecast) {
        existingForecast.push(forecast);
      } else {
        dailyForecasts.push([forecast]);
      }
    });
  
    return dailyForecasts;
  }
  
  function getDayName(dayIndex) {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[dayIndex];
  }
  
  
  
