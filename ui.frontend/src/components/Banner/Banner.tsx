import React, { useEffect, useState } from 'react';
import api from '../../axios';
import Game from '../../interfaces/game'
import calculateDiscount from '../../util/calculateDiscount';
import mockedGames from '../../api/mocked';
import { GAME_DETAIL_PAGE_PATH } from '../../constants/constants';
// import bg from './rdr2_1.jpg'
import { FiTag, FiShoppingBag } from 'react-icons/fi';
import resolveImage from '../../util/resolveImage';
import { Link } from 'react-router-dom';

const Banner = (props: any) => {

  const [games, setGames] = useState<Game[]>([]);

  const handleLoadGames = async () => {
    try {
      const endpoint = "/graphql/execute.json/gogstore/getGamesThatHasDiscount";

      const response = await api.get(endpoint);

      const loadedGames = response.data?.data?.jogoList?.items || [];
      setGames(loadedGames);

    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
      console.warn("Usando jogos mockados.");
      setGames(mockedGames);
    }
  };

  useEffect(() => {
    handleLoadGames();
  }, [])

  if (games.length === 0) {
    return <div className="text-center text-white p-5 bg-dark">Carregando ofertas...</div>;
  }

  return (
    <section id="gameList" className="container carousel slide" data-bs-ride="carousel" aria-label="Ofertas de jogos em destaque">
      {/* Indicadores Dinâmicos */}
      <ol className="carousel-indicators">
        {games.map((game, index) => (
          <li
            key={game._id}
            data-bs-target="#gameList"
            data-bs-slide-to={index}
            className={`bg-primary ${index === 0 ? 'active' : ''}`}
            aria-current={index === 0 ? 'true' : 'false'}
            aria-label={`Slide ${index + 1}: ${game.title}`}
          />
        ))}
      </ol>

      <section className="carousel-inner" aria-label="Lista de jogos em oferta">
        {games.map((game, index) => {
          const discountInfo = calculateDiscount(game.price, game.discountValue);

          const imagePath = game.imageList[0]._path;

          const isDiscounted = game.discountValue > 0;

          if (!imagePath) return null;

          return (
            <article key={game._id} className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="5000" role="tabpanel" aria-roledescription="Slide">
              <figure>
                <img
                  src={resolveImage(imagePath)}
                  className="w-100 d-block opacity-75"
                  alt={`Capa do jogo ${game.title}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  width="1920"
                  height="600"
                />
              </figure>

              <div className="carousel-caption text-start py-md-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-end align-items-md-end">
                  {/* Informações do Jogo */}
                  <div className="text-start">
                    <h5 className="lead text-light d-none d-md-block">Disponível hoje!</h5>
                    <h3 className="fw-bold text-white mb-2">{game.title}</h3>
                  </div>

                  {/* Preços e Botão */}
                  <div className="d-flex flex-column align-items-end">
                    <div className="d-flex align-items-center mb-1">
                      {isDiscounted && (
                        <p className="badge discount-percentage h-100 rounded me-3 text-dark fs-5">
                          <FiTag className="me-1" aria-hidden="true" /> {discountInfo.percentage}
                        </p>
                      )}
                      <div className="d-flex flex-column text-end">
                        {isDiscounted && (
                          <span className="text-decoration-line-through"><small>{discountInfo.old}</small></span>
                        )}
                        <p className="text-white fs-3"><strong>{discountInfo.current}</strong></p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mt-1">
                      <Link
                        id={`buyBtn-${game._id}`}
                        className="btn btn-success btn-lg fw-bold d-flex align-items-center"
                        to={`${GAME_DETAIL_PAGE_PATH}?gameTitle=${encodeURIComponent(game.title)}`}
                        role="button"
                        aria-label={`Comprar ${game.title} por ${discountInfo.current}`}
                      >
                        <FiShoppingBag className="me-2" aria-hidden="true" /> Comprar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Controles de navegação - Estão corretos para o Bootstrap */}
      <button className="carousel-control-prev" type="button" data-bs-target="#gameList" data-bs-slide="prev" aria-label="Slide anterior">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#gameList" data-bs-slide="next" aria-label="Próximo slide">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </section>
  );
}

export default Banner;