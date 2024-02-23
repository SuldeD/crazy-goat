import {
  HStack,
  Stack,
  Container,
  Flex,
  ChakraProvider,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useTournomentStore } from "../../lib/store";
import { theme } from "../theme";
import { Footer } from "./Footer";
import { Header } from "./Header";

const MAX_WIDTH = "1280px";
export const Layout = ({ children }) => {
  const { address, isConnected } = useAccount();
  const setAddMyAddress = useTournomentStore((state) => state.setAddMyAddress);

  useEffect(() => {
    isConnected && setAddMyAddress(address);
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Container w="100%" maxW={MAX_WIDTH} px="4">
        <Stack minH="100vh" spacing="20px" position="relative">
          <HStack position="sticky" px="2" top="0" zIndex="100" bg="black">
            <Header />
          </HStack>

          <Flex
            flexGrow={1}
            px={["10px", "10px", "10px", "10px", 0]}
            pb="100px"
          >
            <Stack
              justifyContent="center"
              w="100%"
              px="0"
              alignItems="center"
              maxW={["100vw", null, MAX_WIDTH]}
              p="0"
              mt="0 !important"
            >
              {children}
            </Stack>
          </Flex>

          <HStack>
            <Footer />
          </HStack>
        </Stack>
      </Container>
    </ChakraProvider>
  );
};
