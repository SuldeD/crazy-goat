"use client";

import MText from "../../components/Text";
// import { MCard } from "../../components/Tournaments/index";
import { MCard } from "../../components//main/Tournaments";

// import { getTournaments } from "@/services/getService";
import { Flex, Stack, WrapItem } from "@chakra-ui/react";
import ToysCard from "./ToysCard";

export const Games = async () => {
  // const data = await getTournaments();

  const data = {
    data: {
      tournoments: [
        {
          id: 37,
          name: "Wolfest II festival",
          description:
            "We're thrilled to announce that we are organizing a tournament to celebrate the 2 year anniversary of MongolNFT! To mark this incredible milestone, we invite all gaming enthusiasts to participate in our special 2-Year Anniversary Tournament. ",
          image: "https://pin.ski/45SIJP5",
          token: {
            id: 1,
            name: "MATIC",
            address: "0x0000000000000000000000000000000000001010",
          },
          live_price: 0.01,
          address: "0x8135bc37E833f0239435BFA6D432EaB0f528D7Be",
          start_datetime: "2023-09-18T17:40:59+08:00",
          end_datetime: "2023-10-02T21:00:00+08:00",
          status: "active",
          create_user: {
            username: "tse",
            email: "tse@test.mn",
            id: 1,
            web3_name: "",
          },
          total_price: 1000,
        },
        {
          id: 15,
          name: "Infinte - Test Season",
          description: "test",
          image:
            "https://www.patriotsoftware.com/wp-content/uploads/2022/01/what-is-blockchain-1.jpg",
          token: {
            id: 1,
            name: "MATIC",
            address: "0x0000000000000000000000000000000000001010",
          },
          live_price: 0.01,
          address: "0x515152e241D890625e1423c6f67ecdaFefe29f1d",
          start_datetime: "2023-08-09T15:21:03+08:00",
          end_datetime: "2023-10-10T10:10:00+08:00",
          status: "active",
          create_user: {
            username: "tse",
            email: "tse@test.mn",
            id: 1,
            web3_name: "",
          },
          total_price: 0.0,
        },
      ],
    },
  };

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
