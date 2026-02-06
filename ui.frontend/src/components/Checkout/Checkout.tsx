import React, { useState } from 'react';
import { useCart } from '../../state/CartContext';
import { useAuth } from '../../state/AuthContext';
import { FiCreditCard, FiSmartphone, FiShoppingCart, FiUser, FiMapPin, FiMail, FiLock } from 'react-icons/fi';
import './Checkout.css';

const Checkout: React.FC = () => {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { authenticated, initialized, login } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    cpf: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    termsAccepted: false
  });

  const checkoutPath = '/content/gogstore/us/en/gamecheckout.html';

  const handleLogin = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('goto', checkoutPath);
    login({ redirectUri: url.toString() });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checkout data:', { items, total, paymentMethod, formData });
    // TODO: Implement payment processing
    alert('Pedido processado com sucesso! (Simulação)');
  };

  if (!initialized) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">
          <div className="spinner"></div>
          <p>Inicializando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="checkout-container">
        <div className="checkout-auth">
          <div className="checkout-header">
            <FiShoppingCart className="checkout-icon" />
            <h1>Checkout</h1>
          </div>
          <div className="auth-required">
            <FiLock className="lock-icon" />
            <h2>Autenticação Necessária</h2>
            <p className="text-white">Você precisa estar autenticado para continuar com o checkout.</p>
            <button className="btn-login" onClick={handleLogin}>
              Entrar com Keycloak
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart">
          <FiShoppingCart className="empty-icon" />
          <h2>Carrinho Vazio</h2>
          <p>Seu carrinho está vazio. Adicione alguns jogos antes de continuar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <FiShoppingCart className="checkout-icon" />
        <h1>Finalizar Compra</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Resumo do Pedido</h2>
            <div className="order-items">
              {items.map((item) => (
                <div key={item.id} className="order-item">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="item-image" />
                  )}
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <div className="item-controls">
                      <div className="quantity-control">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <div className="item-price">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="remove-btn"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="total-line discount">
                <span>
                  <span className="discount-badge">Desconto 10%</span>
                  <span className="discount-text">Promoção especial!</span>
                </span>
                <span className="discount-amount">-R$ {(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Tax:</span>
                <span>R$ 0.00</span>
              </div>
              <div className="total-line final">
                <span>Total:</span>
                <span>R$ {(total * 0.9).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="payment-form">
            <h2>Informações de Pagamento</h2>
            
            {/* User Information */}
            <div className="form-section">
              <h3><FiUser /> Informações Pessoais</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="João Silva"
                  />
                </div>
                <div className="form-group">
                  <label><FiMail /> E-mail</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="joao@exemplo.com"
                  />
                </div>
                <div className="form-group">
                  <label>CPF</label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="123.456.789-00"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="form-section">
              <h3><FiMapPin /> Endereço</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Endereço Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Rua das Flores, 123"
                  />
                </div>
                <div className="form-group">
                  <label>Cidade</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="São Paulo"
                  />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="SP"
                  />
                </div>
                <div className="form-group">
                  <label>CEP</label>
                  <input
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="01234-567"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h3>Método de Pagamento</h3>
              <div className="payment-methods">
                <button
                  type="button"
                  className={`payment-method ${paymentMethod === 'credit' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('credit')}
                >
                  <FiCreditCard />
                  <span>Cartão de Crédito</span>
                </button>
                <button
                  type="button"
                  className={`payment-method ${paymentMethod === 'pix' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('pix')}
                >
                  <FiSmartphone />
                  <span>PIX</span>
                </button>
              </div>

              {paymentMethod === 'credit' && (
                <div className="credit-card-form">
                  <div className="form-group">
                    <label>Número do Cartão</label>
                    <input
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nome no Cartão</label>
                    <input
                      type="text"
                      required
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="JOÃO SILVA"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Validade</label>
                      <input
                        type="text"
                        required
                        value={formData.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        required
                        value={formData.cardCvv}
                        onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="pix-info">
                  <div className="pix-message">
                    <FiSmartphone className="pix-icon" />
                    <p>Ao confirmar, você será redirecionado para a página do PIX para completar o pagamento.</p>
                    <p>O código PIX será gerado após a confirmação do pedido.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Submit */}
            <div className="form-section">
              <div className="terms-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    required
                    checked={formData.termsAccepted}
                    onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  />
                  <span>Eu concordo com os <a href="#" className="terms-link">termos de serviço</a> e <a href="#" className="terms-link">política de privacidade</a></span>
                </label>
              </div>
              
              <button type="submit" className="submit-btn">
                {paymentMethod === 'credit' ? 'Pagar com Cartão' : 'Gerar PIX'}
                <span className="submit-amount">R$ {total.toFixed(2)}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
