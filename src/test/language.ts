import { fireEvent, screen, within } from "@testing-library/react";
import { locales } from "../i18n";

export function chooseLanguage(code: string) {
  const header = within(document.querySelector<HTMLElement>(".site-header")!);
  fireEvent.click(header.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: locales.find(locale => locale.code === code)!.name }));
}
