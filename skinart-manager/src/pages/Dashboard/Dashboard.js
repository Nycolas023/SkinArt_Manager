import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';


function Dashboard() {
  const { user } = useAuth();

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
              <h4>25</h4>
              <p>Agendamentos Hoje</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon bg-success">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h4>142</h4>
              <p>Clientes Ativos</p>
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
                <tr>
                  <td>João Silva</td>
                  <td>Maria Souza</td>
                  <td>14:00 - 16:00</td>
                  <td>Braço</td>
                  <td>
                    <button className="btn btn-secondary btn-sm">Detalhes</button>
                  </td>
                </tr>
                <tr>
                  <td>Ana Oliveira</td>
                  <td>Carlos Lima</td>
                  <td>16:30 - 18:30</td>
                  <td>Costas</td>
                  <td>
                    <button className="btn btn-secondary btn-sm">Detalhes</button>
                  </td>
                </tr>
                <tr>
                  <td>Pedro Santos</td>
                  <td>Maria Souza</td>
                  <td>19:00 - 21:00</td>
                  <td>Perna</td>
                  <td>
                    <button className="btn btn-secondary btn-sm">Detalhes</button>
                  </td>
                </tr>
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
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#1245</td>
                  <td>João Silva</td>
                  <td>R$ 800,00</td>
                  <td><span className="badge-success">Pago</span></td>
                  <td>10/05/2023</td>
                </tr>
                <tr>
                  <td>#1244</td>
                  <td>Ana Oliveira</td>
                  <td>R$ 1.200,00</td>
                  <td><span className="badge-warning">Parcial</span></td>
                  <td>09/05/2023</td>
                </tr>
                <tr>
                  <td>#1243</td>
                  <td>Pedro Santos</td>
                  <td>R$ 600,00</td>
                  <td><span className="badge-danger">Pendente</span></td>
                  <td>08/05/2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;