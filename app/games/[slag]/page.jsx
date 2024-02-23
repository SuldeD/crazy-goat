import Ninja from "../../../components/free_games/Ninja";
import Rabbit from "../../../components/free_games/rabbit/index";
export default function GamesCard({ params }) {
  return (
    <div className="w-full">
      {params.slag == "StickNinja" && <Ninja />}
      {params.slag == "SpaceRabbit" && <Rabbit />}
    </div>
  );
}
