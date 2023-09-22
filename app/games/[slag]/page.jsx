"use client";
// import Ninja from "../free_games/Ninja";
// import { Game } from "../free_games/flappy/Game";

export const Games = async ({ params }) => {
  console.log(params);
  return (
    <div className="w-full">
      {/* {params.slag == "StickNinja" && <Ninja />}
      {params.slag == "FlappyWolf" && <Game />} */}
    </div>
  );
};

export default Games;
