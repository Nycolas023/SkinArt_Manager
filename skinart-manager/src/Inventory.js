import React, { useState } from 'react';
import './Inventory.css';

function Inventory() {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Tinta Preta', quantity: 2, minStock: 3 },
    { id: 2, name: 'Agulhas #12', quantity: 20, minStock: 10 },
    { id: 3, name: 'Luvas Desc.', quantity: 8, minStock: 5 }
  ]);

  const [showLowStock, setShowLowStock] = useState(false);

  const filteredInventory = showLowStock
    ? inventory.filter(item => item.quantity <= item.minStock)
    : inventory;

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Controle de Estoque</h2>
        <div className="inventory-controls">
          <button 
            className={`btn ${showLowStock ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowLowStock(!showLowStock)}
          >
            {showLowStock ? 'Mostrar Todos' : 'Mostrar Baixo Estoque'}
          </button>
          <button className="btn btn-success">
            + Adicionar Item
          </button>
        </div>
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantidade</th>
            <th>Estoque Mínimo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map(item => (
            <tr key={item.id} className={item.quantity <= item.minStock ? 'low-stock' : ''}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.minStock}</td>
              <td>
                {item.quantity <= item.minStock 
                  ? <span className="badge-warning">Repor</span>
                  : <span className="badge-success">OK</span>}
              </td>
              <td>
                <button className="btn-edit">Editar</button>
                <button className="btn-delete">Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;