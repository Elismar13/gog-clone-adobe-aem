import React, { FunctionComponent } from "react";
import Gameitem from "./Gameitem/Gameitem";
import { useGamesByGenre } from "../../hooks/useGamesByGenre";


interface GamelistProps {
  title: string,
  genre: string,
  orientation: "horizontal" | "vertical"
};


const Gamelist: FunctionComponent<GamelistProps> = (props: GamelistProps) => {
  const { genre, title, orientation } = props;
  const gameGenre = genre != null ? genre.split('/').at(-1) as string : 'action';
  const { data: games, loading } = useGamesByGenre(gameGenre);

  return (
    <div className="container text-white my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-white text-start fs-4 fw-bold mb-0">{title}</p>
        <span className="text-end">Veja mais</span>
      </div>

      <hr />

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {loading && <div className="text-white">Carregando...</div>}
        {!loading && games.map((game, index) => (
          <Gameitem
            key={index}
            game={game}
          />
        ))}
      </div>
    </div>
  );
}

export default Gamelist;