import Tournaments from "../../components/main/Tournaments/index";
import { getTournaments, getToys } from "../../services/getService";
import { Flex, Stack } from "@chakra-ui/react";
import ToysCard from "../../components/ToysCard";

export default async function Games() {
  const data = await getTournaments();
  const toys = await getToys();

  return (
    <Stack w="full">
      <Flex justify="space-between" w="full" wrap="wrap" mt="8" gap="8">
        <ToysCard toys={toys} />
      </Flex>

      <Tournaments products={data} />
    </Stack>
  );
}
