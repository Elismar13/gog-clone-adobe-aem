import React, { useState } from 'react';
import { useCart } from '../../state/CartContext';
import { useAuth } from '../../state/AuthContext';
import { FiCreditCard, FiSmartphone, FiShoppingCart, FiUser, FiMapPin, FiMail, FiLock } from 'react-icons/fi';
import './Checkout.css';
import calculateDiscount from '../../util/calculateDiscount';
import { CHECKOUT_PAGE_PATH, STORE_PAGE_PATH } from '../../constants/constants';

interface CheckoutProps {
  gotoPath: string;
}

const Checkout: React.FC<CheckoutProps> = ({ gotoPath }) => {
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const { authenticated, initialized, login, userInfo } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    cpf: '',
    phone: '',
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

  const checkoutPath = CHECKOUT_PAGE_PATH;

  // Calculate total discount from individual items
  const getTotalDiscount = () => {
    return items.reduce((sum, item) => {
      return sum + ((item.discountValue || 0) * item.quantity);
    }, 0);
  };

  const getFinalTotal = () => {
    return total;
  };

  const handleLogin = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('goto', checkoutPath);
    login({ redirectUri: url.toString() });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    let processedValue = value;
    
    // Validações e formatações específicas
    switch (field) {
      case 'cpf':
        // Formata CPF: 111.111.111-11
        const numbers = (value as string).replace(/\D/g, '');
        if (numbers.length <= 11) {
          processedValue = numbers
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
        }
        break;
        
      case 'cardNumber':
        // Formata cartão: 1111 1111 1111 1111
        const cardNumbers = (value as string).replace(/\D/g, '');
        if (cardNumbers.length <= 16) {
          processedValue = cardNumbers.replace(/(\d{4})(?=\d)/g, '$1 ');
        }
        break;
        
      case 'cardExpiry':
        // Formata validade: MM/AA
        const expiryNumbers = (value as string).replace(/\D/g, '');
        if (expiryNumbers.length <= 4) {
          processedValue = expiryNumbers.replace(/^(\d{2})(\d)/, '$1/$2');
        }
        break;
        
      case 'cardCvv':
        // Apenas números, máximo 4 dígitos
        processedValue = (value as string).replace(/\D/g, '').slice(0, 4);
        break;
        
      case 'zipCode':
        // Formata CEP: 11111-111
        const zipNumbers = (value as string).replace(/\D/g, '');
        if (zipNumbers.length <= 8) {
          processedValue = zipNumbers.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        break;
        
      case 'phone':
        // Formata telefone: (11) 11111-1111
        const phoneNumbers = (value as string).replace(/\D/g, '');
        if (phoneNumbers.length <= 11) {
          if (phoneNumbers.length <= 10) {
            // Telefone fixo: (11) 1111-1111
            processedValue = phoneNumbers.replace(/^(\d{2})(\d)/, '($1) $2')
              .replace(/^(\(\d{2}\) \d{4})(\d)/, '$1-$2');
          } else {
            // Celular: (11) 11111-1111
            processedValue = phoneNumbers.replace(/^(\d{2})(\d)/, '($1) $2')
              .replace(/^(\(\d{2}\) \d{5})(\d)/, '$1-$2');
          }
        }
        break;
        
      case 'state':
        // Apenas letras maiúsculas, máximo 2 caracteres
        processedValue = (value as string).toUpperCase().slice(0, 2);
        break;
        
      case 'email':
        // Converte para minúsculas
        processedValue = (value as string).toLowerCase();
        break;
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    // Validações básicas
    if (!formData.fullName || formData.fullName.length < 3) {
      errors.push('Nome completo deve ter pelo menos 3 caracteres');
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('E-mail inválido');
    }
    
    if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
      errors.push('CPF deve ter 11 dígitos');
    }
    
    if (!formData.address || formData.address.length < 5) {
      errors.push('Endereço deve ter pelo menos 5 caracteres');
    }
    
    if (!formData.city || formData.city.length < 2) {
      errors.push('Cidade deve ter pelo menos 2 caracteres');
    }
    
    if (!formData.state || formData.state.length !== 2) {
      errors.push('Estado deve ter 2 caracteres');
    }
    
    if (!formData.zipCode || formData.zipCode.replace(/\D/g, '').length !== 8) {
      errors.push('CEP deve ter 8 dígitos');
    }
    
    if (paymentMethod === 'credit') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\D/g, '').length !== 16) {
        errors.push('Número do cartão deve ter 16 dígitos');
      }
      
      if (!formData.cardName || formData.cardName.length < 3) {
        errors.push('Nome no cartão é obrigatório');
      }
      
      if (!formData.cardExpiry || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        errors.push('Validade deve estar no formato MM/AA');
      }
      
      if (!formData.cardCvv || formData.cardCvv.length < 3) {
        errors.push('CVV deve ter pelo menos 3 dígitos');
      }
    }
    
    if (!formData.termsAccepted) {
      errors.push('Você deve aceitar os termos de serviço');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Erros de validação:\n' + errors.join('\n'));
      return;
    }
    
    try {
      // Calculate totals
      const totalAmount = total;
      const discountAmount = getTotalDiscount();
      const finalAmount = getFinalTotal();

      // Prepare order data in the format expected by OrderFragmentServlet
      const orderData = {
        userId: userInfo?.sub,
        items: items.map(item => ({
          gameId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: totalAmount,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        paymentMethod: paymentMethod,
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          cpf: formData.cpf,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        // Payment details for credit card
        ...(paymentMethod === 'credit' && {
          cardInfo: {
            number: formData.cardNumber.replace(/\s/g, ''), // Remove spaces
            name: formData.cardName,
            expiry: formData.cardExpiry,
            cvv: formData.cardCvv
          }
        })
      };

      // Send order to servlet
      const response = await fetch('/bin/gogstore/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // Clear cart after successful order
        clear();
        
        // Show success message
        alert(`Pedido #${result.orderNumber} criado com sucesso!\n\nObrigado pela sua compra!`);
        
        // Redirect to order history or home page
        window.location.href = gotoPath || STORE_PAGE_PATH;
      } else {
        throw new Error(result.error || 'Erro ao processar pedido');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erro ao processar pedido: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
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
          <div className="order-summary-content d-sm-row">
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
                        {item.discountValue && item.discountValue > 0 ? (
                          <>
                            <span className="original-price">R$ {(item.price * item.quantity).toFixed(2)}</span>
                            <span className="discount-indicator">-R$ {(calculateDiscount(item.price, item.discountValue).differenceNoFormatted * item.quantity).toFixed(2)}</span>
                            <span className="final-price">R$ {(calculateDiscount(item.price, item.discountValue).currentNoFormmated * item.quantity).toFixed(2)}</span>
                          </>
                        ) : (
                          <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                        )}
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
              {getTotalDiscount() > 0 && (
                <div className="total-line discount">
                  <span>Desconto extra:</span>
                  <span className="discount-amount">-R$ {0.00.toFixed(2)}</span>
                </div>
              )}
              <div className="total-line final">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
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
                    maxLength={14}
                    placeholder="123.456.789-00"
                  />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 11111-1111"
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
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="pix-info">
                  <div className="pix-message">
                    <FiSmartphone className="pix-icon" />
                    <p className="text-white">Ao confirmar, você será redirecionado para a página do PIX para completar o pagamento.</p>
                    <p className="text-white">O código PIX será gerado após a confirmação do pedido.</p>
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
                  <span>Eu concordo com os <button type="button" className="terms-link" onClick={(e) => { e.preventDefault(); alert('Termos de serviço - Em desenvolvimento'); }}>termos de serviço</button> e <button type="button" className="terms-link" onClick={(e) => { e.preventDefault(); alert('Política de privacidade - Em desenvolvimento'); }}>política de privacidade</button></span>
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
