import React, { useState, useEffect } from 'react';
import api from '../../axios';

import mockedGames from '../../api/mocked';
import calculateDiscount from '../../util/calculateDiscount';
import { AEM_HOST } from '../../constants/constants';
import { useCart } from '../../state/CartContext';
import { FiShoppingCart, FiStar, FiCalendar, FiUser } from 'react-icons/fi';

import './gamedetail.css';

const MOCKED_GAME_DATA = mockedGames[Math.floor(Math.random() * mockedGames.length)];

const GameDetail = ({ gameTitle }) => {

  const [game, setGame] = useState(null);
  const { addItem } = useCart();

  const handleLoadGames = async () => {

    if (!gameTitle) {
        const urlParams = new URL(window.location.href).searchParams;
        if(urlParams.has('gameTitle'))
          gameTitle = urlParams.get('gameTitle');
    }

    try {
      const endpoint = `/graphql/execute.json/gogstore/getGamebyTitle`;

      const response = await api.post(endpoint, {
        "variables": {
          "title": `${gameTitle}`
        }
      });

      const loadedGames = response.data?.data?.jogoList?.items || [];

      if(loadedGames.length > 0)
        setGame(loadedGames[0]);
      else
        setGame(MOCKED_GAME_DATA);

    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
      console.warn("Usando jogos mockados.");
      setGame(MOCKED_GAME_DATA);
    }
  };

  useEffect(() => {
    handleLoadGames();
  }, []);

  if (!game) {
    return <div className="text-center text-white p-5 bg-dark">Carregando detalhes do jogo...</div>;
  }

  const { current, old, percentage } = calculateDiscount(game.price, game.discountValue);

  const coverImageUrl = game.imageList?.length > 0 ? `${AEM_HOST}${game.imageList[0]._path}` : 'https://via.placeholder.com/600x900/1a1a1a/FFF?text=Capa';

  const backgroundUrl = coverImageUrl;
  const isDiscounted = game.discountValue > 0;

  const discountClass = 'gog-discount-bg';
  const priceColorClass = 'gog-price-color';

  const handleAddToCart = () => {
    const image = game.imageList?.length > 0 ? `${AEM_HOST}${game.imageList[0]._path}` : undefined;

    console.log("Add item to cart: ", game)
    
    addItem({
      id: game._id,
      title: game.title,
      image,
      price: game.price,
      discountValue: game.discountValue,
    });
  };

  return (
    // 1. Container Geral com background semi-transparente
    <div className="bg-dark text-white gog-details-page-wrapper">

      {/* Banner de Fundo (Blurry effect do GOG) */}
      <div
        className="gog-background-banner"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
        aria-hidden="true"
      ></div>

      <div className="container py-5 position-relative">
        <div className="row g-5">

          {/* COLUNA ESQUERDA: Capa, Título e Descrição */}
          <div className="col-12 col-lg-8">
            <div className="d-flex mb-4">
              <img
                src={coverImageUrl}
                alt={`Capa de ${game.title}`}
                className="img-fluid rounded shadow-lg me-4"
                style={{ width: '300px', height: 'auto' }}
              />

              <div className="text-white">
                <h1 className="text-white fw-bold mb-2">{game.title}</h1>
                <p className="text-white small d-flex align-items-center mb-1"><FiUser className="me-2" /> Desenvolvedor: {game.developer.name}</p>
                <p className="text-white small d-flex align-items-center mb-1"><FiCalendar className="me-2" /> Lançamento: {game.releaseDate}</p>
                <div className="d-flex">
                  <span className="badge bg-success p-2 me-2 d-flex align-items-center"><FiStar className="me-1" /> Nota: {game.score}/100</span>
                  <span className="badge bg-info p-2">DRM-FREE</span>
                </div>
              </div>
            </div>

            <hr className="border-secondary" />

            <div className="gog-description mt-4">
              <h2>Sobre o Jogo</h2>
              <div
                className="text-light"
                dangerouslySetInnerHTML={{ __html: game.description.html }}
              />
            </div>

            <h3 className="mt-5 text-white">Imagens</h3>
            <div className="row row-cols-2 row-cols-md-3 g-3">
              {game.imageList.map((img, i) => (
                <div className="col" key={i}>
                  <img
                    src={`${AEM_HOST}${img._path}`}
                    alt={`Screenshot ${i + 1}`}
                    className="img-fluid rounded"
                    style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* COLUNA DIREITA (SIDEBAR): Card de Compra e Detalhes Técnicos */}
          <div className="col-12 col-lg-4">
            <div className="card bg-secondary text-white border-0 p-3 rounded-3 mb-4">
              <h4 className="card-title text-center fw-bold">Comprar Jogo</h4>
              <hr />

              <div className="d-flex align-items-center mb-3">
                {isDiscounted && (
                  <span className={`badge ${discountClass} p-3 rounded me-3 fs-4`}>
                    {percentage}
                  </span>
                )}
                <div className="d-flex flex-column">
                  {isDiscounted && (
                    <span className="text-decoration-line-through">{old}</span>
                  )}
                  <span className={`fs-3 fw-bold ${priceColorClass}`}>
                    {current}
                  </span>
                </div>
              </div>

              <button className="btn btn-success text-black btn-lg fw-bold d-flex align-items-center" onClick={handleAddToCart}>
                <FiShoppingCart className="me-2" /> Adicionar ao Carrinho
              </button>

              <p className="text-center text-white small mt-3">DRM-FREE &bull; Dinheiro de volta em 30 dias</p>
            </div>

            <div className="card bg-secondary text-white border-0 p-3 rounded-3">
              <h5 className="text-white text-center mb-3">Detalhes</h5>
              <hr />
              <ul className="list-unstyled small">
                <li>Desenvolvedor: {game.developer.name}</li>
                <li>Editora: {game.developer.name}</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;