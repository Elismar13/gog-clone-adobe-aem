import React from 'react';
import { useCart } from '../../state/CartContext';
import { useAuth } from '../../auth/AuthContext';

const Checkout: React.FC = () => {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { authenticated, initialized, login } = useAuth();

  const checkoutPath = '/content/gogstore/us/en/gamecheckout.html';

  const handleLogin = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('goto', checkoutPath);
    login({ redirectUri: url.toString() });
  };

  if (!initialized) {
    return <div className="container py-5 text-white">Inicializando autenticação...</div>;
  }

  if (!authenticated) {
    return (
      <div className="container py-5 text-white">
        <h2 className="mb-3">Checkout</h2>
        <p className="mb-3">Você precisa estar autenticado para continuar com o checkout.</p>
        <button className="btn btn-success text-dark" onClick={handleLogin}>Entrar com Keycloak</button>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="container py-5 text-white">Seu carrinho está vazio.</div>;
  }

  return (
    <div className="container py-4 text-white">
      <h1 className="mb-4">Checkout</h1>
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
    </div>
  );
};

export default Checkout;
