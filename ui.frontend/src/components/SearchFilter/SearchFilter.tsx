import React, { FunctionComponent, useCallback, useEffect, useState } from "react";

import api from "../../axios";
import Game from "../../interfaces/game";
import mockedGames from '../../api/mocked';
import Gameitem from "../Gamelist/Gameitem/Gameitem";

const genreOptions = ["Action", "RPG", "Strategy", "Indie"];
const yearOptions = ["2020s", "2010s", "2000s"];
const developerOptions = ["CD Projekt", "Larian Studios", "Supergiant Games"];

interface FilterState {
  maxPrice: number;
  isDiscounted: boolean;
  releaseYear: string; // Ex: '2020s', '2010s'
  genres: string[];
  developers: string[];
  minScore: number;
}

const SearchFilter = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    maxPrice: 300,
    isDiscounted: false,
    releaseYear: '',
    genres: [],
    developers: [],
    minScore: 0,
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenreChange = (genre: string) => {
    setFilters(prev => {
      const newGenres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres: newGenres };
    });
  };

  const buildGraphQLFilter = useCallback(() => {
    let filtersParts = { }
    
    if(searchTerm) {
      filtersParts = {
        ...filtersParts,
        "gameTitle": searchTerm
      }
    }

    return filtersParts;

  }, [searchTerm, filters]);

  const fetchGames = useCallback(async() => {
    setIsLoading(true);
    const filterObject = buildGraphQLFilter();

    console.log("GraphQL Filter Object:", filterObject);

    try{
      const endpoint = `/graphql/execute.json/gogstore/getGamesWithFilter`;

      const response = await api.post(endpoint, {
        "variables": filterObject
      });

      const loadedGames = response.data?.data?.jogoList?.items || [];
      setGames(loadedGames);
    } catch (error) {
      setGames(mockedGames);
    }

    setIsLoading(false);
  }, [buildGraphQLFilter, searchTerm, filters])

  // 6. Componente de Filtro Lateral (Sidebar)
  const FilterSidebar = () => (
    <div className="sidebar p-4 bg-gog-light-dark rounded-3 shadow-md">
      <h4 className="text-white mb-4 border-gog-accent">Filtros Ativos</h4>

      {/* 6.1. Filtro de Preço */}
      <div className="mb-4">
        <label className="form-label text-secondary">Preço Máximo: R$ {filters.maxPrice.toFixed(0)}</label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="300"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
        />
      </div>

      {/* 6.2. Filtro de Desconto */}
      <div className="form-check mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          checked={filters.isDiscounted}
          onChange={(e) => handleFilterChange('isDiscounted', e.target.checked)}
          id="discountCheck"
        />
        <label className="form-check-label text-white" htmlFor="discountCheck">
          Apenas com Desconto
        </label>
      </div>

      {/* 6.3. Filtro de Gênero (Checkboxes) */}
      <div className="mb-4">
        <h5 className="text-secondary mb-3">Gênero</h5>
        {genreOptions.map(genre => (
          <div className="form-check" key={genre}>
            <input
              className="form-check-input"
              type="checkbox"
              checked={filters.genres.includes(genre)}
              onChange={() => handleGenreChange(genre)}
              id={`genre-${genre}`}
            />
            <label className="form-check-label text-white" htmlFor={`genre-${genre}`}>
              {genre}
            </label>
          </div>
        ))}
      </div>

      {/* 6.4. Filtro de Ano */}
      <div className="mb-4">
        <h5 className="text-secondary mb-3">Década de Lançamento</h5>
        <select
          className="form-select bg-gog-dark text-white border-gog-accent"
          value={filters.releaseYear}
          onChange={(e) => handleFilterChange('releaseYear', e.target.value)}
        >
          <option value="">Qualquer</option>
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* 6.5. Filtro de Desenvolvedor (Exemplo de Select) */}
      <div className="mb-4">
        <h5 className="text-secondary mb-3">Desenvolvedora</h5>
        <select
          className="form-select bg-gog-dark text-white border-gog-accent"
          value={filters.developers[0] || ''} // Simplificado para um único select
          onChange={(e) => handleFilterChange('developers', [e.target.value])}
        >
          <option value="">Todas</option>
          {developerOptions.map(dev => (
            <option key={dev} value={dev}>{dev}</option>
          ))}
        </select>
      </div>

    </div>
  );

  // 7. Renderização Principal
  return (
    <>

      <div className="container-fluid game-filter-container p-4">

        {/* 7.1. BARRA DE PESQUISA SUPERIOR */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="input-group input-group-lg bg-gog-light-dark rounded-3 shadow-lg p-2">
              <input
                type="text"
                className="form-control bg-gog-dark text-white border-0"
                placeholder="Digite para buscar títulos, tags ou desenvolvedoras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') fetchGames();
                }}
              />
              <button
                className="btn btn-dark text-accent"
                type="button"
                onClick={fetchGames}
              >
                <i className="fas fa-search me-2"></i> Buscar
              </button>
            </div>
          </div>
        </div>

        {/* 7.2. LAYOUT PRINCIPAL: FILTROS + RESULTADOS */}
        <div className="row">

          {/* Filtros: Visível em Desktop (col-lg-3) e oculto em Mobile (d-none) */}
          <div className="col-lg-3 d-none d-lg-block">
            <FilterSidebar />
          </div>

          {/* Resultados: Ocupa largura total em Mobile (col-12) e o restante em Desktop (col-lg-9) */}
          <div className="col-12 col-lg-9">
            <h3 className="text-secondary mb-4">{isLoading ? "Buscando..." : `${games.length} Resultados Encontrados`}</h3>

            {isLoading ? (
              <div className="text-center p-5">
                <i className="fas fa-spinner fa-spin fa-3x text-accent"></i>
                <p className="text-white mt-3">Carregando jogos...</p>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4">
                {games.map((game) => (
                  <Gameitem
                    key={game._id}
                    game={game}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchFilter;