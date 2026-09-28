import { fireEvent, screen } from "@testing-library/react";
import { locales } from "../i18n";

export function chooseLanguage(code: string) {
  fireEvent.click(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: locales.find(locale => locale.code === code)!.name }));
}
