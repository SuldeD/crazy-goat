"use client";

// import { getTournaments } from "../../../lib/game/GET";
import {
  Card,
  CardBody,
  Wrap,
  Stack,
  Image,
  WrapItem,
  Text as CText,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MButton from "../../Button";
import HeadingText from "../../HeadingText";
import Text from "../../Text";

export const MCard = ({ id, Tg }) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const end_datetime = Tg?.end_datetime;

  useEffect(() => {
    const targetDate = new Date(end_datetime);
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeDifference = targetDate - now;

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        clearInterval(countdownInterval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [end_datetime]);

  const renderer = () => {
    const { days, hours, minutes, seconds } = countdown;

    return (
      <CText
        fontFamily="primary"
        fontSize="20px"
        fontWeight="500"
        mt="3"
        textColor="white"
      >
        {days > 0 && `${days}d `}
        {hours}h {minutes}m {seconds}s
      </CText>
    );
  };

  return (
    <Card
      key={id}
      w="full"
      rounded="20px"
      background="black"
      p="0"
      border="1px"
      borderColor="white"
    >
      <CardBody
        display={["block", null, "flex"]}
        pt="10"
        px="10"
        pb="14"
        gap="10"
      >
        <Stack w="1/3">
          <Image
            src={Tg?.image}
            h="260px"
            overflow="hidden"
            alt="Green double couch with wooden legs"
            borderRadius="lg"
            fit="cover"
          />
        </Stack>
        <Stack
          className="flex flex-col justify-between"
          w={["full", null, "80%"]}
        >
          <Stack spacing="5" mt={["5", "5", 0]}>
            <Text text={Tg?.name} title={true} />

            <Flex justifyContent="space-between" mt="10px">
              <Text text="Prize pool" />
              <Text
                sub={true}
                text={`${(Tg?.total_price).toString().slice(0, 5)} MATIC`}
              />
            </Flex>
            <Flex justifyContent="space-between">
              <Text text="Winner's Percentage of Reward" />
              <Text sub={true} text="100%" />
            </Flex>
          </Stack>

          <Flex
            display={["inline-grid", null, "flex"]}
            justify={["", null, "flex-end"]}
            gap="6"
          >
            {renderer()}

            <MButton
              text={"View Games"}
              w={["full", "100%", "50%", "20%"]}
              onClick={() => router.push(`tournament/${Tg.id}`)}
            />
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};

// export async function getTournaments({ TAGS }) {
//   const res = await fetch(
//     "https://api-game.mongolnft.com/api/tournoments-web3/?type=active",
//     {
//       next: { tags: [TAGS] },
//       cache: "no-cache",
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return res.json();
// }

export const Tournaments = async () => {
  // const products = await getTournaments({ TAGS: "tournaments" });

  // if (!products?.data?.tournoments?.length) return null;

  return (
    <Stack mt="32">
      <HeadingText text="Tournaments" />
      <Wrap
        spacing="30px"
        mt="50"
        w="full"
        align="center"
        justify="center"
        minH="50vh"
      >
        {products?.data?.tournoments?.map((Tg, id) => {
          return (
            <WrapItem w="full" key={id}>
              <MCard id={id} Tg={Tg} />
            </WrapItem>
          );
        })}
      </Wrap>
    </Stack>
  );
};

export default Tournaments;

const products = {
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
