const weatherTypes: string[] = [
  "Słonecznie",
  "Pochmurno",
  "Częściowe zachmurzenie",
  "Deszczowa",
  "Śnieg",
  "Burza",
];

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
  MAX_TEMP_DIFF: number;
  MAX_PRESSURE_DIFF: number;
  WEATHER_API_KEY: string;
  LOCATION_API_KEY: string;
}

const parameters: parameters = {
  lat: null,
  long: null,
  MAX_TEMP_DIFF: 7,
  MAX_PRESSURE_DIFF: 30,
  WEATHER_API_KEY: "YOUR KEY LINK IN .env.example files",
  LOCATION_API_KEY: "YOUR KEY  LINK IN .env.example files",
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

export { themes, parameters, week, year, weatherTypes };
