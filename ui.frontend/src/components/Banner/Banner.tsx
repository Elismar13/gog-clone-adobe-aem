import React, { useEffect, useState } from 'react';
import api from '../../axios';
import Game from '../../interfaces/game'
// import bg from './rdr2_1.jpg'

const QUERY = `{
  jogoList(filter: {
    discountValue: {
      _logOp:OR
      _expressions: {
        value: 0
        _operator: GREATER
      }
    }
  }) {
    items {
      _path
      _id
      title
      price
      score
      discountValue
      releaseDate
      genre
      imageList {
        ...on ImageRef {
          _path
        }
      }
    }
  }
}
`;

const Banner = (props: any) => {

  const [games, setGames] = useState<Game[]>([]);

  const handleLoadGames = async () => {
    try {
      const endpoint = "/content/cq:graphql/gogstore/endpoint.json";

      const response = await api.post(endpoint, {
        "query": QUERY
      });

      // 4. Extrai e armazena apenas a lista de jogos no estado.
      const loadedGames = response.data?.data?.jogoList?.items || [];
      setGames(loadedGames);

      console.log(loadedGames)
      console.log(loadedGames[0].imageList[0]._path)
      console.log(loadedGames[0].imageList[0]._path)



    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    }
  };

  useEffect(() => {
    handleLoadGames();
  }, [])

  const calculateDiscount = (price: number, discountValue: number) => {
    if (price && discountValue) {
      const oldPrice = price;
      const discountPercentage = discountValue / 100;
      const currentPrice = oldPrice * (1 - discountPercentage);

      // Formata como moeda BRL (ajuste o 'en-US' para 'pt-BR' se preferir)
      const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

      return {
        old: formatter.format(oldPrice),
        current: formatter.format(currentPrice),
        percentage: `-${discountValue}%`,
      };
    }
    return { old: '', current: 'Preço Indefinido', percentage: '' };
  };

  // Se a API ainda não carregou os jogos, exibe um carregamento ou placeholder.
  if (games.length === 0) {
    return <div className="text-center text-white p-5 bg-dark">Carregando ofertas...</div>;
  }

  // 7. Renderização Dinâmica do Carrossel
  return (
    <div id="gameList" className="carousel slide gog-highlight-carousel" data-bs-ride="carousel">
      {/* 7.1 Indicadores Dinâmicos */}
      <ol className="carousel-indicators">
        {games.map((game, index) => (
          <li
            key={game._id}
            data-bs-target="#gameList"
            data-bs-slide-to={index}
            className={`bg-primary ${index === 0 ? 'active' : ''}`}
            aria-current={index === 0 ? 'true' : 'false'}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </ol>

      {/* 7.2 Itens do Carrossel Dinâmicos */}
      <div className="carousel-inner" role="listbox">
        {games.map((game, index) => {
          const discountInfo = calculateDiscount(game.price, game.discountValue);
          // O AEM Content Path para o asset deve ser prefixado com o host, mas vamos usar o path puro por enquanto
          const imagePath = game.imageList[0]._path;
          
          
          return (
            <div key={game._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img
                src={`http://localhost:4502${imagePath}`}
                className="w-100 d-block d-none d-sm-block"
                alt={game.title}
              />
              
              <div className="carousel-caption text-start w-100 p-3 p-md-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end">

                  {/* Informações do Jogo */}
                  <div className="text-start">
                    <h5 className="lead text-light d-none d-sm-block">Disponível hoje!</h5>
                    <h3 className="fw-bold text-white mb-2">{game.title}</h3>
                  </div>

                  {/* Preços e Botão */}
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-1">
                      <span className="badge bg-warning p-2 rounded me-3 text-dark fw-bold">{discountInfo.percentage}</span>
                      <span className="text-secondary text-decoration-line-through">{discountInfo.old}</span>
                    </div>

                    <div className="d-flex align-items-center mt-2">
                      <span className="h4 fw-bold text-gog-price me-3 mb-0">{discountInfo.current}</span>
                      <a
                        id={`buyBtn-${game._id}`}
                        className="btn btn-gog-primary btn-lg fw-bold"
                        href="#"
                        role="button"
                      >Comprar</a>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles de navegação (Permanecem estáticos do Bootstrap) */}
      <button className="carousel-control-prev" type="button" data-bs-target="#gameList" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#gameList" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Banner;