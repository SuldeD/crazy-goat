import MTable from "../../components/Table";
import { getTotalPoints, getTournaments } from "../../services/getService";

export default async function Ranking() {
  const tournoments = await getTournaments();
  const pointId = tournoments?.data?.tournoments[0]?.id;
  const initialPoints = await getTotalPoints({ id: pointId });

  return (
    <div className="w-full gap-10">
      <MTable tournoments={tournoments} initialPoints={initialPoints} />
    </div>
  );
}
