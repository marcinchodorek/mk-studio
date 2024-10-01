import { createThemeAction } from "remix-themes";
import { themeSessionResolver } from "~/api/sessions/theme.server";

export const action = createThemeAction(themeSessionResolver);
