import { ComponentStyleConfig } from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";

const FONT_FAMILY_INTER =
  "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";

const FONT_FAMILY_HEEBO =
  "Heebo, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";

const FONT_FAMILY_PRIMARY =
  "Rajdhani, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";

const Text: ComponentStyleConfig = {
  baseStyle: ({ colorMode }: StyleFunctionProps) => ({
    color: colorMode === "dark" ? "white" : "dark",
    fontSize: "14",
    lineHeight: "21px",
  }),
  sizes: {
    lg: {
      lineHeight: "35px",
    },
    xl: {
      lineHeight: "59px",
    },
  },
  variants: {
    yesevaOne: {
      fontFamily: FONT_FAMILY_HEEBO,
    },
    plusJakartaSans: {
      fontFamily: FONT_FAMILY_HEEBO,
    },
    commissioner: {
      fontFamily: FONT_FAMILY_HEEBO,
    },
    inter: {
      fontFamily: FONT_FAMILY_INTER,
    },
    primary: {
      fontFamily: FONT_FAMILY_PRIMARY,
    },
  },
  defaultProps: {},
};

const Input: ComponentStyleConfig = {
  parts: ["field"],
  baseStyle: () => ({
    field: {
      _focus: { boxShadow: "none !important" },
    },
  }),
  sizes: {},
  variants: {},
  defaultProps: {},
};

const Button: ComponentStyleConfig = {
  baseStyle: () => ({
    borderRadius: "10px",
    borderWidth: "1px",
    fontWeight: 500,
    py: "2",
    fontFamily: FONT_FAMILY_PRIMARY,
  }),
  sizes: {
    sm: {
      fontSize: "14",
      height: "40px",
    },
    md: {
      fontSize: "16px",
      height: "45px",
    },
    lg: {
      fontSize: "18px",
      height: "60px",
    },
  },
  variants: {
    outline: {
      borderColor: "black",
      // fontWeight: 700,
      fontSize: 16,
    },
    red: {
      bg: "red.500",
      color: "white",
    },
    unstyled: {
      borderWidth: "0px",
      textColor: "white",
    },
    solid: {
      bg: "black",
      textColor: "white",
      _hover: {
        bg: "black",
        _disabled: {
          bg: "black",
          opacity: 0.8,
        },
      },
    },
    yesevaOne: {
      fontFamily: FONT_FAMILY_HEEBO,
      bg: "black",
      textColor: "white",
    },
    plusJakartaSans: {
      fontFamily: FONT_FAMILY_HEEBO,
      borderColor: "black",
    },
    commissioner: {
      fontFamily: FONT_FAMILY_HEEBO,
    },
    secondary: {
      bg: "white",
      color: "black",
      borderColor: "black",
    },
    inter: {
      fontFamily: FONT_FAMILY_INTER,
    },
  },
  defaultProps: {},
};

export const components = {
  Input,
  Text,
  Button,
};
