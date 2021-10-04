import React from "react";
import { Box } from "@primer/components";

export const MainActionBox: React.FC = ({ children }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    padding={8}
    borderWidth={1}
    borderStyle="solid"
    borderColor="border.default"
    borderRadius={16}
    bg="canvas.subtle"
    width="100%"
    maxWidth={400}
  >
    {children}
  </Box>
);
