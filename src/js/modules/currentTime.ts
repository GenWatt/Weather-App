import { DOMElements } from "../parameters/DOMElements.ts";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import { parameters, year, week, themes } from "../parameters/config.ts";

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
     <span class="location__basic-details location__basic-details--date">${this.numberDay} ${this.weekDay}</span>
     <span class="location__basic-details location__basic-details--sunrise">Wschód słońca:${this.sunrise}</span>
     <span class="location__basic-details location__basic-details--sunset">Zachód słońca:${this.sunset}</span>
     <div class="location__icon"></div>
  `;
  }

  setIcon(data) {
    const img: HTMLImageElement = document.createElement("img");
    const src: string = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    img.classList.add("location__img");
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
      document.body.classList.replace("theme--day", "theme--night");
    } else {
      document.body.style.backgroundImage = themes.day;
      document.body.classList.replace("theme--night", "theme--day");
    }
  }

  updateFutureDate() {
    let numberOfDay: number = this.numberDay;
    let currentMonth: number = this.month;
    let currentYear: number = this.year;

    DOMElements.conteinerBox.forEach((box) => {
      const boxDateElement: HTMLElement = box.querySelector(
        ".conteiner__details--date"
      );

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
      const boxDayElement: HTMLElement = box.querySelector(
        ".conteiner__details--day"
      );

      currentDay++;
      if (currentDay === week.length) currentDay = 0;

      boxDayElement.innerText = week[currentDay];
    });
  }
}

export { CurrentTime };
