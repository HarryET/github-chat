import type { AppProps } from "next/app";

import "styles/reset.less";
import "styles/emoji.less";

function MyApp({ Component, pageProps }: AppProps) {
  let theme: "day" | "night" | "auto" = "night";

  if (typeof window !== "undefined") {
    const tempTheme = localStorage.getItem("theme");
    if (tempTheme == null || tempTheme == undefined || !["day", "night"].includes(tempTheme)) {
      theme = "night";
      localStorage.setItem("theme", theme);
    } else {
      theme = tempTheme as "day" | "night" | "auto";
    }
  }

  return (
    <Component {...pageProps} />
  );
}
export default MyApp;
