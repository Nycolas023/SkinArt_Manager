import React, { useState } from 'react';
import './ServiceOrders.css';

function ServiceOrders({ userRole }) {
  const [orders, setOrders] = useState([
    {
      id: 1245,
      client: 'João Silva',
      artist: 'Maria Souza',
      date: '10/05/2023',
      service: 'Tatuagem de dragão (sessão 2)',
      value: 800.00,
      status: 'paid',
      commission: 320.00,
      paymentMethod: 'Pix'
    },
    {
      id: 1244,
      client: 'Ana Oliveira',
      artist: 'Carlos Lima',
      date: '09/05/2023',
      service: 'Tatuagem nas costas (sessão 1)',
      value: 1200.00,
      status: 'partial',
      commission: 480.00,
      paymentMethod: 'Cartão'
    },
    {
      id: 1243,
      client: 'Pedro Santos',
      artist: 'Maria Souza',
      date: '08/05/2023',
      service: 'Tatuagem tribal na perna',
      value: 600.00,
      status: 'pending',
      commission: 240.00,
      paymentMethod: 'Dinheiro'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleGenerateReceipt = (orderId) => {
    // Lógica para gerar recibo (PDF)
    alert(`Recibo da OS #${orderId} gerado com sucesso!`);
  };

  return (
    <div className="service-orders">
      <div className="page-header">
        <h3>Ordens de Serviço</h3>
        <div className="actions">
          <select 
            className="form-control filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="paid">Pagas</option>
            <option value="partial">Parciais</option>
            <option value="pending">Pendentes</option>
          </select>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setCurrentOrder(null);
              setShowModal(true);
            }}
          >
            <i className="fas fa-plus"></i> Nova OS
          </button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nº OS</th>
              <th>Cliente</th>
              <th>Tatuador</th>
              <th>Serviço</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.client}</td>
                <td>{order.artist}</td>
                <td>{order.service}</td>
                <td>R$ {order.value.toFixed(2)}</td>
                <td>
                  <span className={`badge ${order.status}`}>
                    {order.status === 'paid' && 'Pago'}
                    {order.status === 'partial' && 'Parcial'}
                    {order.status === 'pending' && 'Pendente'}
                  </span>
                </td>
                <td>
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle btn-sm" data-toggle="dropdown">
                      Ações
                    </button>
                    <div className="dropdown-menu">
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          setCurrentOrder(order);
                          setShowModal(true);
                        }}
                      >
                        <i className="fas fa-edit"></i> Editar
                      </button>
                      <button 
                        className="dropdown-item"
                        onClick={() => handleGenerateReceipt(order.id)}
                      >
                        <i className="fas fa-receipt"></i> Recibo
                      </button>
                      {order.status !== 'paid' && (
                        <button 
                          className="dropdown-item"
                          onClick={() => handleStatusChange(order.id, 'paid')}
                        >
                          <i className="fas fa-check-circle"></i> Marcar como Pago
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>{currentOrder ? `Editar OS #${currentOrder.id}` : 'Nova Ordem de Serviço'}</h4>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            
            <form>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Cliente</label>
                    <select className="form-control" required>
                      <option value="">Selecione um cliente</option>
                      <option value="1">João Silva</option>
                      <option value="2">Ana Oliveira</option>
                      <option value="3">Pedro Santos</option>
                    </select>
                  </div>
                  
                  <div className="form-group col-md-6">
                    <label>Tatuador</label>
                    <select className="form-control" required>
                      <option value="">Selecione um tatuador</option>
                      <option value="1">Maria Souza</option>
                      <option value="2">Carlos Lima</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Serviço</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    defaultValue={currentOrder?.service || ''}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label>Valor Total (R$)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      step="0.01"
                      defaultValue={currentOrder?.value || ''}
                      required
                    />
                  </div>
                  
                  <div className="form-group col-md-4">
                    <label>Comissão (R$)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      step="0.01"
                      defaultValue={currentOrder?.commission || ''}
                      required
                    />
                  </div>
                  
                  <div className="form-group col-md-4">
                    <label>Método de Pagamento</label>
                    <select 
                      className="form-control" 
                      defaultValue={currentOrder?.paymentMethod || ''}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Pix">Pix</option>
                      <option value="Cartão">Cartão</option>
                      <option value="Transferência">Transferência</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Observações</label>
                  <textarea className="form-control" rows="3"></textarea>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar OS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceOrders;