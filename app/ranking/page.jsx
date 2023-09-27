"use client";

import MTable from "../../components/Table";
import MText from "../../components/Text";

import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useEffect } from "react";

export const Ranking = async () => {
  const [pointsData, setPoints] = useState(null);
  const [myAddress, setMyAddress] = useState(null);

  useEffect(() => {
    setMyAddress(window?.ethereum?.selectedAddress);
  }, []);

  return (
    <div className="w-full gap-10">
      <Stack align="center" my="10">
        <MText title={true} text={"Ranking"} />
      </Stack>

      <MTable
        pointsData={pointsData}
        setPoints={setPoints}
        myAddress={myAddress}
      />
    </div>
  );
};

export default Ranking;
