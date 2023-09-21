// import { getHostNftContract } from "@/app/contracts/HostNFTContractHelper";
// import MText from "@/components/Text";
import {
  Grid,
  GridItem,
  Flex,
  Stack,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
// import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaDiscord,
} from "react-icons/fa";

const HeaderMenuItem = ({ label, href, onClose }) => {
  return (
    <Link href={href} onClick={onClose}>
      <div style={{ width: "fit-content" }}>
        <Stack
          cursor="pointer"
          color="white"
          w={["full", null, "fit-content"]}
          _hover={{ transition: "0.4s", color: "green.primary" }}
        >
          <Text
            w="fit-content"
            fontSize={["22", null, "26"]}
            fontFamily="primary"
            fontWeight="600"
          >
            {label}
          </Text>
        </Stack>
      </div>
    </Link>
  );
};

const Icon = ({ icon }) => {
  const { key } = icon;
  return (
    <HStack
      textColor="white"
      _hover={{
        transition: "0.4s",
        textColor: `${
          key == "fb"
            ? "#1976F2"
            : key == "ig"
            ? "#E4405F"
            : key == "tw"
            ? "#1A8CD8"
            : key == "di"
            ? "#5766F1"
            : key == "li" && "#1A8CD8"
        }`,
        cursor: "pointer",
      }}
    >
      {icon}
    </HStack>
  );
};

export const Footer = () => {
  // const [userHost, setUserHost] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { hostNftReadContract } = await getHostNftContract();
  //       const balance = await hostNftReadContract.balanceOf(
  //         window.ethereum.selectedAddress
  //       );
  //       setUserHost(balance?.toNumber() > 0);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const MENU_ITEMS = userHost
  //   ? [
  //       { label: "Home", href: "/" },
  //       { label: "Games", href: "/games" },
  //       { label: "Ranking", href: "/ranking" },
  //       { label: "Create", href: "/create" },
  //     ]
  //   : [
  //       { label: "Home", href: "/" },
  //       { label: "Games", href: "/games" },
  //       { label: "Ranking", href: "/ranking" },
  //       { label: "Host", href: "/host" },
  //     ];

  const MENU_ITEMS = [
    { label: "Home", href: "/" },
    { label: "Games", href: "/games" },
    { label: "Ranking", href: "/ranking" },
    { label: "Host", href: "/host" },
  ];
  const icons = [
    <FaFacebookF size={30} key="fb" />,
    <FaInstagram size={30} key="ig" />,
    <FaTwitter size={30} key="tw" />,
    <FaDiscord size={30} key="di" />,
    <FaLinkedinIn size={30} key="li" />,
  ];
  return (
    <Stack w="100%" mt="30" mb="10">
      <Grid templateColumns="repeat(12,1fr)">
        <GridItem colSpan={[12, 12, 6]}>
          <HStack mb="6" display={["none", null, "inline-block"]}>
            <Text
              fontWeight="700"
              fontSize={["3xl", "4xl", "5xl", "5xl"]}
              size={["md", "md", "md"]}
              p={["3", "2", "2", "3"]}
              textColor="black"
              bg="yellow.primary"
              mb="2"
            >
              Unlock
            </Text>
            <Text
              fontWeight="700"
              fontSize={["3xl", "4xl", "5xl", "5xl"]}
              size={["md", "md", "md"]}
              p={["3", "2", "2", "3"]}
              textColor="black"
              bg="pink.primary"
            >
              Freedom
            </Text>
          </HStack>
          <HStack mb="6" w="full" display={["inline-block", null, "none"]}>
            <Text
              fontWeight="700"
              fontSize={["3xl", "4xl", "5xl", "5xl"]}
              size={["md", "md", "xl"]}
              p={["3", "2", "2", "2"]}
              textColor="black"
              textAlign="center"
              bg="yellow.primary"
              mb="2"
            >
              Unlock
            </Text>
            <Text
              fontWeight="700"
              fontSize={["3xl", "4xl", "5xl", "5xl"]}
              size={["md", "md", "xl"]}
              p={["3", "2", "2", "2"]}
              textColor="black"
              textAlign="center"
              bg="pink.primary"
            >
              Freedom
            </Text>
          </HStack>

          <Stack mt="9" ms="2" display={["none", null, "block"]}>
            <Text fontSize="14" textColor="white">
              CRAZY GOAT © {new Date().getFullYear()} | All Rights Reserved
            </Text>
          </Stack>
        </GridItem>
        <GridItem colSpan={[12, 12, 6]} display="inline-block">
          <Flex gap={["4", null, "8"]} justify={["center", null, "start"]}>
            {MENU_ITEMS?.map((it, idx) => (
              <Stack key={idx}>
                <HeaderMenuItem {...it} />
              </Stack>
            ))}
          </Flex>
          <Flex gap="8" my="12" justify={["center", null, "start"]}>
            {icons.map((icon, id) => (
              <Stack key={id}>
                <Icon icon={icon} />
              </Stack>
            ))}
          </Flex>
          <HStack
            gap="10"
            w="full"
            display="flex"
            justify={["center", null, "start"]}
          >
            <Button
              variant="unstyled"
              _hover={{ transition: "0.4s", color: "green.primary" }}
            >
              Privacy Polciy
            </Button>
            <Button
              variant="unstyled"
              _hover={{ transition: "0.4s", color: "green.primary" }}
            >
              Terms and Conditions
            </Button>
          </HStack>
          <Stack mt="5" display={["flex", null, "none"]} align="center">
            <Text fontSize="14" textAlign="center" textColor="white">
              CRAZY GOAT © {new Date().getFullYear()} | All Rights Reserved
            </Text>
          </Stack>
        </GridItem>
      </Grid>
    </Stack>
  );
};
