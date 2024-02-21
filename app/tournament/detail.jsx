import MButton from "../../components/Button";
import HeadingText from "../../components/HeadingText";
import {
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { AiFillHeart, AiFillStar, AiFillTrophy } from "react-icons/ai";
import { MdAccessTimeFilled } from "react-icons/md";
import { BsGiftFill } from "react-icons/bs";
import { buyLifeAPI } from "../../services/getService";
import { getTournamentContract } from "../../helper_contracts/TournamentContractHelper";
import { parse18 } from "../../helper_contracts/helpers";
import MInput from "../../components/Input";
import * as Yup from "yup";
import { useEffect, useState } from "react";

export const Detail = ({
  data: initialData,
  games,
  gameDetail,
  updateTournomentDetailData,
  tournoment,
}) => {
  const router = useRouter();
  const navigate = usePathname();
  const toast = useToast();

  const data = tournoment.length > 0 ? tournoment : initialData;

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const end_datetime = data?.end_datetime;

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

  const handleBuyLife = async (values) => {
    try {
      const { count } = values;
      const { tournamentWriteContract } = await getTournamentContract(
        data.address
      );
      const price = parse18(parseFloat(count / 100));
      const tx = await tournamentWriteContract.deposit({
        value: price,
      });
      await tx.wait();

      const info = JSON.stringify({
        transaction_hash: tx.hash,
        chain: "mumbai",
        tournoment_id: data.id,
      });

      const res = await buyLifeAPI(info);

      toast({
        title: "Success",
        description: `Success`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      // revalidateTag("tournaments");
      updateTournomentDetailData();
      return res;
    } catch (error) {
      console.log(error);
      toast({
        title: "Not buy life.",
        description: `${err.reason}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return null;
    }
  };

  const lifeSchema = Yup.object().shape({
    count: Yup.string().required("Required"),
  });

  const renderer = () => {
    const { days, hours, minutes, seconds } = countdown;

    return (
      <Text
        fontFamily="primary"
        fontSize="24px"
        fontWeight="500"
        textColor="yellow.primary"
      >
        {days > 0 && `${days}d `}
        {hours}h {minutes}m {seconds}s
      </Text>
    );
  };

  return (
    <Grid justify="center" templateColumns="repeat(12, 1fr)">
      <GridItem colSpan={12} position="relative">
        <Image
          src={data?.image}
          w="1350px"
          h="380px"
          overflow="hidden"
          justifyContent="center"
          alt={data?.img}
          objectFit="cover"
          opacity="0.4"
        />
        <Stack
          pos="absolute"
          left="-2"
          top={["50%", "50%", "50%"]}
          minW="50%"
          maxW="100%"
        >
          <Text
            fontWeight="700"
            w="full"
            fontSize={["4xl", "5xl", "6xl", "6xl"]}
            size={["md", "md", "xl"]}
            p={["3", "3", "2", "2"]}
            lineHeight="0.8"
            textColor="black"
            bg="yellow.primary"
            m="2"
            fontFamily="primary"
          >
            {data?.name}
          </Text>
        </Stack>
      </GridItem>

      <GridItem colSpan={12} my="16">
        <Text
          fontFamily="primary"
          fontSize="20px"
          lineHeight="1"
          textColor="white"
        >
          {data?.description}
        </Text>
      </GridItem>

      <GridItem colSpan={12} mt="5">
        <Flex justify="space-between" wrap="wrap" gap={["4", "4", 0, 0]}>
          <Stack w={["100%", "100%", "48%", "27%"]} spacing="4">
            <Stack
              borderRadius="20px"
              bg="whiteAlpha.100"
              px="5"
              justify="center"
              minH="100px"
            >
              <HStack mb="1">
                <Text fontFamily="primary" fontSize="20px" textColor="white">
                  My Score
                </Text>
                <Text fontFamily="primary" fontSize="18px" textColor="white">
                  <AiFillStar />
                </Text>
              </HStack>
              <Text
                fontFamily="primary"
                fontSize="32px"
                fontWeight="500"
                textColor="yellow.primary"
              >
                {gameDetail?.point}
              </Text>
            </Stack>
            <Stack
              borderRadius="20px"
              bg="whiteAlpha.100"
              px="5"
              justify="center"
              minH="100px"
            >
              <HStack mb="1">
                <Text fontFamily="primary" fontSize="20px" textColor="white">
                  Time
                </Text>
                <Text fontFamily="primary" fontSize="18px" textColor="white">
                  <MdAccessTimeFilled />
                </Text>
              </HStack>
              <Text
                fontFamily="primary"
                fontSize="32px"
                fontWeight="500"
                textColor="yellow.primary"
              >
                {renderer()}
              </Text>
            </Stack>
            <Stack
              borderRadius="20px"
              bg="whiteAlpha.100"
              px="5"
              justify="center"
              minH="100px"
            >
              <HStack mb="1">
                <Text fontFamily="primary" fontSize="20px" textColor="white">
                  Prize
                </Text>
                <Text fontFamily="primary" fontSize="18px" textColor="white">
                  <AiFillTrophy />
                </Text>
              </HStack>
              <HStack>
                <Text
                  fontFamily="primary"
                  fontSize="32px"
                  fontWeight="500"
                  textColor="yellow.primary"
                >
                  {data?.total_price?.toString().slice(0, 5)}
                </Text>
                <Text
                  fontFamily="primary"
                  fontSize="16px"
                  fontWeight="500"
                  textColor="yellow.primary"
                >
                  MATIC
                </Text>
              </HStack>
            </Stack>
          </Stack>

          <Stack
            w={["100%", "100%", "48%", "71.5%"]}
            borderRadius="20px"
            bg="whiteAlpha.100"
            px="6"
            py="6"
            justify="space-between"
            minH="100px"
          >
            <Stack>
              <HStack mb="1">
                <Text fontFamily="primary" fontSize="20px" textColor="white">
                  Life
                </Text>
                <Text fontFamily="primary" fontSize="18px" textColor="white">
                  <AiFillHeart />
                </Text>
              </HStack>
              <Text
                fontFamily="primary"
                fontSize="32px"
                fontWeight="500"
                textColor="yellow.primary"
              >
                {gameDetail?.tournoment_live}
              </Text>
            </Stack>
            <Stack my={["3", "3", 0, 0]}>
              <Text color="white" fontSize="16px">
                How to purchase lives:
              </Text>
              <Text color="white">
                <b className="text-[#deff1a]">1.</b>
                {`  Begin by navigating to the
                event you want to participate in.`}
                <br />
                <b className="text-[#deff1a]">2.</b>
                {`  In the "Life" section,
                input the quantity of lives you want to purchase, ensuring it
                falls within the range of 1 to 100.`}
                <br />
                <b className="text-[#deff1a]">3.</b>
                {`  When ready, click on "Buy
                Life"`}
                <br /> <b className="text-[#deff1a]">4.</b>
                {`  Carefully review the
                MetaMask pop-up window, ensuring your agreement with the
                associated fees for acquiring Matic. If in agreement, click
                "Confirm."`}
                <br />
                <b className="text-[#deff1a]">5.</b>
                {`  Following the confirmation,
                your purchased lives will be displayed under the "Life" section.`}
              </Text>
            </Stack>
            <Stack>
              <Formik
                validationSchema={lifeSchema}
                initialValues={{ count: "" }}
                onSubmit={async (values) => {
                  await handleBuyLife(values);
                  actions.setSubmitting(false);
                }}
              >
                {(props) => (
                  <Form>
                    <Flex w="full" gap="2" display={["block", null, "flex"]}>
                      <Field name="count">
                        {({ field, form }) => (
                          <>
                            <MInput
                              id="life"
                              mt="1"
                              min={1}
                              {...field}
                              placeholder="Life count"
                              type="number"
                            />
                            <Text color="rgba(255,145,0,.831)" mt="3">
                              {form.touched.count && form.errors.count}
                            </Text>
                          </>
                        )}
                      </Field>

                      <MButton
                        w={["full", null, "30%"]}
                        type="submit"
                        text="Buy Life"
                        isLoading={props.isSubmitting}
                      />
                    </Flex>
                  </Form>
                )}
              </Formik>
            </Stack>
          </Stack>

          {data?.id == "37" && (
            <GridItem colSpan={12} rounded="20px" mt={[0, 0, "4"]} mb="10">
              <Flex
                borderRadius="20px"
                bg="whiteAlpha.100"
                px="5"
                py="6"
                justify="space-between"
                align="start"
                display={["block", null, "flex"]}
              >
                <Stack>
                  <Stack>
                    <HStack>
                      <Text
                        fontFamily="primary"
                        fontSize="24px"
                        textColor="white"
                      >
                        Special Gift
                      </Text>
                      <Text
                        fontFamily="primary"
                        fontSize="18px"
                        textColor="white"
                        mb="1"
                      >
                        <BsGiftFill />
                      </Text>
                    </HStack>
                    <Text
                      fontFamily="primary"
                      fontSize="26px"
                      fontWeight="500"
                      mt="4"
                      textColor="yellow.primary"
                    >
                      Win a Maral NFT from The Marals NFT collection.
                    </Text>
                  </Stack>
                  <Text color="white" w={["full", null, "80%"]} mt="4">
                    {`The Mongolian Secret History" begins with, "Borte-chino, who
                    was born from the heavens, and his wife Gua-Maral, who came
                    across the seas and settled in the Burkhan Khaldun
                    mountains, the source of the Onon River. They gave birth to
                    a boy named Battsagaan`}
                  </Text>
                </Stack>

                <Image
                  rounded="20px"
                  h="250px"
                  cursor="pointer"
                  mt={["4", "4", 0]}
                  fit="contain"
                  onClick={() =>
                    window.open(
                      "https://opensea.io/assets/matic/0xc147b9f70df7891aabf9edb849809ca9925b38e8/8292?fbclid=IwAR1y0cNbm6IrBpRe4Z1yMSNVQA0imyHiG_T7509s62-iEV3wrGP-GJSxH0M",
                      "_blank"
                    )
                  }
                  alt="nft"
                  src="https://i.seadn.io/gcs/files/93b9ea8c17e4640f421271fc12b2dfdf.png?auto=format&dpr=1&w=1000"
                />
              </Flex>
            </GridItem>
          )}
        </Flex>
      </GridItem>
      <GridItem colSpan={12} mt="16">
        <Stack>
          <HeadingText text="Games" title={true} />
        </Stack>
        <Flex justify="space-between" wrap="wrap" mt="8" gap={["5", 0, 0]}>
          {games?.map((gm, id) => (
            <Card
              key={id}
              w={["100%", null, "49%"]}
              rounded="20px"
              mb="5"
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
                    {gm?.toy?.name}
                  </Text>
                  <HStack display={["none", null, "flex"]}>
                    <Text color="white">
                      {gm?.toy?.id == "1"
                        ? "The objective of Flappy Wolf is simple yet challenging: navigate the wolf through a series of obstacles by tapping the screen to make the wolf flap its wings and gain altitude."
                        : "Get ready for a thrilling and precision-filled adventure in Stick Ninja: Platform Drop Challenge! As a stick ninja master, your objective is to strategically drop platforms for your nimble ninja to traverse from one island to the next."}
                    </Text>
                  </HStack>
                  <HStack
                    justify="space-between"
                    my="5"
                    px="1"
                    display={["none", null, "flex"]}
                  >
                    <Text color="black" fontSize="16px" p="2" bg="pink.primary">
                      One Score Value:
                    </Text>
                    <Text
                      fontSize="20px"
                      fontFamily="primary"
                      fontWeight="700"
                      color="pink.primary"
                    >
                      {gm?.point_value_config}
                    </Text>
                  </HStack>
                  <HStack display={["none", null, "block"]}>
                    <MButton
                      text="Play"
                      w="80%"
                      onClick={() => {
                        gameDetail?.tournoment_live > 0
                          ? router.push(
                              `${navigate}/${(gm?.toy?.name).replace(/ /g, "")}`
                            )
                          : toast({
                              title: "No Lives Available.",
                              description: "You do not have any lives left.",
                              status: "error",
                              duration: 9000,
                              isClosable: true,
                            });
                      }}
                    />
                  </HStack>
                </Stack>
                <Stack
                  w={["100%", null, "45%"]}
                  mb={["8", "8", 0]}
                  justify="center"
                >
                  <Image
                    src={`/games/${(gm?.toy?.name).replace(/ /g, "")}.png`}
                    h="200px"
                    my={["6", 0, 0]}
                    className="grayscale"
                    fit="contain"
                    alt={`/games/${(gm?.toy?.name).replace(/ /g, "")}`}
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
                  <HStack justify="space-between" mb="5" px="1">
                    <Text color="black" fontSize="16px" p="2" bg="pink.primary">
                      One Score Value
                    </Text>
                    <Text
                      fontSize="20px"
                      fontFamily="primary"
                      fontWeight="700"
                      color="pink.primary"
                    >
                      {gm?.point_value_config}
                    </Text>
                  </HStack>

                  <MButton
                    w="full"
                    text="Play"
                    onClick={() => {
                      gameDetail?.tournoment_live > 0
                        ? router.push(
                            `${navigate}/${(gm?.toy?.name).replace(/ /g, "")}`
                          )
                        : toast({
                            title: "No Lives Available.",
                            description: "You do not have any lives left.",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                          });
                    }}
                  />
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Flex>
      </GridItem>
    </Grid>
  );
};
