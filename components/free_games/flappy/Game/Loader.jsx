import { Center, Image, Skeleton } from "@chakra-ui/react";

export const Loader = () => {
  return (
    <Center h="100vh" w="100%" p={5} minW={["100%", "100%", "480px"]}>
      <Center bg="gray.300" minH={["90vh"]} w="100%" pos="relative">
        <Skeleton
          w="100%"
          h="100%"
          pos="absolute"
          top={0}
          left={0}
          zIndex={1}
        />
        <Image
          src="/assets/images/silver.png"
          alt="loader"
          zIndex={2}
          h={["30px", "50px"]}
        />
      </Center>
    </Center>
  );
};
