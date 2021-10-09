import { Box } from "@primer/components";
import { CustomHeader } from "./CustomHeader";
import Head from "next/head";

export const Root: React.FC = ({ children }) => (
  <Box maxHeight="100%" height="100%" width="100%" display="flex" flexDirection="column" overflowY="hidden">
    <Head>
      <title>GitHub Chat | A chat room for every GitHub repository</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

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
    <CustomHeader showAvatar={true} />
    {children}
  </Box>
);
