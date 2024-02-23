import { cookies } from "next/headers";
import { Detail } from "../../../components/TournomentDetail/detail";
import { getTournament, getToyInfo } from "../../../services/getService";

export default async function Tournament({ params }) {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get("jwtToken");

  const data = await getTournament(params.slag);
  const toyRes = await getToyInfo({
    id: params.slag,
    jwtToken: jwtToken.value,
  });

  return (
    <div>
      <Detail
        data={data?.data?.tournoment}
        games={data?.data?.tour_toy_configs}
        gameDetail={toyRes?.data?.tournoment_user}
        params={params}
        jwtToken={jwtToken}
      />
    </div>
  );
}
