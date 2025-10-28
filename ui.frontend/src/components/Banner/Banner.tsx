import React from 'react';
import bg from './rdr2_1.jpg'

const Banner = (props: any) => {
    // Dados de demonstração para o slide
    const slideData = {
        title: "Red Dead Redemption 2",
        description: "Explore o vasto e implacável coração da América.",
        oldPrice: "R$ 29,99",
        currentPrice: "R$ 22,22",
        discount: "-15%",
        image: bg
    };

    return (
        <div id="gameList" className="carousel slide gog-highlight-carousel" data-bs-ride="carousel">
            <ol className="carousel-indicators">
                <li data-bs-target="#gameList" data-bs-slide-to="0" className="active bg-primary" aria-current="true" aria-label="First slide"></li>
                <li data-bs-target="#gameList" data-bs-slide-to="1" aria-label="Second slide"></li>
                <li data-bs-target="#gameList" data-bs-slide-to="2" aria-label="Third slide"></li>
            </ol>

            <div className="carousel-inner" role="listbox">
                <div className="carousel-item active">
                    <img
                        // Substitua {bg} por um link de imagem ou background-image CSS no seu arquivo banner.css
                        src={slideData.image || 'https://via.placeholder.com/1200x500/8e2de2/FFFFFF?text=Red+Dead+Redemption+2'}
                        className="w-100 d-block d-none d-sm-block"
                        alt="First slide"
                    />
                    
                    <div className="carousel-caption text-start w-100 p-3 p-md-5">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end">
                                                        <div className="text-start">
                                <h3 className="fw-bold text-white mb-2">{slideData.title}</h3>
                                <h5 className="lead text-light d-none d-sm-block">{slideData.description}</h5>
                            </div>

                            <div className="d-flex flex-column">
                                
                                <div className="d-flex align-items-center mb-1">
                                    <span className="badge bg-warning p-2 rounded me-3 text-dark fw-bold">{slideData.discount}</span>
                                    <span className="text-secondary text-decoration-line-through">{slideData.oldPrice}</span>
                                </div>

                                <div className="d-flex align-items-center mt-2">
                                    <span className="h4 fw-bold text-gog-price me-3 mb-0">{slideData.currentPrice}</span>
                                                                        <a
                                        id="buyBtn"
                                        className="btn btn-gog-primary btn-lg fw-bold" // Usando classes customizadas GOG
                                        href="#"
                                        role="button"
                                    >Comprar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
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