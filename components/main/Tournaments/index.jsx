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
              onClick={() => router.push(`tournament/${Tg.id}`)}
            />
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};

export async function getTournaments({ TAGS }) {
  const res = await fetch(
    "https://api-game.mongolnft.com/api/tournoments-web3/?type=active",
    {
      next: { tags: [TAGS] },
      cache: "no-cache",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export const Tournaments = async () => {
  const products = await getTournaments({ TAGS: "tournaments" });

  if (!products?.data?.tournoments?.length) return null;

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
