"use client";
import MButton from "../../components/Button";
import MInput from "../../components/Input";
import MText from "../../components/Text";
import { Stack, Text } from "@chakra-ui/layout";
import { Field, Form, Formik } from "formik";
// import { getHostFactoryContract } from "../contracts/HostContractHelper";
// import { ethers } from "ethers";
import * as Yup from "yup";
// import { useToast } from "@chakra-ui/react";

export default function Host() {
  // const toast = useToast();

  const hostSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, "UserName is too short!")
      .max(50, "UserName is too long!")
      .required("UserName is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .min(6, "Phone is too short!")
      .required("Phone is required"),
  });
  const createHost = async (values) => {
    console.log(values);
    // try {
    //   const { username, email, phone } = values;
    //   let { hostWriteContract } = await getHostFactoryContract();
    //   let { hostReadContract } = await getHostFactoryContract();
    //   let nftPrice = await hostReadContract.hostNFTPrice();
    //   const tx = await hostWriteContract.createHost(username, email, phone, {
    //     value: ethers.utils.parseEther(ethers.utils.formatUnits(nftPrice, 18)),
    //   });
    //   const response = await tx.wait();
    //   toast({
    //     title: "Tournament created.",
    //     description: "We've created tournament.",
    //     status: "success",
    //     duration: 9000,
    //     isClosable: true,
    //   });
    //   return response;
    // } catch (err) {
    //   console.log("err: ", err);
    //   toast({
    //     title: "Tournament not created.",
    //     description: `${err.message}`,
    //     status: "error",
    //     duration: 9000,
    //     isClosable: true,
    //   });
    //   return null;
    // }
  };

  return (
    <Formik
      className="w-full"
      validationSchema={hostSchema}
      initialValues={{ username: "", email: "", phone: "" }}
      onSubmit={async (values, actions) => {
        await createHost(values);
        actions.setSubmitting(false);
      }}
    >
      {(props) => (
        <Form className="w-full max-w-2xl">
          <Stack align="center" my="10">
            <MText title={true} text={"Become Host"} />
          </Stack>
          <Stack mb="6">
            <Text
              fontFamily="primary"
              fontWeight="600"
              fontSize="22px"
              color="white"
            >
              What is a Host NFT?
            </Text>
            <Text color="white" fontFamily="primary" fontSize="16px">
              - You can purchase a host NFT on the crazygoat platform and only
              those who own this NFT have the rights to host or organize a
              tournament. Purchasing this NFT grants you exclusive hosting and
              tournament organizing privileges. With this NFT, you gain the
              authority to define your tournament specifics, such as its
              duration, branding elements, prize pool and more.
            </Text>
          </Stack>
          <Stack spacing="4">
            <Field name="username">
              {({ field, form }) => (
                <>
                  <MInput {...field} placeholder="Username" />
                  <Text color="rgba(255,145,0,.831)">
                    {form.touched.username && form.errors.username}
                  </Text>
                </>
              )}
            </Field>
            <Field name="email">
              {({ field, form }) => (
                <>
                  <MInput {...field} placeholder="Email" />
                  <Text color="rgba(255,145,0,.831)">
                    {form.touched.email && form.errors.email}
                  </Text>
                </>
              )}
            </Field>
            <Field name="phone">
              {({ field, form }) => (
                <>
                  <MInput {...field} placeholder="Phone Number" type="number" />
                  <Text color="rgba(255,145,0,.831)">
                    {form.touched.phone && form.errors.phone}
                  </Text>
                </>
              )}
            </Field>
          </Stack>
          <MButton
            w="full"
            mt="5"
            text={"Coming soon"}
            isDisabled={true}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          />
        </Form>
      )}
    </Formik>
  );
}
