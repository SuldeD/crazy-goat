import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { Detail } from "../../../components/TournomentDetail/detail";
import { getTournament, getToyInfo } from "../../../services/getService";

const getCachedToy = unstable_cache(
  async (id, jwtToken) => getToyInfo({ id, jwtToken }),
  ["toy"]
);

export default async function Tournament({ params }) {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get("jwtToken");

  const tourData = getTournament(params.slag);
  const toyResData = getCachedToy(params.slag, jwtToken.value);

  const [toyRes, data] = await Promise.all([toyResData, tourData]);

  return (
    <div>
      <Detail
        data={data?.data?.tournoment}
        games={data?.data?.tour_toy_configs}
        gameDetail={toyRes?.data?.tournoment_user}
        params={params}
      />
    </div>
  );
}
