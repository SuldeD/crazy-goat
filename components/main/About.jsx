import { Grid, GridItem, HStack, Image, Stack, Text } from "@chakra-ui/react";
import HeadingText from "../HeadingText";

const data = [
  {
    img: "/search.svg",
    title: "1. Transparency",
    desc: "All participants can see and verify the rules, and there is no need to rely on a third party to enforce them.",
  },
  {
    img: "/security.svg",
    title: "2. Security",
    desc: "The code cannot be tampered with or hacked, and the results of the tournament are final and cannot be altered.",
  },
  ,
  {
    img: "/stonks.svg",
    title: "3. Cost-effective",
    desc: "Participants can receive higher payouts and entry fees can be lower. And supports all of the ERC-20 tokens.",
  },
];

export const Item = ({ data, id }) => (
  <>
    <HStack justify="center">
      <Image src={data?.img} w="30px" h="30px" alt={`${data.name} image`} />
    </HStack>
    <HStack justify="center" mt="4">
      <Text
        fontSize={["xl", "3xl", "3xl"]}
        fontWeight="700"
        p="4"
        textColor="black"
        fontFamily="primary"
        background={id == 1 ? "yellow.primary" : "cyan.primary"}
      >
        {data?.title}
      </Text>
    </HStack>

    <HStack justify="center" mt="4">
      <Text
        fontSize={["md", "md", "md"]}
        fontWeight="400"
        textColor="white"
        fontFamily="primary"
        textAlign="center"
      >
        {data?.desc}
      </Text>
    </HStack>
  </>
);

export const About = () => {
  return (
    <Stack mt="100px">
      <HStack display="inline-grid">
        <HeadingText text="What is Web 3.0 Tournament?" />
      </HStack>

      <Grid
        justify="center"
        mt="50px"
        templateColumns="repeat(12, 1fr)"
        gap={["0", "4", "8"]}
      >
        {data?.map((data, id) => (
          <GridItem
            key={id}
            colSpan={[12, 12, 4]}
            bg="black"
            border="1px"
            borderColor="white"
            px="6"
            pt="8"
            pb="8"
            rounded="20px"
            mt="2"
          >
            <Item data={data} id={id} />
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
