"use client";

import {
  Card,
  CardBody,
  Wrap,
  Stack,
  Image,
  WrapItem,
  Text as CText,
  Flex,
  TabList,
  TabIndicator,
  TabPanels,
  TabPanel,
  Tabs,
  Tab,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyMessage } from "services/checkSIWE";
import MButton from "../../Button";
import HeadingText from "../../HeadingText";
import Text from "../../Text";
import { FiInbox } from "react-icons/fi";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";

export function MCard({ id, Tg, history }) {
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

            <ConnectKitButton.Custom>
              {({ isConnected, show, address }) => {
                return (
                  <MButton
                    text={
                      isConnected === false ? "Connect Wallet" : "View Games"
                    }
                    w={["full", "100%", "50%", "20%"]}
                    onClick={() => {
                      isConnected === false && show();
                      address === undefined && show();
                      !history && isConnected === true && verifyMessage();
                      isConnected === true &&
                        router.push(`tournament/${Tg.id}`);
                    }}
                  />
                );
              }}
            </ConnectKitButton.Custom>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default function Tournaments({ products }) {
  const [tab, setTab] = useState();

  return (
    <Stack mt="32">
      <HeadingText text="Tournaments" />

      <Tabs
        position="relative"
        variant="unstyled"
        onChange={(index) => setTab(index)}
      >
        <TabList
          gap="12"
          mt="4"
          variant="unstyled"
          colorscheme="green"
          justifyContent={["center", "start", "start"]}
          w="full"
        >
          <Tab
            className="bg-white text-black rounded-[32px]"
            position="relative"
            _selected={{ bg: "#02E111" }}
          >
            <CText fontFamily="primary" fontWeight="700" fontSize="24px" p="2">
              Active
            </CText>
            <Stack position="absolute" right="-12" top="-2" p="2" px="3">
              <CText
                bg={(tab == 0) | (tab == null) ? "green.primary" : "white"}
                px="2"
                rounded="32px"
                fontFamily="primary"
                fontWeight="600"
                fontSize="18px"
              >
                01
              </CText>
            </Stack>
          </Tab>
          <Tab
            className="bg-white text-black rounded-[32px]"
            position="relative"
            _selected={{ bg: "#02E111" }}
          >
            <CText fontFamily="primary" fontWeight="700" fontSize="24px" p="2">
              History
            </CText>
            <Stack position="absolute" right="-12" top="-2" p="2" px="3">
              <CText
                bg={tab == 1 ? "green.primary" : "white"}
                px="2"
                rounded="32px"
                fontFamily="primary"
                fontWeight="600"
                fontSize="18px"
              >
                02
              </CText>
            </Stack>
          </Tab>
        </TabList>
        <TabIndicator />
        <TabPanels>
          <TabPanel>
            <Wrap
              spacing="30px"
              mt="50"
              w="full"
              align="center"
              justify="center"
              minH="20vh"
            >
              {products?.data?.tournoments?.length > 0 &&
              products?.data?.tournoments?.some(
                (tg) => tg.status === "active"
              ) ? (
                products?.data?.tournoments
                  ?.filter((tg) => tg.status === "active")
                  .map((Tg, id) => {
                    return (
                      <WrapItem w="full" key={id}>
                        <MCard id={id} Tg={Tg} />
                      </WrapItem>
                    );
                  })
              ) : (
                <Flex justify="center">
                  <Stack w="full">
                    <HStack justify="center">
                      <FiInbox className="text-white" size="50px" />
                    </HStack>
                    <CText textColor="white" textAlign="center">
                      No tournament
                    </CText>
                  </Stack>
                </Flex>
              )}
            </Wrap>
          </TabPanel>
          <TabPanel>
            <Wrap
              spacing="30px"
              mt="50"
              w="full"
              align="center"
              justify="center"
              minH="20vh"
            >
              {products?.data?.tournoments?.length > 0 &&
              products?.data?.tournoments?.some(
                (tg) => tg.status === "history"
              ) ? (
                products?.data?.tournoments
                  ?.filter((tg) => tg.status === "history")
                  .map((Tg, id) => {
                    return (
                      <WrapItem w="full" key={id}>
                        <MCard id={id} Tg={Tg} history={true} />
                      </WrapItem>
                    );
                  })
              ) : (
                <Flex justify="center">
                  <Stack w="full">
                    <HStack justify="center">
                      <FiInbox className="text-white" size="50px" />
                    </HStack>
                    <CText textColor="white" textAlign="center">
                      No tournament
                    </CText>
                  </Stack>
                </Flex>
              )}
            </Wrap>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
