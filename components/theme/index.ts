import { extendTheme } from "@chakra-ui/react";
import { components } from "./components";

// const fonts = {
//   heading:
//     "Heebo, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
//   body: "Heebo, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
//   primary:
//     "Rajdhani, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",

// };

const fonts = {
  body: "Rajdhani, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  primary:
    "Rajdhani, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
};

const fontSizes = {
  44: "2.75rem",
  40: "2.5rem",
  34: "2.125rem",
  30: "1.875rem",
  28: "1.75rem",
  24: "1.5rem",
  18: "1.125rem",
  16: "1rem",
  14: "0.875rem",
  13: "0.813rem",
  12: "0.75rem",
  10: "0.625rem",
  8: "0.5rem",
};

const colors = {
  "blue.moroccan": "#3E8BFF",
  "green.ultra": "#31FF6B",
  "gray.silver": "#BFBFBF",
  "gray.gainsboro": "#D9D9D9",
  "white.smoke": "#F6F6F6",
  "black.bg": "rgb(26 26 28)",
  "green.primary": "#02E111",
  "black.sub": "#19181C",
  "pink.primary": "#ff70e0",
  "yellow.primary": "#deff1a",
  "cyan.primary": "#08ffd0",
};

export const theme = extendTheme({
  fonts,
  fontSizes,
  colors,
  components,
  initialColorMode: "dark",
  useSystemColorMode: false,
});
