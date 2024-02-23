import MText from "../../components/Text";
import Tournaments from "../../components/main/Tournaments/index";
import { getTournaments, getToys } from "../../services/getService";
import { Flex, Stack } from "@chakra-ui/react";
import ToysCard from "../../components/ToysCard";

export default async function Games() {
  const data = await getTournaments();
  const toys = await getToys();

  return (
    <Stack w="full">
      <Stack align="center" mt="10">
        <MText title={true} text={"Free Games"} />
      </Stack>
      <Flex justify="space-between" w="full" wrap="wrap" mt="8" gap="8">
        <ToysCard toys={toys} />
      </Flex>

      {/* <Stack align="center" mt="20">
        <MText title={true} text={"Tournaments"} />
      </Stack> */}

      {/* <Flex justify="space-between" w="full" wrap="wrap" mt="8" gap="8"> */}
      <Tournaments products={data} />
      {/* </Flex> */}
    </Stack>
  );
}
