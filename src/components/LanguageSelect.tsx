import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { locales, translate } from "../i18n";
import type { Locale } from "../types";

interface LanguageSelectProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
}

export function LanguageSelect({ locale, onChange }: LanguageSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => locales.findIndex(({ code }) => code === locale));
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef({ text: "", time: 0 });
  const listId = useId();
  const selectedIndex = locales.findIndex(({ code }) => code === locale);
  const selected = locales[selectedIndex];
  const label = translate(locale, "Choose language");

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, listId, open]);

  function showOptions(index = selectedIndex) {
    setActiveIndex(index);
    searchRef.current = { text: "", time: 0 };
    setOpen(true);
  }

  function choose(index: number) {
    onChange(locales[index].code);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        buttonRef.current?.focus();
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(activeIndex);
      else showOptions();
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "Home") showOptions(0);
      else if (event.key === "End") showOptions(locales.length - 1);
      else if (!open) showOptions();
      else setActiveIndex((current) => (current + (event.key === "ArrowDown" ? 1 : -1) + locales.length) % locales.length);
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const previous = now - searchRef.current.time < 600 ? searchRef.current.text : "";
      const text = `${previous}${event.key}`.toLocaleLowerCase();
      searchRef.current = { text, time: now };
      const match = locales.findIndex(({ name }) => name.toLocaleLowerCase().startsWith(text));
      if (match >= 0) {
        setActiveIndex(match);
        setOpen(true);
      }
    }
  }

  return (
    <div
      className={`language-picker${open ? " is-open" : ""}`}
      ref={pickerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        className="language-select"
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        data-value={locale}
        onClick={() => open ? setOpen(false) : showOptions()}
        onKeyDown={handleKeyDown}
      >
        <span className="language-select__label" lang={selected.tag}>{selected.name}</span>
        <svg className="language-select__chevron" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>
      <ul
        className="language-picker__options"
        id={listId}
        role="listbox"
        aria-label={label}
        aria-hidden={!open}
        inert={!open}
      >
        {locales.map(({ code, name, tag }, index) => (
          <li
            className={`language-picker__option${index === activeIndex ? " is-active" : ""}`}
            key={code}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={code === locale}
            data-value={code}
            lang={tag}
            onPointerMove={() => setActiveIndex(index)}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
          >
            <span>{name}</span>
            {code === locale && <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4.5 10 3.5 3.5 7.5-7.5" /></svg>}
          </li>
        ))}
      </ul>
    </div>
  );
}
