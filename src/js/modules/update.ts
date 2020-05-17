import { DOMElements } from "../parameters/DOMElements.ts";
import anime from "animejs";
import { parameters, weatherTypes } from "../parameters/config.ts";

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
      this.randomNumber(box, parameters.MAX_TEMP_DIFF, this.temp)
    );
    DOMElements.boxPressureElement.forEach((box) =>
      this.randomNumber(box, parameters.MAX_PRESSURE_DIFF, this.pressure)
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

    if (element.classList.contains("conteiner__details--weather")) {
      const temp: number = parseFloat(
        element.nextElementSibling.innerText.slice("\u00B0")
      );

      Math.sign(finalResult) === -1 ? (finalResult = finalResult * -1) : null;

      if (temp >= 0 && weatherTypes[finalResult] === "Śnieg") finalResult++;

      unit = weatherTypes[finalResult];
      element.innerText = unit;
      return;
    }

    if (element.classList.contains("conteiner__details--pressure"))
      unit = "mPa";

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

    this.animeElements();
  }

  animeElements() {
    const dayNameElement = document.querySelectorAll(
      ".conteiner__details--day"
    );

    anime({
      targets: dayNameElement,
      translateX: [-1000, 0],
      delay: anime.stagger(50),
      duration: 1000,
    });

    anime({
      targets: DOMElements.quickViewElement,
      scaleY: [0, 1],
      delay: 100,
      duration: 1000,
    });

    anime({
      targets: DOMElements.currentDayElement.children,
      translateX: [500, 0],
      delay: anime.stagger(100),
    });

    anime({
      targets: DOMElements.locationCityConteiner.children,
      translateX: [-500, 50 + "%"],
      translateY: [-500, -50 + "%"],
      delay: anime.stagger(100, { start: 500 }),
    });
  }
}

export { UpdateData };
