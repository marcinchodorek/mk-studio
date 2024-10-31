import { useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export default function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();

  const handleSetTheme = useCallback(() => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  }, [theme, setTheme]);

  return (
    <Button variant="ghost" size="icon" onClick={handleSetTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t("btn_theme_toggle")}</span>
    </Button>
  );
}
