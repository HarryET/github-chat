import type { AppProps } from "next/app";
import { ThemeProvider, BaseStyles, Box } from "@primer/components";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { CustomHeader } from "components/CustomHeader";
import "styles/reset.css";

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
    <ThemeProvider dayScheme="light" nightScheme="dark" colorMode={theme}>
      <Head>
        <title>GitHub Chat | A chat room for every GitHub repository</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* TODO Set custom title in each page, especially for chat pages */}
        <meta name="title" content="GitHub Chat | A chat room for every GitHub repository" />
        <meta name="description" content="A chat room for every GitHub repository" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://github-chat.com/" />
        <meta property="og:title" content="GitHub Chat | A chat room for every GitHub repository" />
        <meta property="og:description" content="A chat room for every GitHub repository" />
        <meta property="og:image" content="https://github-chat.com/meta-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://github-chat.com/" />
        <meta property="twitter:title" content="GitHub Chat | A chat room for every GitHub repository" />
        <meta property="twitter:description" content="A chat room for every GitHub repository" />
        <meta property="twitter:image" content="https://github-chat.com/meta-image.png" />
      </Head>
      <BaseStyles className={"root"}>
        <QueryClientProvider client={queryClient}>
          <Box bg="canvas.default" className="root" height="100%">
            <Box maxHeight="100%" height="100%" width="100%" display="flex" flexDirection="column" overflowY="hidden">
              <CustomHeader showAvatar={true} />
              <Component {...pageProps} />
            </Box>
          </Box>
        </QueryClientProvider>
      </BaseStyles>
    </ThemeProvider>
  );
}
export default MyApp;
