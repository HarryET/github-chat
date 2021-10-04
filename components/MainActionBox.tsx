import React from "react";
import { Box, BoxProps } from "@primer/components";

export const MainActionBox: React.FC<BoxProps> = ({
  children,
  ...boxProps
}) => (
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
    {...boxProps}
  >
    {children}
  </Box>
);
