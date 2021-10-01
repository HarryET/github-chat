import type { AppProps } from 'next/app'
import { ThemeProvider, BaseStyles, Box } from '@primer/components'
import {createClient} from "@supabase/supabase-js";
import "../styles/reset.css";

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);

function MyApp({ Component, pageProps }: AppProps) {
  let theme: string | null = "night";

  if (typeof window !== "undefined") {
    theme = localStorage.getItem("theme");
    if(theme == null || theme == undefined || !["day", "night"].includes(theme)) {
      theme = "night";
      localStorage.setItem("theme", theme);
    }
  }

  return (
    // @ts-ignore
    <ThemeProvider dayScheme="light" nightScheme="dark" colorMode={theme}>
      <BaseStyles className={"root"}>
        <Box bg={"bg.primary"} className={"root"}>
          <Component {...pageProps} />
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
export default MyApp
