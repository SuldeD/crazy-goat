"use client";

import MText from "../../components/Text";
import { MCard } from "../../components/main/Tournaments/index";
import { getTournaments } from "../../services/getService";
import { Flex, Stack, WrapItem } from "@chakra-ui/react";
import ToysCard from "./ToysCard";

export const Games = async () => {
  const data = await getTournaments();

  return (
    <Stack w="full">
      <Stack align="center" mt="10">
        <MText title={true} text={"Free Games"} />
      </Stack>
      <Flex justify="space-between" w="full" wrap="wrap" mt="8" gap="8">
        <ToysCard />
      </Flex>
      <Stack align="center" mt="20">
        <MText title={true} text={"Tournaments"} />
      </Stack>

      <Flex justify="space-between" w="full" wrap="wrap" mt="8" gap="8">
        {data?.data?.tournoments?.map((Tg, id) => {
          return (
            <WrapItem w="full" key={id}>
              <MCard id={id} Tg={Tg} />
            </WrapItem>
          );
        })}
      </Flex>
    </Stack>
  );
};

export default Games;
