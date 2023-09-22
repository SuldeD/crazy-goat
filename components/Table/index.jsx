// import { getTournaments, getTotalPoints } from "@/services/getService";
import {
  Flex,
  Stack,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export const MTable = async () => {
  // { setPoints, pointsData }
  const tournoments = {
    data: {
      tournoments: [
        {
          id: 37,
          name: "Wolfest II festival",
          description:
            "We're thrilled to announce that we are organizing a tournament to celebrate the 2 year anniversary of MongolNFT! To mark this incredible milestone, we invite all gaming enthusiasts to participate in our special 2-Year Anniversary Tournament. ",
          image: "https://pin.ski/45SIJP5",
          token: {
            id: 1,
            name: "MATIC",
            address: "0x0000000000000000000000000000000000001010",
          },
          live_price: 0.01,
          address: "0x8135bc37E833f0239435BFA6D432EaB0f528D7Be",
          start_datetime: "2023-09-18T17:40:59+08:00",
          end_datetime: "2023-10-02T21:00:00+08:00",
          status: "active",
          create_user: {
            username: "tse",
            email: "tse@test.mn",
            id: 1,
            web3_name: "",
          },
          total_price: 1000,
        },
        {
          id: 15,
          name: "Infinte - Test Season",
          description: "test",
          image:
            "https://www.patriotsoftware.com/wp-content/uploads/2022/01/what-is-blockchain-1.jpg",
          token: {
            id: 1,
            name: "MATIC",
            address: "0x0000000000000000000000000000000000001010",
          },
          live_price: 0.01,
          address: "0x515152e241D890625e1423c6f67ecdaFefe29f1d",
          start_datetime: "2023-08-09T15:21:03+08:00",
          end_datetime: "2023-10-10T10:10:00+08:00",
          status: "active",
          create_user: {
            username: "tse",
            email: "tse@test.mn",
            id: 1,
            web3_name: "",
          },
          total_price: 0.0,
        },
      ],
    },
  };
  // const tournoments = await getTournaments();
  // const initialPoints = await getTotalPoints({ id: "37" });

  const handleChange = async (index) => {
    console.log(index);
    // const id = tournoments?.data?.tournoments[index]?.id;
    // setPoints(await getTotalPoints({ id }));
  };

  // const points = pointsData?.total_points
  //   ? pointsData?.total_points
  //   : initialPoints?.total_points;

  const points = [
    {
      id: 70,
      user: {
        username: "0x2af22487FF4e5a03f9f2F5C52Dad1B0557635CcF",
        email: "",
        id: 1440,
        web3_name: "test",
      },
      point: 16,
      tournoment: 37,
      tournoment_live: 1,
    },
    {
      id: 71,
      user: {
        username: "0x93F11C9DC840B017704BFA10Dc8f2d2089eeB4D1",
        email: "",
        id: 1470,
        web3_name: "test",
      },
      point: 5,
      tournoment: 37,
      tournoment_live: 0,
    },
  ];

  return (
    <TableContainer mt="5">
      <Stack w="full">
        <Tabs variant="unstyled" colorScheme="green" onChange={handleChange}>
          <TabList gap="14" ms="8">
            {tournoments?.data?.tournoments?.map((dt, id) => {
              return (
                <Tab
                  key={id}
                  className="bg-white text-black rounded-[32px] text-[22px] p-2"
                  fontFamily="primary"
                  fontWeight="700"
                  position="relative"
                  _selected={{ bg: "#02E111" }}
                >
                  {dt?.name}
                  <Stack position="absolute" right="-12" top="-2" p="2" px="3">
                    <Text
                      bg={
                        points[0]?.tournoment == dt?.id
                          ? "green.primary"
                          : "white"
                      }
                      px="2"
                      rounded="32px"
                      fontFamily="primary"
                      fontWeight="600"
                      fontSize="18px"
                    >
                      0{id + 1}
                    </Text>
                  </Stack>
                </Tab>
              );
            })}
          </TabList>
          <TabPanels w="full" mt="4">
            {tournoments?.data?.tournoments?.map((TG, id) => {
              return (
                <TabPanel key={id}>
                  <TabPanel>
                    <Table
                      variant="unstyled"
                      color="white"
                      bg="whiteAlpha.100"
                      size="lg"
                      rounded="20px"
                    >
                      <Thead borderBottom="1px">
                        <Tr>
                          <Th
                            color="white"
                            fontSize="18px"
                            fontWeight="600"
                            fontFamily="primary"
                            isNumeric
                            align="end"
                          >
                            <Flex gap="4" align="center" justify="start">
                              <Text
                                color="white"
                                fontSize="18px"
                                fontWeight="600"
                                fontFamily="primary"
                              >
                                Tournament
                              </Text>
                            </Flex>
                          </Th>
                          <Th
                            color="white"
                            fontSize="18px"
                            fontWeight="600"
                            fontFamily="primary"
                          >
                            Rank
                          </Th>
                          <Th
                            color="white"
                            fontSize="18px"
                            fontWeight="600"
                            fontFamily="primary"
                          >
                            User id
                          </Th>

                          <Th
                            color="white"
                            fontSize="18px"
                            fontWeight="600"
                            fontFamily="primary"
                          >
                            Address
                          </Th>

                          <Th
                            color="white"
                            fontSize="18px"
                            fontWeight="600"
                            fontFamily="primary"
                            isNumeric
                          >
                            Score
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody rounded="20px">
                        {points?.map((dt, id) => {
                          return (
                            <Tr key={id}>
                              <Td position="relative" w="250px">
                                <Stack>
                                  <Text>{TG?.name}</Text>
                                </Stack>
                                {/* {window?.ethereum?.selectedAddress?.toLocaleLowerCase() ==
                                  (dt?.user?.username).toLocaleLowerCase() && (
                                  <Stack
                                    position="absolute"
                                    right="0"
                                    p="2"
                                    top="0"
                                    px="3"
                                  >
                                    <Text
                                      bg={
                                        points[0]?.tournoment == dt?.id
                                          ? "green.primary"
                                          : "white"
                                      }
                                      textColor="black"
                                      px="2"
                                      rounded="32px"
                                      fontFamily="primary"
                                      fontWeight="600"
                                      fontSize="18px"
                                    >
                                      me
                                    </Text>
                                  </Stack>
                                )} */}
                              </Td>
                              <Td>{id + 1}</Td>
                              <Td>{dt?.user?.id}</Td>
                              <Td>{`${dt?.user?.username.substring(
                                0,
                                6
                              )}...${dt?.user?.username.substring(
                                dt?.user?.username?.length - 4
                              )}`}</Td>

                              <Td isNumeric>{dt?.point}</Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TabPanel>
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Stack>
    </TableContainer>
  );
};

export default MTable;
