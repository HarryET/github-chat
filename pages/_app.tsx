import type { AppProps } from "next/app";
import { ThemeProvider, BaseStyles, Box } from "@primer/components";
import "styles/reset.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider dayScheme="light" nightScheme="dark" colorMode={theme}>
        <BaseStyles className={"root"}>
          <Box bg="canvas.default" className="root" height="100%">
            <Component {...pageProps} />
          </Box>
        </BaseStyles>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
