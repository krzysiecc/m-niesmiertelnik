import { useTranslation } from "react-i18next";

/** Small toggle that switches the UI between Polish and English. */
export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage === "en" ? "en" : "pl";
  const next = current === "pl" ? "en" : "pl";

  return (
    <button
      onClick={() => i18n.changeLanguage(next)}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-background-tertiary text-sm font-bold text-text-primary transition-colors hover:bg-border-primary cursor-pointer"
      aria-label={t("language.switch")}
      title={t("language.switch")}
    >
      {next.toUpperCase()}
    </button>
  );
};
