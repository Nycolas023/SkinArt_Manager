import React, { useState, useEffect } from 'react';
import './ServiceOrders.css';

function ServiceOrders({ userRole }) {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [clientes, setClientes] = useState([]);
  const [tatuadores, setTatuadores] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Estados do formulário
  const [form, setForm] = useState({
    cliente: '',
    tatuador: '',
    servico: '',
    valor: '',
    comissao: '',
    metodoPagamento: '',
    observacoes: ''
  });

  // Buscar clientes e tatuadores ao abrir o modal
  useEffect(() => {
    if (showModal) {
      fetch('https://localhost:5000/api/Cliente', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          // Normaliza para sempre ter Id e NomeCompleto
          setClientes(
            data.map(c => ({
              Id: c.Id ?? c.id,
              NomeCompleto: c.NomeCompleto ?? c.nomeCompleto
            }))
          );
        });

      fetch('https://localhost:5000/api/Agendamento/tatuadores-dropdown', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          setTatuadores(
            data.map(t => ({
              Id: t.Id ?? t.id,
              NomeCompleto: t.NomeCompleto ?? t.nomeCompleto
            }))
          );
        });
    }
  }, [showModal]);

  // Adicione este useEffect após a definição dos estados
  useEffect(() => {
    if (
      isEditing &&
      currentOrder &&
      clientes.length > 0 &&
      tatuadores.length > 0
    ) {
      setForm({
        cliente: currentOrder.clientId ? String(currentOrder.clientId) : '',
        tatuador: currentOrder.artistId ? String(currentOrder.artistId) : '',
        servico: currentOrder.service || '',
        valor: currentOrder.value || '',
        comissao: currentOrder.comissao || '',
        metodoPagamento: currentOrder.metodoPagamento || '',
        observacoes: currentOrder.observacoes || ''
      });
    }
    // eslint-disable-next-line
  }, [isEditing, currentOrder, clientes, tatuadores]);

  // Buscar ordens de serviço ao carregar a página
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://localhost:5000/api/OrdemServico/ListaOrdemServico', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Mapeia para o formato esperado pela tabela visual
        setOrders(
          data.map(o => ({
            id: o.ID_ORDEM_SERVICO,
            client: o.CLIENTE,
            clientId: o.ID_CLIENTE,
            artist: o.TATUADOR,
            artistId: o.ID_TATUADOR,
            service: o.DESCRICAO_SERVICO,
            value: o.VALOR,
            status: o.STATUS_SERVICO,
            comissao: o.COMISSAO !== null && o.COMISSAO !== undefined ? o.COMISSAO : 0,
            metodoPagamento: o.METODO_PAGAMENTO || '',
            observacoes: o.OBSERVACOES || ''
          }))
        );
      }
    } catch (err) {
      alert('Erro ao carregar ordens de serviço.');
    }
  };

  // Atualizar campos do formulário
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Ao clicar em Editar
  const handleEdit = (order) => {
    setCurrentOrder(order);
    setIsEditing(true);
    setShowModal(true);
  };

  // Ao clicar em Nova OS
  const handleNew = () => {
    setCurrentOrder(null);
    setForm({
      cliente: '',
      tatuador: '',
      servico: '',
      valor: '',
      comissao: '',
      metodoPagamento: '',
      observacoes: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Enviar para API ao salvar
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ID_CLIENTE: parseInt(form.cliente),
      ID_TATUADOR: parseInt(form.tatuador),
      DESCRICAO_SERVICO: form.servico,
      VALOR: parseFloat(form.valor),
      STATUS_SERVICO: 'pending',
      COMISSAO: form.comissao !== '' ? parseFloat(form.comissao) : 0,
      METODO_PAGAMENTO: form.metodoPagamento || '',
      OBSERVACOES: form.observacoes || ''
    };

    try {
      let response;
      if (isEditing && currentOrder) {
        // PUT para editar
        response = await fetch(`https://localhost:5000/api/OrdemServico/AtualizaOrdem`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ ...payload, ID_ORDEM_SERVICO: currentOrder.id })
        });
      } else {
        // POST para criar
        response = await fetch('https://localhost:5000/api/OrdemServico/CriaOrdem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        alert(isEditing ? 'Ordem de serviço editada com sucesso!' : 'Ordem de serviço criada com sucesso!');
        setShowModal(false);
        await fetchOrders();
      } else {
        alert('Erro ao salvar ordem de serviço.');
      }
    } catch (err) {
      alert('Erro de conexão com a API.');
    }
  };

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
            onClick={handleNew}
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
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle btn-sm" data-toggle="dropdown">
                      Ações
                    </button>
                    <div className="dropdown-menu">
                      <button 
                        className="dropdown-item"
                        onClick={() => handleEdit(order)}
                      >
                        <i className="fas fa-edit"></i> Editar
                      </button>
                      <button 
                        className="dropdown-item"
                        onClick={() => handleGenerateReceipt(order.id)}
                      >
                        <i className="fas fa-receipt"></i> Recibo
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 32 }}>
        <h5 style={{ margin: 16 }}>Detalhes das Ordens de Serviço</h5>
        <table className="table">
          <thead>
            <tr>
              <th>Nº OS</th>
              <th>Comissão</th>
              <th>Método de Pagamento</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>Nenhuma ordem de serviço cadastrada.</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>R$ {Number(order.comissao || 0).toFixed(2)}</td>
                  <td>{order.metodoPagamento || '-'}</td>
                  <td>{order.observacoes || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>{isEditing ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}</h4>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Cliente</label>
                    <select
                      className="form-control"
                      name="cliente"
                      value={form.cliente}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um cliente</option>
                      {clientes.map(c => (
                        <option key={c.Id} value={String(c.Id)}>
                          {c.NomeCompleto}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label>Tatuador</label>
                    <select
                      className="form-control"
                      name="tatuador"
                      value={form.tatuador}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um tatuador</option>
                      {tatuadores.map(t => (
                        <option key={t.Id} value={String(t.Id)}>
                          {t.NomeCompleto}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Serviço</label>
                  <input
                    type="text"
                    className="form-control"
                    name="servico"
                    value={form.servico}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label>Valor Total (R$)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="valor"
                      step="0.01"
                      value={form.valor}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Comissão (R$)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="comissao"
                      step="0.01"
                      value={form.comissao}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Método de Pagamento</label>
                    <select
                      className="form-control"
                      name="metodoPagamento"
                      value={form.metodoPagamento}
                      onChange={handleChange}
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
                  <textarea
                    className="form-control"
                    name="observacoes"
                    rows="3"
                    value={form.observacoes}
                    onChange={handleChange}
                  ></textarea>
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