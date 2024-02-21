/* eslint-disable no-unused-vars */
"use client";

import { getTournamentFactoryContract } from "../../helper_contracts/TournamentFactoryContractHelper";
import {
  parse18,
  convertPercentagesToWeiArray,
} from "../../helper_contracts/helpers";
import MButton from "../Button";
import MInput from "../Input";
import MText from "../Text";
import { createTournamentAPI } from "../../services/getService";
import { Stack, Text } from "@chakra-ui/layout";
import { Field, Form, Formik } from "formik";
import moment from "moment";
import { Image, Select, useToast } from "@chakra-ui/react";
import * as Yup from "yup";
import { useState } from "react";

export default function CreateTournament() {
  const toast = useToast();
  const [selectData, setSelectData] = useState();

  const createTournament = async (values) => {
    try {
      const { name, endTime, desc, image } = values;

      const { tournamentFactoryWriteContract, tournamentFactoryReadContract } =
        await getTournamentFactoryContract();
      console.log(
        tournamentFactoryReadContract,
        "tournamentFactoryReadContract"
      );
      console.log(
        tournamentFactoryWriteContract,
        "tournamentFactoryWriteContract"
      );
      let tournamentDetails = [name, image];
      let dateEnd = moment(endTime).unix();
      let endtime = dateEnd - Math.floor(Date.now() / 1000);
      const percentages = [50, 30, 20];
      const tx = await tournamentFactoryWriteContract.createTournament(
        window?.ethereum?.selectedAddress,
        endtime,
        percentages,
        tournamentDetails
      );
      await tx.wait();
      !tx &&
        toast({
          title: "Tournament not created.",
          description: `${err.reason}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      let tournamentLength =
        await tournamentFactoryReadContract.getTournamentLength();
      let tournamentAddress =
        await tournamentFactoryReadContract.getTournamentAddress(
          tournamentLength
        );
      const present = new Date();
      const outputPresent = `${present.getFullYear()}/${
        present.getMonth() + 1
      }/${present.getDate()} ${present.getHours()}:${present.getMinutes()}:`;
      const date = new Date(endTime);
      const output = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

      console.log("Tournament Address: ", tournamentAddress);
      console.log("Name: ", name);
      console.log("Description: ", desc);
      console.log("Image: ", image);

      let data = JSON.stringify({
        address: tournamentAddress,
        name: name,
        description: desc,
        image: image,
        token_id: 1,
        live_price: 0.01,
        start_datetime: `${outputPresent}59`,
        end_datetime: output,
        toy_ids: [1, 3, 4],
        nfts: [],
        winner_percentage: 90,
      });

      const res = await createTournamentAPI(data);
      console.log(res);
      toast({
        title: "Tournament created.",
        description: "We've created tournament.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      return res;
    } catch (err) {
      console.log("err: ", err.reason);
      toast({
        title: "Tournament not created.",
        description: `${err.reason}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return null;
    }
  };

  const createSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").required("Name is required"),
    endTime: Yup.string().required("Time is required"),
    desc: Yup.string().required("Description is required"),
    image: Yup.string().required("Image url is required"),
  });

  return (
    <Formik
      className="w-full"
      validationSchema={createSchema}
      initialValues={{
        name: "",
        admin: "",
        endTime: "",
        desc: "",
        image: "",
      }}
      onSubmit={async (values, actions) => {
        await createTournament(values);
        actions.setSubmitting(false);
      }}
    >
      {(props) => (
        <Form className="w-full max-w-2xl mx-auto">
          <Stack align="center" my="10">
            <MText title={true} text={"Create Tournament"} />
          </Stack>
          <Stack spacing="4">
            {/* <Field name="admin">
              {({ field, form }) => {
                return (
                  <>
                    <MInput {...field} placeholder="Admin address" />
                    <Text color="rgba(255,145,0,.831)">
                      {form.touched.admin && form.errors.admin}
                    </Text>
                  </>
                );
              }}
            </Field> */}
            <Field name="name">
              {({ field, form }) => (
                <>
                  <MInput {...field} placeholder="Name" />
                  <Text color="rgba(255,145,0,.831)">
                    {" "}
                    {form.touched.name && form.errors.name}
                  </Text>
                </>
              )}
            </Field>
            <Field name="endTime">
              {({ field, form }) => (
                <>
                  <MInput
                    {...field}
                    placeholder="Tournament End Time"
                    type="datetime-local"
                  />
                  <Text color="rgba(255,145,0,.831)">
                    {form.touched.endTime && form.errors.endTime}
                  </Text>
                </>
              )}
            </Field>
            <Field name="desc">
              {({ field, form }) => (
                <>
                  <MInput {...field} placeholder="Description" />
                  <Text color="rgba(255,145,0,.831)">
                    {form.touched.desc && form.errors.desc}
                  </Text>
                </>
              )}
            </Field>
            <Field name="image">
              {({ field, form }) => (
                <>
                  <MInput {...field} placeholder="IMAGE" />
                  <Text color="rgba(255,145,0,.831)">
                    {form.touched.image && form.errors.image}
                  </Text>
                </>
              )}
            </Field>
            {/* <Select
              placeholder="Select"
              textColor="white"
              rounded="35px"
              border="1px"
              iconColor="white"
              onChange={(e) => {
                setSelectData(e.target.value);
                return e;
              }}
            >
              <option value="pub">Public</option>
              <option value="wolf">The Wolves</option>
              <option value="maral">The Marals</option>
            </Select> */}
            {/* {!selectData && (
              <Text color="rgba(255,145,0,.831)">Select is required</Text>
            )} */}
            {/* {selectData && selectData !== "pub" && (
              <Image
                onClick={() => {
                  selectData == "wolf"
                    ? window.open(
                        "https://opensea.io/collection/thewolvesmint",
                        "_blank"
                      )
                    : selectData == "maral"
                    ? window.open(
                        "https://opensea.io/collection/the-marals",
                        "_blank"
                      )
                    : null;
                }}
                cursor="pointer"
                rounded="35px"
                border="1px"
                iconColor="white"
                opacity="0.8"
                w="full"
                height="200px"
                objectFit="cover"
                alt={`${selectData} image`}
                src={
                  selectData == "wolf"
                    ? "games/wolves.avif"
                    : selectData == "maral"
                    ? "games/marals.avif"
                    : ""
                }
              />
            )} */}
          </Stack>
          <MButton
            w="full"
            mt="5"
            text={"Submit"}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          />
        </Form>
      )}
    </Formik>
  );
}
