import React, { useState } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  // Estado inicial com usuários de exemplo
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Administrador',
      email: 'admin@studiopiercing.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-05-15'
    },
    {
      id: 2,
      name: 'Tatuador Principal',
      email: 'tatuador@studiopiercing.com',
      role: 'tatuador',
      status: 'active',
      lastLogin: '2023-05-14'
    },
    {
      id: 3,
      name: 'Atendente',
      email: 'atendente@studiopiercing.com',
      role: 'recepcao',
      status: 'inactive',
      lastLogin: '2023-05-10'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra usuários por termo de busca
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manipuladores de eventos
  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const userData = {
      id: currentUser?.id || Math.max(...users.map(u => u.id), 0) + 1,
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      status: formData.get('status'),
      lastLogin: currentUser?.lastLogin || new Date().toISOString().split('T')[0]
    };

    if (currentUser) {
      setUsers(users.map(user =>
        user.id === currentUser.id ? userData : user
      ));
    } else {
      setUsers([...users, userData]);
    }

    setShowModal(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>Gerenciamento de Usuários</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            className="add-user-button"
            onClick={() => {
              setCurrentUser(null);
              setShowModal(true);
            }}
          >
            + Novo Usuário
          </button>
        </div>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Último Login</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`user-role ${user.role}`}>
                    {user.role === 'admin' && 'Administrador'}
                    {user.role === 'tatuador' && 'Tatuador'}
                    {user.role === 'recepcao' && 'Atendente'}
                  </span>
                </td>
                <td>
                  <span className={`user-status ${user.status}`}>
                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td className="actions">
                  <button
                    className="edit-button"
                    onClick={() => {
                      setCurrentUser(user);
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para adicionar/editar usuário */}
      {showModal && (
        <div className="user-modal-overlay">
          <div className="user-modal">
            <div className="modal-header">
              <h3>{currentUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="form-group">
                <label htmlFor="name">Nome Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={currentUser?.name || ''}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={currentUser?.email || ''}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Tipo de Usuário</label>
                <select
                  id="role"
                  name="role"
                  defaultValue={currentUser?.role || 'recepcao'}
                  required
                >
                  <option value="admin">Administrador</option>
                  <option value="tatuador">Tatuador</option>
                  <option value="recepcao">Atendente</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={currentUser?.status || 'active'}
                  required
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;