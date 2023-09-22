"use client";

import { Detail } from "../detail";
// import { getTournament, getToyInfo } from "@/services/getService";
// import { useState } from "react";
// import Cookies from "universal-cookie";

export const Tournament = async ({ params }) => {
  console.log(params);
  // const cookies = new Cookies();
  // const jwtToken = cookies.get("jwtToken");
  // const [tournoment, setTournoment] = useState("");

  // const toyRes = await getToyInfo({ id: params.slag, jwtToken: jwtToken });
  // const initialData = await getTournament(params.slag);

  const toyRes = {
    data: {
      tournoment_user: {
        id: 65,
        user: {
          username: "0x93F11C9DC840B017704BFA10Dc8f2d2089eeB4D1",
          email: "",
          id: 1470,
          web3_name: "test",
        },
        point: 18,
        tournoment: 36,
        tournoment_live: 0,
      },
    },
  };
  // const initialData = [];

  // const data = tournoment.length > 0 ? tournoment : initialData;

  // const updateTournomentDetailData = async () => {
  //   try {
  //     const data = await getTournament(params.slag);
  //     setTournoment(data);
  //   } catch (error) {}
  // };

  const data = {
    data: {
      tournoment: {
        id: 37,
        name: "Wolfest II",
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
      total_points: [
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
      ],
      tour_toy_configs: [
        {
          id: 71,
          toy: {
            id: 1,
            name: "Flappy Wolf",
          },
          tournoment: 37,
          point_value_config: 1.0,
        },
        {
          id: 72,
          toy: {
            id: 3,
            name: "Stick Ninja",
          },
          tournoment: 37,
          point_value_config: 1.0,
        },
      ],
    },
  };

  return (
    <div>
      <Detail
        data={data?.data?.tournoment}
        games={data?.data?.tour_toy_configs}
        gameDetail={toyRes?.data?.tournoment_user}
        // updateTournomentDetailData={updateTournomentDetailData}
      />
    </div>
  );
};

export default Tournament;
