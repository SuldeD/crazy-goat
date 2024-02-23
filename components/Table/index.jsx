"use client";

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
import { useEffect, useMemo, useState } from "react";
import { useTournomentStore } from "../../lib/store";
import { getTotalPoints } from "../../services/getService";

export const MTable = async ({ tournoments, initialPoints }) => {
  const [pointsData, setAddPointsData] = useState();
  const myAddress = useTournomentStore((state) => state.myAddress);

  const handleChange = async (index) => {
    const id = tournoments?.data?.tournoments[index]?.id;
    const data = await getTotalPoints({ id });
    setAddPointsData(data);
  };

  const points = useMemo(() => {
    return pointsData?.total_points
      ? pointsData?.total_points
      : initialPoints?.total_points;
  }, [pointsData, initialPoints]);

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
                        {points.slice(0, 10)?.map((dt, id) => {
                          return (
                            <Tr key={id}>
                              <Td position="relative" w="250px">
                                <Stack>
                                  <Text>{TG?.name}</Text>
                                </Stack>
                                {myAddress?.toLocaleLowerCase() ==
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
                                )}
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
