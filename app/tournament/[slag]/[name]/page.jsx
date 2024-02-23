import { cookies } from "next/headers";
import StickNinja from "../../../../components/stick_hero/Ninja";
import Rabbit from "../../../../components/rabbit";
import { getTournament, getToyInfo } from "services/getService";

export default async function Tournament({ params }) {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get("jwtToken");

  const data = await getTournament(params.slag);
  const toyRes = await getToyInfo({
    id: params.slag,
    jwtToken: jwtToken?.value,
  });

  return (
    <div className="w-full">
      {params.name == "StickNinja" && (
        <StickNinja
          tour_id={params.slag}
          data={data?.data?.tournoment}
          gameDetail={toyRes?.data?.tournoment_user}
          jwtToken={jwtToken}
        />
      )}

      {params.name === "SpaceRabbit" && (
        <Rabbit
          tour_id={params.slag}
          data={data?.data?.tournoment}
          gameDetail={toyRes?.data?.tournoment_user}
          jwtToken={jwtToken}
        />
      )}
    </div>
  );
}
