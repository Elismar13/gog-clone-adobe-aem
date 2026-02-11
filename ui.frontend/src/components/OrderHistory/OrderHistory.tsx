import React, { useState, useEffect } from 'react';
import { useAuth } from '../../state/AuthContext';
import * as FiIcons from 'react-icons/fi';
import './OrderHistory.css';

interface OrderItem {
  gameId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: 'completed' | 'processing' | 'cancelled';
  paymentMethod: 'credit_card' | 'pix';
  createdAt: string;
  updatedAt: string;
}

interface OrderHistoryProps {
  title?: string;
  emptyMessage?: string;
  itemsPerPage?: number;
  showDateFilter?: boolean;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({
  title = "Meus Pedidos",
  emptyMessage = "Você ainda não fez nenhuma compra. Explore nossa loja e encontre seus jogos favoritos!",
  itemsPerPage = 10,
  showDateFilter = true
}) => {
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchOrders = async () => {
    if (!userInfo?.sub) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        userId: userInfo.sub,
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });

      if (showDateFilter && dateFilter.startDate) {
        params.append('startDate', dateFilter.startDate);
      }
      if (showDateFilter && dateFilter.endDate) {
        params.append('endDate', dateFilter.endDate);
      }

      const response = await fetch(`/bin/gogstore/orders-cf?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos');
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userInfo?.sub, currentPage, dateFilter, itemsPerPage, showDateFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'processing': return 'Processando';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'processing': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getPaymentMethodText = (method: string) => {
    return method === 'credit_card' ? 'Cartão de Crédito' : 'PIX';
  };

  const handleDateFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  const clearDateFilter = () => {
    setDateFilter({ startDate: '', endDate: '' });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="order-history loading">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando seus pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-error">
        <div className="alert alert-danger" role="alert">
          <FiIcons.FiPackage className="me-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!userInfo?.sub) {
    return (
      <div className="order-history-not-authenticated">
        <div className="alert alert-info" role="alert">
          <FiIcons.FiPackage className="me-2" />
          Faça login para ver seu histórico de pedidos.
        </div>
      </div>
    );
  }

  return (
    <div className="container order-history">
      <div className="order-history-header">
        <h2 className="order-history-title">
          <FiIcons.FiShoppingBag className="me-2" />
          {title}
        </h2>
        
        {showDateFilter && (
          <form className="date-filter-form" onSubmit={handleDateFilterSubmit}>
            <div className="row g-2 align-items-end">
              <div className="col-auto">
                <label htmlFor="startDate" className="form-label">Data Inicial</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="col-auto">
                <label htmlFor="endDate" className="form-label">Data Final</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary">
                  <FiIcons.FiFilter className="me-1" />
                  Filtrar
                </button>
              </div>
              <div className="col-auto">
                <button type="button" className="btn btn-outline-secondary" onClick={clearDateFilter}>
                  Limpar
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="order-history-empty">
          <div className="text-center py-5">
            <FiIcons.FiPackage className="empty-icon mb-3" />
            <p className="empty-message">{emptyMessage}</p>
          </div>
        </div>
      ) : (
        <div className="order-history-content">
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h5 className="order-number">Pedido #{order.orderNumber}</h5>
                    <div className="order-meta">
                      <span className="order-date">
                        <FiIcons.FiCalendar className="me-1" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span className={`order-status ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                  <div className="order-total">
                    <div className="total-amount">{formatCurrency(order.finalAmount)}</div>
                    <div className="payment-method">{getPaymentMethodText(order.paymentMethod)}</div>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      {item.image && (
                        <img src={item.image} alt={item.title} className="item-image" />
                      )}
                      <div className="item-details">
                        <h6 className="item-title">{item.title}</h6>
                        <div className="item-meta">
                          <span className="item-quantity">Qtd: {item.quantity}</span>
                          <span className="item-price">{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                      <div className="item-total">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {order.discountAmount > 0 && (
                  <div className="order-discount">
                    <span className="discount-label">Desconto:</span>
                    <span className="discount-amount">-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}

                <div className="order-footer">
                  <div className="order-summary">
                    <span className="summary-label">Total:</span>
                    <span className="summary-total">{formatCurrency(order.finalAmount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="order-pagination">
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <FiIcons.FiChevronLeft />
                      Anterior
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                      <FiIcons.FiChevronRight />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
