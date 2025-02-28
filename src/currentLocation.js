import React from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  let months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    temperatureC: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    main: undefined,
    icon: "CLEAR_DAY",
    errorMsg: undefined,
  };

  async componentDidMount() {
    if (navigator.geolocation) {
      try {
        const position = await this.getPosition();
        this.getWeather(position.coords.latitude, position.coords.longitude);
      } catch (err) {
        this.getWeather(28.67, 77.22); // Default location
        alert(
          "Location access is disabled. Showing weather for a default location."
        );
      }
    } else {
      alert("Geolocation not available.");
    }

    this.timerID = setInterval(() => {
      if (this.state.lat && this.state.lon) {
        this.getWeather(this.state.lat, this.state.lon);
      }
    }, 600000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  getWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        throw new Error(data.message);
      }

      this.setState({
        lat,
        lon,
        city: data.name,
        temperatureC: Math.round(data.main.temp),
        humidity: data.main.humidity,
        country: data.sys.country,
        main: data.weather[0].main,
        icon: this.getWeatherIcon(data.weather[0].main),
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      this.setState({ errorMsg: "Unable to fetch weather data." });
    }
  };

  getWeatherIcon = (weatherMain) => {
    const iconMap = {
      Haze: "CLEAR_DAY",
      Clouds: "CLOUDY",
      Rain: "RAIN",
      Snow: "SNOW",
      Dust: "WIND",
      Drizzle: "SLEET",
      Fog: "FOG",
      Smoke: "FOG",
      Tornado: "WIND",
    };
    return iconMap[weatherMain] || "CLEAR_DAY";
  };

  render() {
    const { city, country, temperatureC, main, icon, errorMsg } = this.state;

    if (errorMsg) {
      return <h3 style={{ color: "white" }}>{errorMsg}</h3>;
    }

    return temperatureC !== undefined ? (
      <React.Fragment>
        <div className="city">
          <div className="title">
            <h2>{city}</h2>
            <h3>{country}</h3>
          </div>
          <div className="mb-icon">
            <ReactAnimatedWeather
              icon={icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
            <div className="temperature">
              <p>{temperatureC}°<span>C</span></p>
            </div>
          </div>
        </div>
        <Forcast icon={icon} weather={main} />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <img src={loader} alt="Loading..." style={{ width: "50%", WebkitUserDrag: "none" }} />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location...
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location will be used to fetch real-time weather data.
        </h3>
      </React.Fragment>
    );
  }
}

export default Weather;
