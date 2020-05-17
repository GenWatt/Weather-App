import "../scss/style.scss";
import { GetData } from "./modules/getData.ts";
import { CurrentTime } from "./modules/currentTime.ts";
import { UpdateData } from "./modules/update.ts";

function init(data?: object) {
  const fetchData = new GetData();
  const setDate = new CurrentTime();

  setDate.setDate();
  setDate.updateFutureDate();

  if (data) {
    const updateQuickViewDate = new UpdateData(data);

    updateQuickViewDate.updateQuckViewData();
    setDate.setTheme();
    setDate.setIcon(data);
    updateQuickViewDate.updateFutureParameters();
  } else fetchData.getLocation();
}

init();

export { init };
