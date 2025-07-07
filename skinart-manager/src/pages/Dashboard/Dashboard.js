import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
    const { user } = useAuth();
    const [agendamentos, setAgendamentos] = useState([]);
    const [obsModal, setObsModal] = useState({ open: false, texto: '' });
    const [agendamentosHoje, setAgendamentosHoje] = useState(0);
    const [clientesCount, setClientesCount] = useState(0);
    const [usuariosAtivosCount, setUsuariosAtivosCount] = useState(0);
    const [ordensServico, setOrdensServico] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAgendamentos() {
            try {
                const response = await fetch('https://localhost:5000/api/Agendamento', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const agora = new Date();
                    const agendamentosFuturos = data.filter(ag =>
                        (new Date(ag.dataHoraInicio || ag.DataHoraInicio) > agora) &&
                        ((ag.NomeStatus || ag.nomeStatus || '').toLowerCase() === 'confirmado')
                    );
                    setAgendamentos(agendamentosFuturos);

                    const hoje = new Date();
                    const agsHoje = data.filter(ag => {
                        const inicio = new Date(ag.DataHoraInicio || ag.dataHoraInicio);
                        return (
                            inicio.getDate() === hoje.getDate() &&
                            inicio.getMonth() === hoje.getMonth() &&
                            inicio.getFullYear() === hoje.getFullYear()
                        );
                    });
                    setAgendamentosHoje(agsHoje.length);
                }
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        }

        async function fetchClientes() {
            try {
                const response = await fetch('https://localhost:5000/api/Cliente', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setClientesCount(data.length);
                }
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        }

        async function fetchUsuarios() {
            try {
                const response = await fetch('https://localhost:5000/api/Usuario/RetornaTodosUsuarios', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const ativos = data.filter(u => (u.STATUS_USUARIO || '').toLowerCase() === 'ativo');
                    setUsuariosAtivosCount(ativos.length);
                }
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        }

        async function fetchOrdensServico() {
            try {
                const response = await fetch('https://localhost:5000/api/OrdemServico/ListaOrdemServico', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const ultimas = data
                        .sort((a, b) => new Date(b.DATA_CRIACAO) - new Date(a.DATA_CRIACAO))
                        .slice(0, 5);
                    setOrdensServico(ultimas);
                }
            } catch (error) {
                console.error('Erro ao buscar ordens de serviço:', error);
            }
        }

        fetchAgendamentos();
        fetchClientes();
        fetchUsuarios();
        fetchOrdensServico();
    }, []);

    const abrirModalObs = (obs) => {
        setObsModal({ open: true, texto: obs || 'Sem observações.' });
    };

    const fecharModalObs = () => {
        setObsModal({ open: false, texto: '' });
    };

    const irParaAgendamentosHoje = () => {
        navigate('/agendamentos?view=day');
    };

    return (
        <div className="dashboard-container">
            <h1>Olá, {user?.name || user?.nome || "Usuário"}!</h1>
            <p>Sua função: {user?.role || user?.papel || "Padrão"}</p>

            <div className="dashboard">
                <h3 className="page-title">Dashboard</h3>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon bg-primary">
                            <i className="fas fa-calendar"></i>
                        </div>
                        <div className="stat-info">
                            <h4>{agendamentosHoje}</h4>
                            <p>Agendamento(s) hoje</p>
                            <button className="btn btn-primary btn-sm" onClick={irParaAgendamentosHoje}>
                                Ver agenda do dia
                            </button>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon bg-success">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-info">
                            <h4>
                                {clientesCount} Cliente(s) Cadastrado(s)<br />
                                {usuariosAtivosCount} Usuário(s) Ativo(s)
                            </h4>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon bg-warning">
                            <i className="fas fa-dollar-sign"></i>
                        </div>
                        <div className="stat-info">
                            <h4>R$ 8.450</h4>
                            <p>Faturamento Mês</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon bg-danger">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="stat-info">
                            <h4>3</h4>
                            <p>Itens em Falta</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content">
                    <div className="card upcoming-appointments">
                        <h4>Próximos Agendamentos</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Tatuador</th>
                                    <th>Horário</th>
                                    <th>Tipo</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {agendamentos.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">Nenhum agendamento encontrado.</td>
                                    </tr>
                                ) : (
                                    agendamentos.map((ag, idx) => {
                                        const inicio = new Date(ag.DataHoraInicio || ag.dataHoraInicio);
                                        const fim = new Date(ag.DataHoraFim || ag.dataHoraFim);
                                        const hoje = new Date();
                                        const isHoje =
                                            inicio.getDate() === hoje.getDate() &&
                                            inicio.getMonth() === hoje.getMonth() &&
                                            inicio.getFullYear() === hoje.getFullYear();

                                        let horario;
                                        if (isHoje) {
                                            horario = `${inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${fim.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                        } else {
                                            horario = `${inicio.toLocaleDateString('pt-BR')}, ${inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                        }

                                        return (
                                            <tr key={ag.id || idx}>
                                                <td>{ag.NomeCliente || ag.nomeCliente}</td>
                                                <td>{ag.NomeTatuador || ag.nomeTatuador}</td>
                                                <td>{ag.DataHoraInicio || ag.dataHoraInicio ? horario : '-'}</td>
                                                <td>{ag.TipoTatuagem || ag.tipoTatuagem}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => abrirModalObs(ag.Observacoes || ag.observacoes)}
                                                    >
                                                        Detalhes
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="card recent-orders">
                        <h4>Últimas Ordens de Serviço</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nº OS</th>
                                    <th>Cliente</th>
                                    <th>Valor</th>
                                    <th>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordensServico.length === 0 ? (
                                    <tr>
                                        <td colSpan="4">Nenhuma ordem de serviço encontrada.</td>
                                    </tr>
                                ) : (
                                    ordensServico.map(os => (
                                        <tr key={os.ID_ORDEM_SERVICO}>
                                            <td>#{os.ID_ORDEM_SERVICO}</td>
                                            <td>{os.CLIENTE}</td>
                                            <td>R$ {Number(os.VALOR).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                            <td>{new Date(os.DATA_CRIACAO).toLocaleDateString('pt-BR')}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {obsModal.open && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h4>Observações do Agendamento</h4>
                            <button className="close-btn" onClick={fecharModalObs}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ whiteSpace: 'pre-line' }}>{obsModal.texto}</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={fecharModalObs}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;