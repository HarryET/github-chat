import type { AppProps } from "next/app";
import { ThemeProvider, BaseStyles, Box } from "@primer/components";
import { createClient } from "@supabase/supabase-js";
import { Octokit } from "@octokit/rest";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/styles.scss";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  let theme: "day" | "night" | "auto" = "night";

  if (typeof window !== "undefined") {
    let tempTheme = localStorage.getItem("theme");
    if (
      tempTheme == null ||
      tempTheme == undefined ||
      !["day", "night"].includes(tempTheme)
    ) {
      theme = "night";
      localStorage.setItem("theme", theme);
    } else {
      theme = tempTheme as "day" | "night" | "auto";
    }
  }

  return (
    // @ts-ignore
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
