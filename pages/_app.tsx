import type { AppProps } from "next/app";
import { ThemeProvider, BaseStyles, theme } from "@primer/components";
import "styles/reset.css";
import { QueryClient, QueryClientProvider } from "react-query";
import deepmerge from "deepmerge";
import { supabase } from "service/supabase";
import router from "next/router";

const customTheme = deepmerge(theme, {
  colorSchemes: {
    // Customize an existing scheme
    dark: {
      colors: {
        text: {
          primary: "#f0f6fc",
        },
      },
    },
  },
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      router.push("/");
    }
  });

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider dayScheme="light" nightScheme="dark" colorMode={theme} theme={customTheme}>
        <BaseStyles className={"root"}>
          <Component {...pageProps} />
        </BaseStyles>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
