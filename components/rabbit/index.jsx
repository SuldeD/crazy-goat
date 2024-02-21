import React from "react";
import { Reacteroids } from "./Reacteroids";
import "./style.css";

const Rabbit = ({ tour_id, updateTournomentDetailData, life, data }) => {
  const sendDataToReacteroids = () => {
    const data = { message: "Hello from Rabbit!" };
    console.log("Data sent from Rabbit:", data);
  };

  return (
    <div>
      <Reacteroids
        tour_id={tour_id}
        updateTournomentDetailData={updateTournomentDetailData}
        life={life}
        data={data}
        onDataFromRabbit={sendDataToReacteroids}
      />
    </div>
  );
};

export default Rabbit;
