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
    <section className="container text-white my-5" aria-label={`Lista de jogos: ${title}`}>
      <header className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-white text-start fs-4 fw-bold mb-0">{title}</h2>
        <button className="text-end text-white text-decoration-none bg-transparent border-0" aria-label={`Ver mais jogos de ${title}`}>
          Veja mais
        </button>
      </header>

      <hr className="border-secondary" />

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" aria-label={`Jogos na categoria ${title}`}>
        {loading && <div className="text-white" aria-live="polite">Carregando...</div>}
        {!loading && games.map((game, index) => (
          <Gameitem
            key={game._id || `game-${index}`}
            game={game}
          />
        ))}
      </div>
    </section>
  );
}

export default Gamelist;