import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  // Estado inicial com usuários de exemplo
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Administrador',
      email: 'admin01',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-05-15'
    },
    {
      id: 2,
      name: 'Tatuador Principal',
      email: 'tatuador01',
      role: 'tatuador',
      status: 'active',
      lastLogin: '2023-05-14'
    },
    
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://localhost:5273/api/Usuario/RetornaTodosUsuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Mapear os dados do backend para o formato esperado pelo frontend
          const formattedUsers = data.map(user => ({
            id: user.ID_USUARIO,
            name: `${user.NOME_USUARIO} ${user.SOBRENOME_USUARIO}`.trim(),
            email: user.LOGIN_USUARIO,
            cpf: user.CPF_USUARIO,         // Campo adicionado
            rg: user.RG_USUARIO,           // Campo adicionado
            role: determineRole(user),
            status: user.STATUS_USUARIO?.toLowerCase() === 'ativo' ? 'active' : 'inactive',
            lastLogin: user.ULTIMO_LOGIN ? new Date(user.ULTIMO_LOGIN).toISOString().split('T')[0] : ''
          }));
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };

    // Determinar o papel com base nos dados do usuário
    const determineRole = (user) => {
      // Se contém "admin" no login, é um admin
      if (user.LOGIN_USUARIO.includes('admin')) return 'admin';
      // Qualquer outro usuário será tatuador (incluindo os antigos atendentes)
      return 'tatuador';
    };

    fetchUsers();
  }, []);

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

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Inclua cpf e rg no userData
    const userData = {
      id: currentUser?.id || Math.max(...users.map(u => u.id), 0) + 1,
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      status: formData.get('status'),
      lastLogin: currentUser?.lastLogin || new Date().toISOString().split('T')[0],
      cpf: formData.get('cpf'),
      rg: formData.get('rg')
    };

    if (!currentUser) {
      try {
        // Dividir nome completo em nome e sobrenome
        const fullName = formData.get('name').split(' ');
        const firstName = fullName[0];
        const lastName = fullName.slice(1).join(' ') || '';
        
        // Preparar dados para o backend - criação de usuário
        const backendData = {
          NOME_USUARIO: firstName,
          SOBRENOME_USUARIO: lastName,
          LOGIN_USUARIO: formData.get('email'),
          EMAIL: formData.get('email'), 
          SENHA_USUARIO: `${firstName.toLowerCase()}123`,
          DATA_NASC_USUARIO: new Date().toISOString(),
          CPF_USUARIO: formData.get('cpf'),    // Campo adicionado
          RG_USUARIO: formData.get('rg')      // Campo adicionado
        };

        // Enviar para o backend
        const response = await fetch('https://localhost:5273/api/Usuario/CriaUsuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(backendData)
        });

        // Depois do fetch e antes do if (!response.ok)
        console.log('Resposta do servidor:', await response.clone().text());

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro completo:', errorText);
          throw new Error(`Erro ao criar usuário: ${errorText}`);
        }

        // Sucesso - adiciona à lista local
        setUsers([...users, userData]);
        setShowModal(false);

      } catch (error) {
        alert(error.message);
        console.error('Erro ao criar usuário:', error);
        return; // Não fecha o modal em caso de erro
      }
    } else {
      try {
        // Lógica de atualização (semelhante à criação)
        const fullName = formData.get('name').split(' ');
        const firstName = fullName[0];
        const lastName = fullName.slice(1).join(' ') || '';
        
        // Na atualização de usuário
        const backendData = {
          ID_USUARIO: currentUser.id,
          NOME_USUARIO: firstName,
          SOBRENOME_USUARIO: lastName,
          LOGIN_USUARIO: formData.get('email'), // CORREÇÃO: Usar o valor do formulário
          SENHA_USUARIO: `${firstName.toLowerCase()}123`, // Nota: a senha está sendo resetada aqui
          DATA_NASC_USUARIO: new Date().toISOString(),
          CPF_USUARIO: formData.get('cpf'),
          RG_USUARIO: formData.get('rg'),
          STATUS_USUARIO: formData.get('status') === 'active' ? 'ATIVO' : 'INATIVO', // Enviando status
          ROLE_USUARIO: formData.get('role') // Enviando tipo/role
        };

        const response = await fetch('https://localhost:5273/api/Usuario/EditarUsuario', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(backendData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao atualizar usuário: ${errorText}`);
        }

        // Atualiza a lista local
        setUsers(users.map(user =>
          user.id === currentUser.id ? userData : user
        ));
        setShowModal(false);
        
      } catch (error) {
        alert(error.message);
        console.error('Erro ao atualizar usuário:', error);
        return;
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        const response = await fetch(`https://localhost:5273/api/Usuario/DeletaUsuario?idUsuario=${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao excluir usuário: ${errorText}`);
        }
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        alert(error.message);
      }
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
              <th>Forma de Login</th>
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
                    {user.role === 'recepcao' && 'Tatuador'}
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

      {/* Nova tabela de RG e CPF */}
      <div className="user-table-container" style={{ marginTop: 32 }}>
        <h3>RG e CPF dos Usuários</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>RG</th>
              <th>CPF</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id + '-rgcpf'}>
                <td>{user.name}</td>
                <td>{user.rg}</td>
                <td>{user.cpf}</td>
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
                <label htmlFor="email">Forma de Login</label>
                {/* Alterado de "email" para "text" para remover a validação de formato */}
                <input
                  type="text"
                  id="email"
                  name="email"
                  defaultValue={currentUser?.email || ''}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cpf">CPF</label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    placeholder="000.000.000-00"
                    defaultValue={currentUser?.cpf || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rg">RG</label>
                  <input
                    type="text"
                    id="rg"
                    name="rg"
                    placeholder="00.000.000-0"
                    defaultValue={currentUser?.rg || ''}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="role">Tipo de Usuário</label>
                <select
                  id="role"
                  name="role"
                  defaultValue={currentUser?.role || 'tatuador'}
                  required
                >
                  <option value="admin">Administrador</option>
                  <option value="tatuador">Tatuador</option>
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