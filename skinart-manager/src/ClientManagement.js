import React, { useState } from 'react';
import './ClientManagement.css';

function ClientManagement({ userRole }) {
  const [clients, setClients] = useState([
    { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', birthDate: '15/05/1990', tattoos: 3 },
    { id: 2, name: 'Maria Souza', email: 'maria@email.com', phone: '(11) 98888-8888', birthDate: '22/08/1985', tattoos: 5 },
    { id: 3, name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 97777-7777', birthDate: '10/12/1992', tattoos: 2 },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (client) => {
    setCurrentClient(client);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(clients.filter(client => client.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Lógica para salvar o cliente
    setShowModal(false);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="client-management">
      <div className="page-header">
        <h3>Gerenciamento de Clientes</h3>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setCurrentClient(null);
            setShowModal(true);
          }}
        >
          <i className="fas fa-plus"></i> Novo Cliente
        </button>
      </div>
      
      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Pesquisar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Data Nasc.</th>
              <th>Tatuagens</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.birthDate}</td>
                <td>{client.tattoos}</td>
                <td>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEdit(client)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() => handleDelete(client.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
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
              <h4>{currentClient ? 'Editar Cliente' : 'Novo Cliente'}</h4>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    defaultValue={currentClient?.name || ''}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>E-mail</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      defaultValue={currentClient?.email || ''}
                      required
                    />
                  </div>
                  
                  <div className="form-group col-md-6">
                    <label>Telefone</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      defaultValue={currentClient?.phone || ''}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Data de Nascimento</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    defaultValue={currentClient?.birthDate || ''}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Observações</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientManagement;