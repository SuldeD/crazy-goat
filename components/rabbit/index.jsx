"use client";

import { useEffect, useMemo, useState } from "react";
import { Reacteroids } from "./Reacteroids";
import "./style.css";
import * as Yup from "yup";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Flex,
  HStack,
  Stack,
  Text,
  Wrap,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import { Field, Form, Formik } from "formik";
import { getTournamentContract } from "../../helper_contracts/TournamentContractHelper";
import { buyLifeAPI, getToyInfo } from "../../services/getService";
import { useRouter } from "next/navigation";
import MButton from "../Button";
import MInput from "../Input";
import { parse18 } from "../../helper_contracts/helpers";

const Rabbit = ({ tour_id, gameDetail: initialGameDetail, data, jwtToken }) => {
  const sendDataToReacteroids = () => {
    const data = { message: "Hello from Rabbit!" };
    console.log("Data sent from Rabbit:", data);
  };

  const router = useRouter();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [gameDetailData, setAddGameDetailData] = useState();

  const gameDetail = useMemo(() => {
    return gameDetailData?.data?.tournoment_user
      ? gameDetailData?.data?.tournoment_user
      : initialGameDetail;
  }, [gameDetailData, initialGameDetail]);

  const updateTournomentDetailData = async () => {
    try {
      const toyRes = await getToyInfo({
        id: tour_id,
        jwtToken: jwtToken.value,
      });
      setAddGameDetailData(toyRes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyLife = async (values) => {
    try {
      const { count } = values;
      const { tournamentWriteContract } = await getTournamentContract(
        data.address
      );
      const price = parse18(parseFloat(count / 50));
      const tx = await tournamentWriteContract.deposit({
        value: price,
      });
      await tx.wait();

      const info = JSON.stringify({
        transaction_hash: tx.hash,
        chain: "mumbai",
        tournoment_id: data.id,
      });

      await buyLifeAPI(info);

      updateTournomentDetailData();
      onClose();

      toast({
        title: "Success",
        description: `Success`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      return null;
    } catch (error) {
      console.log(error);
      toast({
        title: "Not buy life.",
        description: `${error.reason || error.data.message || error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return null;
    }
  };

  const lifeSchema = Yup.object().shape({
    count: Yup.number().min(2).required("Required"),
  });

  useEffect(() => {
    gameDetail?.tournoment_live == 0 && onOpen();
  }, [gameDetail?.tournoment_live, onOpen]);

  return (
    <div>
      <Flex justify="center" gap="10">
        <AlertDialog motionPreset="slideInBottom" isOpen={isOpen} isCentered>
          <AlertDialogOverlay />
          <AlertDialogContent
            bg="black"
            rounded="20px"
            p="5"
            border={"1px solid white"}
          >
            <AlertDialogHeader textColor="white">Buy life</AlertDialogHeader>

            <AlertDialogBody>
              <Text mb="3" fontFamily="primary" fontSize="16px" color="white">
                description
              </Text>
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
                    <Stack w="full" gap="2">
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
                            <Text color="rgba(255,145,0,.831)" mt="1">
                              {form.touched.count && form.errors.count}
                            </Text>
                          </>
                        )}
                      </Field>

                      <MButton
                        w="full"
                        type="submit"
                        text="Buy Life"
                        isLoading={props.isSubmitting}
                      />

                      <MButton
                        mt="4"
                        w="full"
                        text="Exit"
                        isLoading={props.isSubmitting}
                        onClick={() => router.back()}
                      />
                    </Stack>
                  </Form>
                )}
              </Formik>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialog>
        <div>
          <Wrap justify="space-between" className="pb-10">
            <Stack
              borderRadius="20px"
              bg="whiteAlpha.100"
              px="5"
              justify="center"
              minH="100px"
              w={["100%", "32%", "30%"]}
            >
              <HStack mb="1">
                <Text fontFamily="primary" fontSize="20px" textColor="white">
                  Total Score
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
              w={["100%", "32%", "30%"]}
            >
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
          </Wrap>
          <Reacteroids
            tour_id={tour_id}
            updateTournomentDetailData={updateTournomentDetailData}
            life={gameDetail?.tournoment_live}
            data={data}
            onDataFromRabbit={sendDataToReacteroids}
            jwtToken={jwtToken}
          />
        </div>
      </Flex>
    </div>
  );
};

export default Rabbit;
