import { SystemStyleObject } from "@styled-system/css";

export const buttonGradient = {
  default: "linear-gradient(to right, rgb(48, 107, 201), 70%, rgb(68, 204, 149))",
  hover: "linear-gradient(to right, rgba(48, 107, 201, 0.9), 70%, rgba(68, 204, 149, 0.9))",
};

export const hideScrollBar = {
  overflowY: "scroll",
  scrollbarWidth: "none" /* Firefox */,
  msOverFlowStyle: "none" /* Internet Explorer 10+ */,
  "::-webkit-scrollbar": {
    width: 0,
    height: 0,
  },
} as const;
