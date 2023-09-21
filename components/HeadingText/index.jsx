import { Text } from "@chakra-ui/react";

export const HeadingText = ({ text, textColor }) => {
  return (
    <Text
      fontSize={["4xl", "4xl", "5xl"]}
      fontWeight="700"
      textColor={textColor ? textColor : "white"}
      lineHeight="1"
      textAlign="center"
      fontFamily="primary"
    >
      {text}
    </Text>
  );
};

export default HeadingText;
