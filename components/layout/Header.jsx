import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { verifyMessage } from "../../services/checkSIWE";
import { getHostNftContract } from "../../helper_contracts/HostNFTContractHelper";
import { ConnectKitButton } from "connectkit";
import MButton from "components/Button";

const HeaderMenuItem = ({ label, href, onClose }) => {
  const pathname = usePathname();
  const isSelected = useMemo(() => pathname === href, [pathname, href]);

  return (
    <Link href={href} passHref onClick={onClose}>
      <div style={{ width: "fit-content" }}>
        <Stack
          cursor="pointer"
          color={isSelected ? ["green.primary"] : "white"}
          w={["full", null, "fit-content"]}
          _hover={{ transition: "0.4s", color: "green.primary" }}
        >
          <Text
            w="fit-content"
            fontSize={["26", null, "17"]}
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

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userHost, setUserHost] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { hostNftReadContract } = await getHostNftContract();
        const balance = await hostNftReadContract.balanceOf(
          window.ethereum.selectedAddress
        );
        setUserHost(balance?.toNumber() > 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const MENU_ITEMS = userHost
    ? [
        { label: "Home", href: "/" },
        { label: "Games", href: "/games" },
        { label: "Ranking", href: "/ranking" },
        { label: "Create", href: "/create" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Games", href: "/games" },
        { label: "Ranking", href: "/ranking" },
        { label: "Host", href: "/host" },
      ];

  const shouldExecuteVerifyMessage = () => {
    const lastExecutionTime = localStorage.getItem("lastExecutionTime");
    const currentTime = Date.now();

    if (!lastExecutionTime) {
      return true;
    }
    return currentTime - lastExecutionTime > 1 * 60 * 60 * 1000;
  };

  useEffect(() => {
    if (isWalletConnected && shouldExecuteVerifyMessage()) {
      verifyMessage();
      localStorage.setItem("lastExecutionTime", Date.now().toString());
    }
  }, [isWalletConnected]);

  return (
    <Stack w="100%" gap="22px" alignItems="center">
      <Grid templateColumns="repeat(12,1fr)" w="100%" h="80px" maxH="80px">
        <GridItem display={["none", null, "flex"]} colSpan={[null, null, 5]}>
          <HStack alignItems="center" gap={[6, 6, 6, 14]} h="100%">
            {MENU_ITEMS.map((mi, idx) => (
              <Flex key={idx} w="100%">
                <HeaderMenuItem {...mi} />
              </Flex>
            ))}
          </HStack>
        </GridItem>
        <GridItem colSpan={[6, null, 2]}>
          <HStack
            justifyContent={["flex-start", "flex-start", "center"]}
            h="100%"
          >
            <Link href="/">
              <Text
                fontSize={["32", null, "32"]}
                fontFamily="primary"
                fontWeight="700"
                textAlign="center"
                color="white"
                cursor="pointer"
                pb="1"
              >
                CrazyGoat
              </Text>
            </Link>
          </HStack>
        </GridItem>
        <GridItem colSpan={[6, null, 5]}>
          <HStack
            justifyContent="flex-end"
            alignItems="center"
            h="100%"
            display={["none", null, "flex"]}
            gap="0"
          >
            <HStack>
              <ConnectKitButton.Custom>
                {({ isConnected, show, truncatedAddress }) => {
                  if (isConnected !== isWalletConnected) {
                    setIsWalletConnected(isConnected);
                  }
                  return (
                    <MButton
                      text={isConnected ? truncatedAddress : "Connect Wallet"}
                      onClick={show}
                    />
                  );
                }}
              </ConnectKitButton.Custom>
            </HStack>
          </HStack>

          <HStack
            display={["flex", null, "none"]}
            justifyContent="flex-end"
            alignItems="center"
            h="100%"
          >
            <HamburgerIcon color="white" boxSize="6" onClick={onOpen} />

            <Drawer
              placement="top"
              onClose={onClose}
              isOpen={isOpen}
              size="full"
              display={["flex", null, "none"]}
            >
              <DrawerContent backgroundColor="black" opacity="0.96">
                <DrawerCloseButton mt="4" me="2" color="white" size="md" />
                <DrawerHeader>
                  <GridItem colSpan={[3, null, null]} mt="3">
                    <Link href="/" passHref onClick={onClose}>
                      <Text
                        fontSize={["32", null, "32"]}
                        fontFamily="primary"
                        cursor="pointer"
                        fontWeight="700"
                        textAlign="start"
                        pb="1"
                        textColor="white"
                      >
                        CrazyGoat
                      </Text>
                    </Link>
                  </GridItem>
                </DrawerHeader>
                <DrawerBody>
                  <Stack
                    mt="150px"
                    justifyContent="center"
                    gap="10"
                    w="100%"
                    display={["inline-grid", null, "none"]}
                  >
                    {MENU_ITEMS.map((mi, idx) => (
                      <Flex key={idx} w="100%" justifyContent="center">
                        <HeaderMenuItem
                          label={mi.label}
                          href={mi.href}
                          onClose={onClose}
                        />
                      </Flex>
                    ))}

                    <ConnectKitButton.Custom>
                      {({ isConnected, show, truncatedAddress }) => {
                        if (isConnected !== isWalletConnected) {
                          setIsWalletConnected(isConnected);
                        }
                        return (
                          <MButton
                            text={
                              isConnected ? truncatedAddress : "Connect Wallet"
                            }
                            onClick={show}
                          />
                        );
                      }}
                    </ConnectKitButton.Custom>
                  </Stack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </HStack>
        </GridItem>
      </Grid>
    </Stack>
  );
};
