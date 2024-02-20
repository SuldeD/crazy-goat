"use client";

import { Flex, HStack, Stack, Text, Wrap } from "@chakra-ui/react";
// import { AiOutlineGitlab } from "react-icons/ai";
import Xarrow from "react-xarrows";
import { BsInfo } from "react-icons/bs";
import Lottie from "lottie-react";
import Animation from "../../public/assets/animations/circle2.json";

export default function MainTitle() {
  return (
    <Stack mx="auto" w="100%" mt={["10", "30", "58"]}>
      <Wrap>
        <Text
          fontWeight="700"
          fontSize={["5xl", "6xl", "6xl", "8xl"]}
          size={["md", "md", "xl"]}
          p={["4", "4", "4", "5"]}
          textColor="black"
          textAlign="start"
          bg="green.primary"
          lineHeight="0.8"
        >
          Unlock
        </Text>
        <Text
          fontWeight="700"
          fontSize={["5xl", "6xl", "6xl", "8xl"]}
          size={["md", "md", "xl"]}
          p={["4", "4", "4", "5"]}
          textColor="black"
          textAlign="start"
          bg="white"
          lineHeight="0.8"
        >
          Freedom
        </Text>
      </Wrap>
      <HStack>
        <Text
          fontWeight="700"
          fontSize={["5xl", "6xl", "6xl", "8xl"]}
          size={["md", "md", "xl"]}
          p={["4", "4", "4", "5"]}
          textColor="black"
          textAlign="start"
          bg="yellow.primary"
          lineHeight="0.8"
        >
          Play
        </Text>
      </HStack>
      <HStack position="relative">
        <Text
          fontWeight="700"
          id="crazy-goat-text"
          fontSize={["5xl", "6xl", "6xl", "8xl"]}
          size={["md", "md", "xl"]}
          p={["4", "4", "4", "5"]}
          textColor="black"
          textAlign="start"
          bg="green.primary"
          lineHeight="0.8"
        >
          Web3 Games
        </Text>

        <Xarrow
          start={"crazy-goat-text"}
          end="mini-games-text"
          path="smooth"
          lineColor="white"
          showHead={false}
          strokeWidth={1}
          startAnchor="bottom"
          endAnchor="top"
        />
      </HStack>
      <Flex
        className="flex flex-col-reverse md:flex-row"
        justify="start"
        mt="50"
      >
        <HStack w={["full", null, "50%"]} justify="center">
          {/* <AiOutlineGitlab color="white" size="300px" height="100px" /> */}
          <Lottie className="h-[50vh] mt-4" animationData={Animation} />
        </HStack>

        <HStack
          mt="30"
          display="flex"
          position="relative"
          w={["full", null, "50%"]}
          h={["20vh", null, "10vh"]}
        >
          <Text
            py="1"
            px="2"
            w="40px"
            id="mini-games-text"
            fontWeight="700"
            fontSize="16"
            textAlign="center"
            rounded="50%"
            background="green.primary"
          >
            <BsInfo size="24px" />
          </Text>

          <Text
            fontWeight="700"
            position="absolute"
            left="12"
            top="2"
            fontSize="18"
            fontFamily="primary"
            textColor="white"
          >
            Web3 gaming is a process of decentralized gaming where the
            activities of a gaming ecosystem or a gaming platform, specifically
            that of the ownership of gaming assets and decision-making in all
            aspects of gaming, are delegated away from any central authority.
          </Text>
        </HStack>
      </Flex>
    </Stack>
  );
}
