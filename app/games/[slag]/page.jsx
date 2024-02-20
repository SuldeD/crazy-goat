"use client";

import Ninja from "../../../components/free_games/Ninja";
import { Game } from "../../../components/free_games/flappy/Game";
import Rabbit from "../../../components/free_games/rabbit/index";
export default function GamesCard({ params }) {
  return (
    <div className="w-full">
      {params.slag == "StickNinja" && <Ninja />}
      {params.slag == "FlappyWolf" && <Game />}
      {params.slag == "SpaceRabbit" && <Rabbit />}
    </div>
  );
}
