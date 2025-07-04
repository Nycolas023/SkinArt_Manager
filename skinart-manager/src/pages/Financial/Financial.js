import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Financial.css';

// Registra todos os componentes do Chart.js
Chart.register(...registerables);

function Financial({ userRole }) {
  const [financialData, setFinancialData] = useState({
    revenue: 0,
    profit: 0,
    commissions: 0,
    expenses: 0,
    transactions: []
  });
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [monthLabels, setMonthLabels] = useState([]);

  // Valores estáticos para despesas (pode ser dinâmico futuramente)
  const staticExpenses = 3000;

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const response = await fetch('https://localhost:5000/api/OrdemServico/ListaOrdemServico', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const now = new Date();
          const month = now.getMonth();
          const year = now.getFullYear();

          // Gera os próximos 6 meses a partir do mês atual
          const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
          ];
          const labels = [];
          for (let i = 0; i < 6; i++) {
            labels.push(meses[(month + i) % 12]);
          }
          setMonthLabels(labels);
          setCurrentMonth(meses[month]);
          setCurrentYear(year);

          // Filtra ordens do mês/ano atual
          const ordensMes = data.filter(o => {
            const dataCriacao = new Date(o.DATA_CRIACAO);
            return (
              dataCriacao.getMonth() === month &&
              dataCriacao.getFullYear() === year
            );
          });

          // Soma os valores e comissões
          const receitaMes = ordensMes.reduce((acc, o) => acc + Number(o.VALOR), 0);
          const comissoesMes = ordensMes.reduce((acc, o) => acc + Number(o.COMISSAO || 0), 0);
          const lucroMes = receitaMes - comissoesMes;

          setFinancialData(prev => ({
            ...prev,
            revenue: receitaMes,
            commissions: comissoesMes,
            profit: lucroMes,
            expenses: staticExpenses // valor estático
          }));
        }
      } catch (err) {
        setFinancialData(prev => ({ ...prev, revenue: 0, commissions: 0, profit: 0, expenses: staticExpenses }));
      }
    };

    fetchFinancials();
  }, []);   

  // Gráfico: só o mês atual recebe valores, os próximos meses ficam zerados
  const now = new Date();
  const currentMonthIndex = 0; // sempre o primeiro label é o mês atual
  const receitaArray = Array(6).fill(0);
  const despesasArray = Array(6).fill(0);
  receitaArray[currentMonthIndex] = financialData.revenue;
  despesasArray[currentMonthIndex] = financialData.expenses;

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Receita',
        data: receitaArray,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Despesas',
        data: despesasArray,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Desempenho Financeiro ${currentYear}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 30000,
        ticks: {
          stepSize: 5000,
          callback: function(value) {
            return 'R$ ' + value.toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  // Simula carregamento de dados
  useEffect(() => {
    const loadData = () => {
      setFinancialData(prev => ({
        ...prev,
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
      }));
    };
    loadData();
  }, []);

  return (
    <div className="financial">
      <h3>Gestão Financeira</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Receita Total ({currentMonth}):</h4>
          <p>R$ {financialData.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="stat-card">
          <h4>Lucro ({currentMonth}):</h4>
          <p>R$ {financialData.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="stat-card">
          <h4>Comissões ({currentMonth}):</h4>
          <p>R$ {financialData.commissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="stat-card">
          <h4>Despesas ({currentMonth}):</h4>
          <p>R$ {staticExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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