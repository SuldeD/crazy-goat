"use client";

import { Text } from "@chakra-ui/react";

export const MText = ({ text, title, sub, ...props }) => (
  <Text
    w="fit-content"
    lineHeight={title ? (title == "sub" ? "16px" : "24px") : "16px"}
    fontSize={title ? ["24", null, "30px"] : "20px"}
    fontFamily="primary"
    fontWeight={title ? "700" : "600"}
    color={title ? "white" : sub ? "green.primary" : "white"}
    {...props}
  >
    {text}
  </Text>
);

export default MText;
