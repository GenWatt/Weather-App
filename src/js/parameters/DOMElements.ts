interface DOMElements {
  errorMsgElement: HTMLDivElement;
  errorMsgBtn: HTMLElement;
  degreeElement: HTMLElement;
  locationCityConteiner: HTMLElement;
  cityElement: HTMLElement;
  quickViewElement: HTMLElement;
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
  errorMsgElement: document.querySelector(".error-msg"),
  errorMsgBtn: document.querySelector(".error-msg__btn"),
  degreeElement: document.querySelector(".location__details--current-degree"),
  locationCityConteiner: document.querySelector(".location__city"),
  cityElement: document.querySelector(".location__city-name"),
  quickViewElement: document.querySelector(".location__quick-view"),
  descriptionElement: document.querySelector(".location__details--description"),
  pressureElement: document.querySelector(".location__details--pressure"),
  windElement: document.querySelector(".location__details--wind"),
  realFeelElement: document.querySelector(".location__details--real-feel"),
  currentDayElement: document.querySelector(".location__current-day"),
  conteinerBox: document.querySelectorAll(".conteiner__box"),
  boxDegreeElement: document.querySelectorAll(".conteiner__details--degree"),
  boxPressureElement: document.querySelectorAll(
    ".conteiner__details--pressure"
  ),
  boxWeatherElement: document.querySelectorAll(".conteiner__details--weather"),
  conteinerUnitElement: document.querySelectorAll(".conteiner__unit"),
};

export { DOMElements };
