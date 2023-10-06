"use client";

import Ninja from "../../../components/free_games/Ninja";
import { Game } from "../../../components/free_games/flappy/Game";
export default function GamesCard({ params }) {
  return (
    <div className="w-full">
      {params.slag == "StickNinja" && <Ninja />}
      {params.slag == "FlappyWolf" && <Game />}
    </div>
  );
}
