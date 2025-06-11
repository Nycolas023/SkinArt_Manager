import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Financial.css';

// Registra todos os componentes do Chart.js
Chart.register(...registerables);

function Financial({ userRole }) {
  const [timeRange, setTimeRange] = useState('month');
  const [financialData, setFinancialData] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    commissions: 0,
    transactions: []
  });

  // Dados fictícios para o gráfico
  const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receita',
        data: [8500, 9200, 10200, 11000, 12500, 9500],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Despesas',
        data: [3200, 3800, 4200, 3900, 4200, 3500],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Desempenho Financeiro'
      }
    }
  };

  // Simula carregamento de dados
  useEffect(() => {
    const loadData = () => {
      setFinancialData({
        revenue: 12500,
        expenses: 4200,
        profit: 8300,
        commissions: 3750,
        transactions: [
          {
            id: 1,
            date: '15/05/2023',
            description: 'Pagamento - OS #1245',
            amount: 800.00,
            type: 'income'
          },
          {
            id: 2,
            date: '14/05/2023',
            description: 'Comissão - Maria Souza',
            amount: -320.00,
            type: 'expense'
          }
        ]
      });
    };
    
    loadData();
  }, [timeRange]);

  return (
    <div className="financial">
      <h3>Gestão Financeira</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Receita Total</h4>
          <p>R$ {financialData.revenue.toFixed(2)}</p>
        </div>
        
        <div className="stat-card">
          <h4>Despesas</h4>
          <p>R$ {financialData.expenses.toFixed(2)}</p>
        </div>
        
        <div className="stat-card">
          <h4>Lucro</h4>
          <p>R$ {financialData.profit.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="transactions">
        <h4>Últimas Transações</h4>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {financialData.transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.description}</td>
                <td className={tx.type === 'income' ? 'positive' : 'negative'}>
                  {tx.type === 'income' ? '+' : '-'} R$ {Math.abs(tx.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Financial;