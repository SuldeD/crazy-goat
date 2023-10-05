// import { getToys } from "../../../services/getService";
import {
  Card,
  CardBody,
  Flex,
  HStack,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import MButton from "../Button";

export default async function ToysCard({ toys }) {
  return (
    <Flex justify="space-between" w="full" wrap="wrap" gap="8">
      {toys?.data?.toys?.map((gm, id) => (
        <Card
          key={id}
          w={["100%", null, "48%"]}
          rounded="20px"
          minH="300px"
          background="black"
          border="1px"
          borderColor="white"
        >
          <CardBody
            display={["block", null, "flex"]}
            p="8"
            py="10"
            justifyContent="space-between"
          >
            <Stack
              className="flex flex-col justify-between"
              w={["full", null, "50%"]}
            >
              <Text
                fontWeight="700"
                fontFamily="primary"
                fontSize={["3xl", "4xl", "3xl"]}
                size={["xl", "xl", "xl"]}
                mb={["8", "8", 0]}
                textColor="white"
                textAlign={["center", null, "start"]}
                me="4"
              >
                {gm?.name}
              </Text>
              <HStack display={["none", null, "flex"]} mb="4">
                <Text color="white">
                  {gm?.toy?.id == 1
                    ? "The objective of Flappy Wolf is simple yet challenging: navigate the wolf through a series of obstacles by tapping the screen to make the wolf flap its wings and gain altitude."
                    : "Get ready for a thrilling and precision-filled adventure in Stick Ninja: Platform Drop Challenge! As a stick ninja master, your objective is to strategically drop platforms for your nimble ninja to traverse from one island to the next."}
                </Text>
              </HStack>

              <HStack display={["none", null, "block"]}>
                <Link href={`games/${(gm?.name).replace(/ /g, "")}`}>
                  <MButton text="Play" w="80%" />
                </Link>
              </HStack>
            </Stack>
            <Stack
              w={["100%", null, "45%"]}
              mb={["8", "8", 0]}
              justify="center"
            >
              <Image
                src={`/games/${(gm?.name).replace(/ /g, "")}.png`}
                h="200px"
                my={["6", 0, 0]}
                fit="contain"
                className="grayscale"
                alt={`/games/${(gm?.name).replace(/ /g, "")}`}
              />
            </Stack>
            <Stack display={["block", null, "none"]} w="full">
              <HStack display={["flex", null, "none"]} my="4">
                <Text color="white">
                  {gm?.toy?.id == "1"
                    ? "The objective of Flappy Wolf is simple yet challenging: navigate the wolf through a series of obstacles by tapping the screen to make the wolf flap its wings and gain altitude."
                    : "Get ready for a thrilling and precision-filled adventure in Stick Ninja: Platform Drop Challenge! As a stick ninja master, your objective is to strategically drop platforms for your nimble ninja to traverse from one island to the next."}
                </Text>
              </HStack>
              <Link href={`games/${(gm?.name).replace(/ /g, "")}`}>
                <MButton text="Play" w="full" />
              </Link>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Flex>
  );
}
