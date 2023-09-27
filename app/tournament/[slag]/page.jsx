"use client";

import { Detail } from "../detail";
import { getTournament, getToyInfo } from "../../../services/getService";
import { useState } from "react";
import Cookies from "universal-cookie";

export const Tournament = async ({ params }) => {
  const cookies = new Cookies();
  const jwtToken = cookies.get("jwtToken");
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

  return (
    <div>
      <Detail
        data={data?.data?.tournoment}
        games={data?.data?.tour_toy_configs}
        gameDetail={toyRes?.data?.tournoment_user}
        updateTournomentDetailData={updateTournomentDetailData}
      />
    </div>
  );
};

export default Tournament;
