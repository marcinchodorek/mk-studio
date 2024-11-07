import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { localeCookie } from "~/api/sessions/locale.server";
import { Label } from "~/components/ui/label";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const locale = formData.get("locale") as string;

  return redirect("/settings", {
    headers: {
      "Set-Cookie": await localeCookie.serialize(locale),
    },
  });
}

export default function SettingsIndex() {
  const { submit } = useFetcher();
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "en",
  );

  const handleLanguageChange = async (locale: string) => {
    setSelectedLanguage(locale);
    submit(
      { locale },
      {
        method: "POST",
      },
    );
    await i18n.changeLanguage(locale);
  };

  return (
    <div className="font-sans p-4 w-full md:w-1/2">
      <Label htmlFor="scheduler-time-select">
        {t("settings_language_select_label")}
      </Label>
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger id="scheduler-time-select" className="w-full md:w-1/2">
          <SelectValue
            placeholder={t("settings_language_select_placeholder")}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="pl">Polski</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
