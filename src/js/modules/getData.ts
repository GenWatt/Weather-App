import { DOMElements } from "../parameters/DOMElements.ts";
import { init } from "../index.ts";
import { parameters } from "../parameters/config.ts";

class GetData {
  constructor() {}

  async getLocation() {
    const self = this;
    navigator.geolocation.getCurrentPosition(success, error);

    async function success(position) {
      parameters.lat = await position.coords.latitude;
      parameters.long = await position.coords.longitude;

      const { components } = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${parameters.lat}+${parameters.long}&key=${parameters.LOCATION_API_KEY}`
      )
        .then((res) => (res.status === 200 ? res.json() : null))
        .then((data) => data.results[0])
        .catch((err) => console.error(err));
      self.getWeather(components.city);
    }

    async function error(e) {
      alert(
        "Error: Probably you didn't allow for getting location. Error message: " +
          e.message
      );
      DOMElements.errorMsgElement.classList.add("error-msg--show");
      DOMElements.errorMsgElement.insertAdjacentHTML(
        "afterbegin",
        `<p>If you want to check weather you should allow for getting location.</p>`
      );
      DOMElements.errorMsgBtn.addEventListener("click", () =>
        DOMElements.errorMsgElement.classList.remove("error-msg--show")
      );
    }
  }

  async getWeather(location: string) {
    const http: string = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${parameters.WEATHER_API_KEY}&units=metric`;

    fetch(http)
      .then((res) => {
        if (res.status === 200) return res.json();
      })
      .then((data: object) => init(data))
      .catch((err) => console.error(err));

    DOMElements.cityElement.innerText = location;
  }
}

export { GetData };
