import dayjs from "dayjs";
import { IAction, ILanguage, IToolbarButton } from "types";
import { emptyDate } from "./constants";
import { KEY_CONTEXT } from "themes/config";

export const dimension = {
  width: window.innerWidth,
  height: window.innerHeight,
};
export const getDefaultGridHeight = () => dimension.height - 178;


export const formatDateToString = (date: Date | string, locale?: ILanguage) => {
  if (!date) return "";
  const d = dayjs(date);
  if (d.format("YYYY-MM-DD") === emptyDate) return "";
  const main = JSON.parse(localStorage.getItem(KEY_CONTEXT.MAIN) || "{}")

  if (locale === ILanguage.EN || main.lang === 'en') return d.format("DD MMM YYYY");
  return d.format("DD/MM/YYYY");
}
export const formatDateTimeToString = (date: Date | string, locale?: ILanguage) => {
  if (!date) return "";
  const d = dayjs(date);
  if (d.format("YYYY-MM-DD") === emptyDate) return "";
  const main = JSON.parse(localStorage.getItem(KEY_CONTEXT.MAIN) || "{}")

  if (locale === ILanguage.EN || main.lang === 'en') return d.format("DD MMM YYYY - HH:mm");
  return d.format("DD/MM/YYYY HH:mm");
}

export const formatNumberToString = (number: number | null | undefined, decimalPlaces = 0) => {
  if (number === null || number === undefined) return "";
  return number.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}

export const resolveActionButtons = (initButtons: IToolbarButton[], buttons: (IAction | IToolbarButton)[]) => {
  return buttons.reduce((acc, button) => {
    if (typeof button === "object") {
      acc.push(button);
    } else {
      const resolvedButton = initButtons.find((item) => item.key === button);
      if (resolvedButton) {
        acc.push(resolvedButton);
      } else {
        acc.push({ key: button });
      }
    }
    return acc;
  }, [] as IToolbarButton[]);
}