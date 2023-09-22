"use client";

import MTable from "../../components/Table";
import MText from "../../components/Text";

import { Stack } from "@chakra-ui/react";
import { useState } from "react";

export const Ranking = async () => {
  const [pointsData, setPoints] = useState(null);

  return (
    <div className="w-full gap-10">
      <Stack align="center" my="10">
        <MText title={true} text={"Ranking"} />
      </Stack>

      <MTable pointsData={pointsData} setPoints={setPoints} />
    </div>
  );
};

export default Ranking;
