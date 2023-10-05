"use client";

import { useState } from "react";
import StickNinja from "../../../../components/stick_hero/Ninja";
import { Game } from "../../../../components/flappy_wolf/Game";
import Cookies from "universal-cookie";
import { getTournament, getToyInfo } from "services/getService";
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
import MInput from "../../../../components/Input";
import MButton from "../../../../components/Button";
import { getTournamentContract } from "helper_contracts/TournamentContractHelper";
import { parse18 } from "../../../../helper_contracts/helpers";
import { buyLifeAPI } from "services/getService";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

export default async function Tournament({ params }) {
  const cookies = new Cookies();
  const jwtToken = cookies.get("jwtToken");
  const toast = useToast();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tournoment, setTournoment] = useState("");

  const toyRes = await getToyInfo({ id: params.slag, jwtToken: jwtToken });
  const initialData = await getTournament(params.slag);

  const data = tournoment.length > 0 ? tournoment : initialData;

  const updateTournomentDetailData = async () => {
    try {
      const data = await getTournament(params.slag);
      setTournoment(data);
    } catch (error) {}
  };

  const handleBuyLife = async (values) => {
    try {
      const { count } = values;
      let { tournamentWriteContract } = await getTournamentContract(
        data?.data?.tournoment?.address
      );
      let price = parse18(parseFloat(count / 100));
      const tx = await tournamentWriteContract.deposit({
        value: price,
      });
      await tx.wait();

      console.log("tx hash: ", tx.hash, data.id);

      let info = JSON.stringify({
        transaction_hash: tx.hash,
        chain: "polygon",
        tournoment_id: data?.data?.tournoment?.id,
      });
      const res = await buyLifeAPI(info);

      toast({
        title: "Success",
        description: `Success`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      updateTournomentDetailData();
      onClose();
      window.location.reload();
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

  return (
    <div className="w-full">
      {params.name == "StickNinja" && (
        <StickNinja
          tour_id={params?.slag}
          updateTournomentDetailData={updateTournomentDetailData}
          data={data?.data?.tournoment}
          total={toyRes?.data?.tournoment_user?.point}
          life={toyRes?.data?.tournoment_user?.tournoment_live}
        />
      )}
      {params.name == "FlappyWolf" && (
        <Flex justify="center" gap="10">
          <AlertDialog motionPreset="slideInBottom" isOpen={isOpen} isCentered>
            <AlertDialogOverlay />
            <AlertDialogContent bg="black" rounded="20px" p="5">
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
          <Wrap justify="space-between" wrap={true} mb="8">
            <Stack
              borderRadius="20px"
              bg="whiteAlpha.100"
              px="5"
              justify="center"
              minH="100px"
              w={["100%", "100%", "100%"]}
              mb="4"
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
                {toyRes?.data?.tournoment_user?.point}
              </Text>
            </Stack>
            <Stack
              borderRadius="20px"
              bg="whiteAlpha.100"
              px="5"
              justify="center"
              minH="100px"
              w={["100%", "100%", "100%"]}
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
                {toyRes?.data?.tournoment_user?.tournoment_live}
              </Text>
            </Stack>
          </Wrap>
          <Game
            tour_id={params?.slag}
            onOpen={onOpen}
            updateTournomentDetailData={updateTournomentDetailData}
            life={toyRes?.data?.tournoment_user?.tournoment_live}
          />
        </Flex>
      )}
    </div>
  );
}
