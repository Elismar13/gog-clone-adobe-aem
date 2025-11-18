import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../state/CartContext';

const Checkout: React.FC = () => {
  const { state: auth, login } = useAuth();
  const { items, total } = useCart();

  if (!auth.isAuthenticated) {
    return (
      <div className="container text-white my-5">
        <div className="card bg-dark text-white p-4">
          <h2 className="mb-3">Checkout</h2>
          <p>Você precisa estar logado para continuar.</p>
          <button className="btn btn-success" onClick={login}>Fazer login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container text-white my-5">
      <h2 className="mb-4">Checkout</h2>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card bg-dark text-white p-4">
            <h4 className="mb-3">Itens do carrinho</h4>
            {items.length === 0 ? (
              <div>Seu carrinho está vazio.</div>
            ) : (
              <ul className="list-unstyled">
                {items.map((it) => (
                  <li key={it.id} className="d-flex justify-content-between py-2 border-bottom border-secondary">
                    <span>{it.title} x {it.quantity}</span>
                    <span>R$ {(it.price * it.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card bg-dark text-white p-4">
            <h4 className="mb-3">Resumo</h4>
            <div className="d-flex justify-content-between">
              <span>Total</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
            <button className="btn btn-success mt-3" disabled>
              Continuar pagamento (em breve)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
