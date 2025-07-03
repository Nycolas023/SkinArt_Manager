import React, { useState, useEffect } from 'react';
import './ClientManagement.css';

function ClientManagement({ userRole }) {
    const [clients, setClients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [form, setForm] = useState({
        NomeCompleto: '',
        Email: '',
        Telefone: '',
        DataNascimento: '',
        Observacoes: ''
    });

    // Carregar clientes do backend ao abrir a tela
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('https://localhost:5273/api/Cliente', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setClients(data);
                } else {
                    console.error('Erro ao carregar clientes:', response.status);
                }
            } catch (error) {
                console.error('Erro ao carregar clientes:', error);
            }
        };

        fetchClients();
    }, []);

    // Preencher formulário ao editar
    useEffect(() => {
        if (currentClient) {
            setForm({
                NomeCompleto: currentClient.NomeCompleto || '',
                Email: currentClient.Email || '',
                Telefone: currentClient.Telefone || '',
                DataNascimento: currentClient.DataNascimento ?
                    currentClient.DataNascimento.substring(0, 10) : '',
                Observacoes: currentClient.Observacoes || ''
            });
        } else {
            setForm({
                NomeCompleto: '',
                Email: '',
                Telefone: '',
                DataNascimento: '',
                Observacoes: ''
            });
        }
    }, [currentClient, showModal]);

    const handleEdit = (client) => {
        setCurrentClient(client);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!id) {
            alert('Cliente inválido. Não é possível excluir.');
            return;
        }
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                const response = await fetch(`https://localhost:5273/api/Cliente/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    setClients(clients.filter(client => client.Id !== id));
                } else {
                    alert('Erro ao excluir cliente');
                }
            } catch (error) {
                alert('Erro ao excluir cliente: ' + error.message);
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Verifica se já existe cliente com este e-mail (excluindo o cliente atual em caso de edição)
        if (clients.some(c => c.Email === form.Email && (!currentClient || c.Id !== currentClient.Id))) {
            alert('Já existe um cliente cadastrado com este e-mail.');
            return;
        }

        // Define o método e URL apropriados baseados em criação ou edição
        const method = currentClient ? 'PUT' : 'POST';
        const url = currentClient
            ? `https://localhost:5273/api/Cliente/${currentClient.Id}`
            : 'https://localhost:5273/api/Cliente';

        // Prepara o DTO adequado para cada operação
        const clienteDTO = currentClient
            ? {
                id: currentClient.Id,
                nomeCompleto: form.NomeCompleto,
                email: form.Email,
                telefone: form.Telefone,
                dataNascimento: form.DataNascimento || null,
                observacoes: form.Observacoes
            }
            : {
                nomeCompleto: form.NomeCompleto,
                email: form.Email,
                telefone: form.Telefone,
                dataNascimento: form.DataNascimento || null,
                observacoes: form.Observacoes
            };

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(clienteDTO)
            });

            if (response.ok) {
                const fetchClients = async () => {
                    const res = await fetch('https://localhost:5273/api/Cliente', {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (res.ok) setClients(await res.json());
                };
                fetchClients();
                setShowModal(false);
            } else {
                let errorMsg = '';
                try {
                    errorMsg = await response.text();
                    try {
                        const errorJson = JSON.parse(errorMsg);
                        errorMsg = errorJson?.title || JSON.stringify(errorJson);
                    } catch {
                        // Se não for JSON, mantém como texto
                    }
                } catch {
                    errorMsg = 'Erro desconhecido';
                }
                alert('Erro ao salvar cliente: ' + errorMsg);
            }
        } catch (err) {
            alert('Erro inesperado: ' + err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredClients = clients.filter(client =>
        (client.NomeCompleto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.Email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.Telefone || '').includes(searchTerm)
    );
    
    const clientsWithObservations = filteredClients.filter(client => client.Observacoes && client.Observacoes.trim() !== '');

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
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((client, idx) => (
                            <tr key={client.Id ?? idx}>
                                <td>{client.NomeCompleto}</td>
                                <td>{client.Email}</td>
                                <td>{client.Telefone}</td>
                                <td>{client.DataNascimento ? new Date(client.DataNascimento).toLocaleDateString('pt-BR') : ''}</td>
                                <td>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleEdit(client)}
                                    >
                                        <i className="fas fa-edit me-2"></i> Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm ms-2"
                                        onClick={() => handleDelete(client.Id)}
                                    >
                                        <i className="fas fa-trash me-2"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Nova tabela de Observações dos Clientes */}
            <div className="card" style={{ marginTop: '32px' }}>
                <div className="page-header">
                    <h3>Observações dos Clientes</h3>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nome do Cliente</th>
                            <th>Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientsWithObservations.length > 0 ? (
                            clientsWithObservations.map((client, idx) => (
                                <tr key={client.Id ?? idx}>
                                    <td>{client.NomeCompleto}</td>
                                    <td>{client.Observacoes}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" style={{ textAlign: 'center' }}>Nenhum cliente com observação encontrado.</td>
                            </tr>
                        )}
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
                                        name="NomeCompleto"
                                        value={form.NomeCompleto}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>E-mail</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="Email"
                                            value={form.Email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label>Telefone</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="Telefone"
                                            value={form.Telefone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Data de Nascimento</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="DataNascimento"
                                        value={form.DataNascimento}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Observações</label>
                                    <textarea
                                        className="form-control"
                                        name="Observacoes"
                                        value={form.Observacoes}
                                        onChange={handleChange}
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