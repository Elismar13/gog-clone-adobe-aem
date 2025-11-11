import React, { useState } from 'react';
import { useCart } from '../../state/CartContext';
import './minicart.css';

const MiniCart: React.FC = () => {
  const { items, total, removeItem, updateQuantity, clear } = useCart();
  const [open, setOpen] = useState(false);

  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="minicart-wrapper position-relative">
      <button className="btn btn-outline-light position-relative" onClick={() => setOpen(!open)}>
        Carrinho
        <span className="badge bg-success text-dark ms-2">{itemCount}</span>
      </button>

      {open && (
        <div className="minicart-dropdown card bg-dark text-white p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Seu carrinho</strong>
            <button className="btn btn-sm btn-outline-secondary" onClick={clear}>Limpar</button>
          </div>
          {items.length === 0 && <div className="text-muted">Seu carrinho está vazio.</div>}
          {items.length > 0 && (
            <ul className="list-unstyled minicart-list">
              {items.map((it) => (
                <li key={it.id} className="d-flex align-items-center mb-2">
                  {it.image && (
                    <img src={it.image} alt={it.title} className="me-2 minicart-thumb" />
                  )}
                  <div className="flex-grow-1">
                    <div className="small">{it.title}</div>
                    <div className="d-flex align-items-center">
                      <input
                        type="number"
                        className="form-control form-control-sm qty-input me-2"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => updateQuantity(it.id, parseInt(e.target.value || '1', 10))}
                      />
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(it.id)}>
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="d-flex justify-content-between mt-2">
            <span>Total</span>
            <strong>R$ {total.toFixed(2)}</strong>
          </div>
          <a href="#checkout" className="btn btn-success text-dark w-100 mt-2 disabled" aria-disabled>
            Finalizar compra (em breve)
          </a>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
