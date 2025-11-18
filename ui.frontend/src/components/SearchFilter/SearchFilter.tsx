import React, { FunctionComponent, useCallback, useEffect, useState } from "react";

import api from "../../axios";
import Game from "../../interfaces/game";
import mockedGames from '../../api/mocked';
import Gameitem from "../Gamelist/Gameitem/Gameitem";

import './searchFilter.css';

const genreOptions = ["Action", "Adventure", "OpenWorld", "RPG"];
const yearOptions = ["2020s", "2010s", "2000s"];
const developerOptions = ["CD Project Red", "Rockstar Games", "Square Enix"];

interface FilterState {
  gameTitle?: string;
  isDiscounted: boolean | number;
  releaseYear?: string;
  genres: string;
  developer: string;
  minScore: number;
}

const SearchFilter = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    isDiscounted: false,
    releaseYear: '',
    developer: '',
    genres: '',
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
    const filtersParts: FilterState = {
      gameTitle: searchTerm || "",
      isDiscounted: filters.isDiscounted ? 0 : -1,
      genres: filters.genres,
      developer: filters.developer,
      minScore: filters.minScore = filters.minScore || 0
    };

    return filtersParts;
  }, [searchTerm, filters]);

  const fetchGames = useCallback(async() => {
    setIsLoading(true);
    const filterObject = buildGraphQLFilter();

    try{
      const endpoint = `/graphql/execute.json/gogstore/getGamesWithFilter`;

      const response = await api.post(endpoint, {
        "variables": filterObject
      });

      const loadedGames = response.data?.data?.jogoList?.items || [];
      setGames(loadedGames);
    } catch (error) {
      setGames(mockedGames);
    } finally {
      setIsLoading(false);
    }
  }, [buildGraphQLFilter, searchTerm, filters])

  // 1. Componente de Filtro Lateral (Sidebar)
  const FilterSidebar = () => (
    <div className="sidebar p-4 bg-gog-light-dark rounded-3 shadow-md">
      <h4 className="text-light mb-4 border-gog-accent">Filtros Ativos</h4>

      {/* 1.1. Filtro de Desconto */}
      <div className="form-check mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          checked={filters.isDiscounted as boolean}
          onChange={(e) => handleFilterChange('isDiscounted', e.target.checked)}
          id="discountCheck"
        />
        <label className="form-check-label text-light" htmlFor="discountCheck">
          Apenas com Desconto
        </label>
      </div>

      {/* 1.2. Filtro de Gênero (Checkboxes) */}
       <div className="mb-4">
        <h5 className="text-light mb-3">Gênero:</h5>
        <select
          className="form-select bg-gog-dark text-light border-gog-accent"
          value={filters.genres}
          onChange={(e) => handleFilterChange('genres', e.target.value)}
        >
          <option value="">Qualquer</option>
          {genreOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* 1.3. Filtro de Desenvolvedor (Exemplo de Select) */}
      <div className="mb-4">
        <h5 className="text-light mb-3">Desenvolvedora</h5>
        <select
          className="form-select bg-gog-dark text-light border-gog-accent"
          value={filters.developer || ''}
          onChange={(e) => handleFilterChange('developer', e.target.value)}
        >
          <option value="">Todas</option>
          {developerOptions.map(dev => (
            <option key={dev} value={dev}>{dev}</option>
          ))}
        </select>
      </div>

      {/* 1.4. Filtro de Score */}
      <div className="mb-4">
          <label className="form-label text-light">Nota mínima do jogo: {filters.minScore}</label>
          <input 
              type="range" 
              className="form-range" 
              min="0" 
              max="100" 
              step="20" 
              value={filters.minScore}
              onChange={(e) => handleFilterChange('minScore', parseInt(e.target.value))}
          />
      </div>

    </div>
  );

  // 2. Renderização Principal
  return (
    <>

      <div className="container game-filter-container p-4 text-white">

        {/* 2.1. BARRA DE PESQUISA SUPERIOR */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="input-group input-group-lg bg-gog-light-dark rounded-3 shadow-lg p-2">
              <input
                type="text"
                className="form-control bg-gog-dark text-light border-0"
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

        {/* 2.2. LAYOUT PRINCIPAL: FILTROS + RESULTADOS */}
        <div className="row">

          <div className="col-lg-3 d-none d-lg-block">
            <FilterSidebar />
          </div>

          <div className="col-12 col-lg-9">
            <h3 className="text-light mb-4">{isLoading ? "Buscando..." : `${games.length} Resultados Encontrados`}</h3>

            {isLoading ? (
              <div className="text-center p-5">
                <i className="fas fa-spinner fa-spin fa-3x text-accent"></i>
                <p className="text-light mt-3">Carregando jogos...</p>
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