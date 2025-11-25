import React from 'react';
import { useCart } from '../state/CartContext';

const Checkout: React.FC = () => {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <div className="container py-4 text-white">
      <h1 className="mb-4">Checkout</h1>

      {items.length === 0 && (
        <div className="alert alert-secondary">Seu carrinho está vazio.</div>
      )}

      {items.length > 0 && (
        <>
          <ul className="list-unstyled">
            {items.map((it) => (
              <li key={it.id} className="d-flex align-items-center mb-3">
                {it.image && (
                  <img src={it.image} alt={it.title} style={{ width: 64, height: 64, objectFit: 'cover' }} className="me-2" />
                )}
                <div className="flex-grow-1">
                  <div>{it.title}</div>
                  <div className="d-flex align-items-center mt-1">
                    <input
                      type="number"
                      className="form-control form-control-sm me-2"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => updateQuantity(it.id, parseInt(e.target.value || '1', 10))}
                    />
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(it.id)}>Remover</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between mt-3">
            <span>Total</span>
            <strong>R$ {total.toFixed(2)}</strong>
          </div>
          <button className="btn btn-success text-dark mt-3">Confirmar pedido</button>
        </>
      )}
    </div>
  );
};

export default Checkout;
