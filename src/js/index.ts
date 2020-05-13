import "../scss/style.scss";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import anime from "animejs";

const MAX_TEMP_DIFF = 7;
const MAX_PRESSURE_DIFF = 30;

const weatherTypes: string[] = [
  "Słonecznie",
  "Pochmurno",
  "Częściowe zachmurzenie",
  "Deszczowa",
  "Śnieg",
  "Burza",
];

interface DOMElements {
  degreeElement: HTMLElement;
  cityElement: HTMLElement;
  descriptionElement: HTMLElement;
  pressureElement: HTMLElement;
  windElement: HTMLElement;
  realFeelElement: HTMLElement;
  currentDayElement: HTMLElement;
  conteinerBox: NodeListOf<HTMLDivElement>;
  boxDegreeElement: NodeListOf<HTMLDivElement>;
  boxPressureElement: NodeListOf<HTMLDivElement>;
  boxWeatherElement: NodeListOf<HTMLDivElement>;
  conteinerUnitElement: NodeListOf<HTMLDivElement>;
}

const DOMElements: DOMElements = {
  degreeElement: document.querySelector(".location__current-degree"),
  cityElement: document.querySelector(".location__city-name"),
  descriptionElement: document.querySelector(".location__description"),
  pressureElement: document.querySelector(".location__pressure"),
  windElement: document.querySelector(".location__wind"),
  realFeelElement: document.querySelector(".location__real-feel"),
  currentDayElement: document.querySelector(".location__current-day"),
  conteinerBox: document.querySelectorAll(".conteiner__box"),
  boxDegreeElement: document.querySelectorAll(".conteiner__degree"),
  boxPressureElement: document.querySelectorAll(".conteiner__pressure"),
  boxWeatherElement: document.querySelectorAll(".conteiner__weather"),
  conteinerUnitElement: document.querySelectorAll(".conteiner__unit"),
};

const week: string[] = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];

const year: (string | number)[][] = [
  ["01", 31],
  ["02", 29],
  ["03", 31],
  ["04", 30],
  ["05", 31],
  ["06", 30],
  ["07", 31],
  ["08", 31],
  ["09", 30],
  ["10", 31],
  ["11", 30],
  ["12", 31],
];

interface parameters {
  lat: number;
  long: number;
}

const parameters: parameters = {
  lat: null,
  long: null,
};

interface themes {
  day: string;
  night: string;
}

const themes: themes = {
  day: `linear-gradient(
    35deg,
    rgb(12, 150, 230),
    rgb(82, 159, 248),
    rgb(115, 208, 245),
    rgb(173, 227, 248)
  )`,
  night: `linear-gradient(
    35deg,
    rgb(11, 132, 202),
    rgb(46, 99, 160),
    rgb(23, 80, 102),
    rgb(0, 10, 14)
  )`,
};

class GetData {
  constructor() {}

  async getLocation() {
    const self = this;
    navigator.geolocation.getCurrentPosition(success, error);

    async function success(position) {
      parameters.lat = await position.coords.latitude;
      parameters.long = await position.coords.longitude;

      const { components } = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${parameters.lat}+${parameters.long}&key=6dc2be2af0d344edacc742fab6b0a09f`
      )
        .then((res) => (res.status === 200 ? res.json() : null))
        .then((data) => data.results[0])
        .catch((err) => console.error(err));

      self.getWeather(components.city);
    }

    async function error() {
      console.log("error");
    }
  }

  async getWeather(location: string) {
    const http: string = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=9f6c5c9e242f9394b7477436113cfca0&units=metric`;

    fetch(http)
      .then((res) => {
        if (res.status === 200) return res.json();
      })
      .then((data: object) => init(data))
      .catch((err) => console.error(err));

    DOMElements.cityElement.innerText = location;
  }
}

interface UpdateDataInteface {
  temp: number;
  description: string;
  pressure: number;
  wind: number;
  realFeel: number;
}

class UpdateData implements UpdateDataInteface {
  temp: number;
  description: string;
  pressure: number;
  wind: number;
  realFeel: number;

  constructor(data?) {
    this.temp = data.main.temp;
    this.description = data.weather[0].description;
    this.pressure = data.main.pressure;
    this.wind = data.wind.speed;
    this.realFeel = data.main.feels_like;
  }

  updateQuckViewData() {
    DOMElements.descriptionElement.innerText = this.description;
    DOMElements.degreeElement.innerText = this.temp + "\u00B0";
    DOMElements.pressureElement.innerText = this.pressure + "hPa";
    DOMElements.windElement.innerText = this.wind + "km/h";
    DOMElements.realFeelElement.innerText = this.realFeel + "\u00B0";
  }

  updateFutureParameters() {
    DOMElements.boxDegreeElement.forEach((box) =>
      this.randomNumber(box, MAX_TEMP_DIFF, this.temp)
    );
    DOMElements.boxPressureElement.forEach((box) =>
      this.randomNumber(box, MAX_PRESSURE_DIFF, this.pressure)
    );
    DOMElements.boxWeatherElement.forEach((box) =>
      this.randomNumber(box, weatherTypes.length - 1)
    );
  }

  randomNumber(element, highestNumber, parameter?) {
    const multiple: number[] = [1, -1];
    const randomSign: number = Math.floor(Math.random() * multiple.length);
    const randomNumber: number = Math.floor(Math.random() * highestNumber);
    const finalResult: number = multiple[randomSign] * randomNumber;

    this.updateElementText(element, finalResult, parameter);
  }

  updateElementText(element, finalResult, parameter?) {
    const counting = Math.floor(parameter) - finalResult;
    const unitElement = element.querySelector(".conteiner__unit");
    let unit: string = "\u00B0";

    if (element.className === "conteiner__weather") {
      const temp: number = parseFloat(
        element.nextElementSibling.innerText.slice("\u00B0")
      );

      Math.sign(finalResult) === -1 ? (finalResult = finalResult * -1) : null;

      if (temp >= 0 && weatherTypes[finalResult] === "Śnieg") finalResult++;

      unit = weatherTypes[finalResult];
      element.innerText = unit;
      return;
    }

    if (element.className === "conteiner__pressure") unit = "mPa";

    unitElement.innerText = unit;
    this.animeDigital(element, counting);
  }

  animeDigital(element, count) {
    const valueElement = element.querySelector(".conteiner__value");

    anime({
      targets: valueElement,
      innerText: [0, count],
      round: 1,
    });
  }
}

interface CurrentTimeInterface {
  day: string[];
  sunrise: string;
  numberDay: number;
  weekDay: string;
  sunset: string;
  currentTime: Date;
  year: number;
  month: number;
  weekDayIndex: number;
  hours: string;
  minutes: string;
  seconds: string;
}

class CurrentTime implements CurrentTimeInterface {
  day: string[];
  sunrise: string;
  numberDay: number;
  weekDay: string;
  sunset: string;
  currentTime: Date;
  year: number;
  month: number;
  weekDayIndex: number;
  hours: string;
  minutes: string;
  seconds: string;

  constructor() {
    this.day = getSunrise(parameters.lat, parameters.long)
      .toString()
      .split(" ");
    this.sunrise = this.day[4];
    this.numberDay = parseFloat(this.day[2]);
    this.weekDay = this.day[0];
    this.sunset = getSunset(parameters.lat, parameters.long)
      .toString()
      .split(" ")[4];
    this.currentTime = new Date();
    this.year = this.currentTime.getFullYear();
    this.month = this.currentTime.getMonth();
    this.weekDayIndex = this.currentTime.getDay();
    this.hours = this.currentTime.getHours().toString();
    this.minutes = this.currentTime.getMinutes().toString();
    this.seconds = this.currentTime.getSeconds().toString();
  }

  setDate() {
    DOMElements.currentDayElement.innerHTML = `
   <span class="location__date">${this.numberDay} ${this.weekDay}</span>
   <span class="location__sunrise">Wschód słońca:${this.sunrise}</span>
   <span class="location__sunset">Zachód słońca:${this.sunset}</span>
   <div class="location__icon"></div>
`;
  }

  setIcon(data) {
    const img: HTMLImageElement = document.createElement("img");
    const src: string = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    img.src = src;
    img.alt = "weather-icon";

    document.querySelector(".location__icon").appendChild(img);
  }

  setTheme() {
    if (parseFloat(this.hours) < 10) this.hours = 0 + this.hours;
    if (parseFloat(this.minutes) < 10) this.minutes = 0 + this.minutes;
    if (parseFloat(this.seconds) < 10) this.seconds = 0 + this.seconds;

    const time: string = `${this.hours}:${this.minutes}:${this.seconds}`;

    if (this.sunset <= time || this.sunrise >= time) {
      document.body.style.backgroundImage = themes.night;
      document.body.classList.replace("--day", "--night");
    } else {
      document.body.style.backgroundImage = themes.day;
      document.body.classList.replace("--night", "--day");
    }
  }

  updateFutureDate() {
    let numberOfDay: number = this.numberDay;
    let currentMonth: number = this.month;
    let currentYear: number = this.year;

    DOMElements.conteinerBox.forEach((box) => {
      const boxDateElement: HTMLElement = box.querySelector(".conteiner__date");

      if (numberOfDay === year[currentMonth][1]) {
        currentMonth++;
        numberOfDay = 0;

        if (currentMonth === year.length) {
          currentMonth = 0;
          currentYear++;
        }
      }
      numberOfDay++;

      const nextDate: string = `${numberOfDay.toString()}.${
        year[currentMonth][0]
      }.${currentYear}`;

      boxDateElement.innerText = nextDate;
    });
    this.updateFutureDateDay();
  }

  updateFutureDateDay() {
    let currentDay: number = this.weekDayIndex;

    DOMElements.conteinerBox.forEach((box) => {
      const boxDayElement: HTMLElement = box.querySelector(".conteiner__day");

      currentDay++;
      if (currentDay === week.length) currentDay = 0;

      boxDayElement.innerText = week[currentDay];
    });
  }
}

function init(data?: object) {
  const fetchData = new GetData();
  const setDate: CurrentTime = new CurrentTime();

  setDate.setDate();
  setDate.updateFutureDate();

  if (data) {
    const updateQuickViewDate: UpdateData = new UpdateData(data);
    updateQuickViewDate.updateQuckViewData();
    setDate.setTheme();
    setDate.setIcon(data);
    updateQuickViewDate.updateFutureParameters();
  } else fetchData.getLocation();
}

init();
