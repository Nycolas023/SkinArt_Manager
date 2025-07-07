import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import './Inventory.css';

function Inventory() {
  const [inventory, setInventory] = useState([
    // Equipamentos Principais
    { id: 1, category: 'Equipamentos', name: 'Máq de Tatuagem (Coil)', quantity: 2, minStock: 1, unit: 'un', usagePerSession: 0 },
    { id: 2, category: 'Equipamentos', name: 'Máq de Tatuagem (Rot)', quantity: 2, minStock: 1, unit: 'un', usagePerSession: 0 },
    { id: 3, category: 'Equipamentos', name: 'Fonte de Alimentação', quantity: 2, minStock: 1, unit: 'un', usagePerSession: 0 },
    { id: 4, category: 'Equipamentos', name: 'Pedal', quantity: 2, minStock: 1, unit: 'un', usagePerSession: 0 },
    { id: 5, category: 'Equipamentos', name: 'Cabos de Conexão', quantity: 4, minStock: 2, unit: 'un', usagePerSession: 0 },

    // Agulhas (Liners e Shaders)
    { id: 6, category: 'Agulhas', name: 'Agulha Round Liner #3', quantity: 20, minStock: 10, unit: 'un', usagePerSession: 1 },
    { id: 7, category: 'Agulhas', name: 'Agulha Round Liner #5', quantity: 20, minStock: 10, unit: 'un', usagePerSession: 1 },
    { id: 8, category: 'Agulhas', name: 'Agulha Round Liner #7', quantity: 15, minStock: 8, unit: 'un', usagePerSession: 1 },
    { id: 9, category: 'Agulhas', name: 'Agulha Round Shader #7', quantity: 15, minStock: 8, unit: 'un', usagePerSession: 1 },
    { id: 10, category: 'Agulhas', name: 'Agulha Magnum #9', quantity: 15, minStock: 8, unit: 'un', usagePerSession: 1 },
    { id: 11, category: 'Agulhas', name: 'Agulha Curved Magnum #11', quantity: 10, minStock: 5, unit: 'un', usagePerSession: 1 },

    // Hastes e Acessórios
    { id: 12, category: 'Acessórios', name: 'Hastes (Grips) Descartáveis', quantity: 50, minStock: 30, unit: 'un', usagePerSession: 1 },
    { id: 13, category: 'Acessórios', name: 'Tubos (Tips) Descartáveis', quantity: 50, minStock: 30, unit: 'un', usagePerSession: 1 },

    // Tintas (Cores Básicas)
    { id: 14, category: 'Tintas', name: 'Tinta Preta', quantity: 500, minStock: 100, unit: 'ml', usagePerSession: 5 },
    { id: 15, category: 'Tintas', name: 'Tinta Branca', quantity: 500, minStock: 100, unit: 'ml', usagePerSession: 5 },
    { id: 16, category: 'Tintas', name: 'Tinta Vermelha', quantity: 500, minStock: 100, unit: 'ml', usagePerSession: 5 },
    { id: 17, category: 'Tintas', name: 'Tinta Azul', quantity: 500, minStock: 100, unit: 'ml', usagePerSession: 5 },
    { id: 18, category: 'Tintas', name: 'Tinta Amarela', quantity: 500, minStock: 100, unit: 'ml', usagePerSession: 5 },
    { id: 19, category: 'Tintas', name: 'Tinta Verde', quantity: 500, minStock: 100, unit: 'ml', usagePerSession: 5 },

    // Materiais Descartáveis
    { id: 20, category: 'Descartáveis', name: 'Luvas de Nitrila (P)', quantity: 100, minStock: 50, unit: 'par', usagePerSession: 1 },
    { id: 21, category: 'Descartáveis', name: 'Luvas de Nitrila (M)', quantity: 100, minStock: 50, unit: 'par', usagePerSession: 1 },
    { id: 22, category: 'Descartáveis', name: 'Campos Descartáveis', quantity: 50, minStock: 30, unit: 'un', usagePerSession: 2 },
    { id: 23, category: 'Descartáveis', name: 'Vasilhas de Tinta (Cups)', quantity: 100, minStock: 50, unit: 'un', usagePerSession: 3 },
    { id: 24, category: 'Descartáveis', name: 'Lâminas de Barbear', quantity: 50, minStock: 30, unit: 'un', usagePerSession: 1 },

    // Preparação da Pele
    { id: 25, category: 'Preparação', name: 'Clorexidina 2%', quantity: 3000, minStock: 500, unit: 'ml', usagePerSession: 10 },
    { id: 26, category: 'Preparação', name: 'Gel de Barbear', quantity: 1000, minStock: 200, unit: 'ml', usagePerSession: 15 },
    { id: 27, category: 'Preparação', name: 'Stencil Transfer', quantity: 150, minStock: 50, unit: 'folhas', usagePerSession: 1 },
    { id: 28, category: 'Preparação', name: 'Papel Toalha', quantity: 1.5, minStock: 2, unit: 'rolo', usagePerSession: 0.1 },

    // Pós-Tatuagem
    { id: 29, category: 'Pós-Tatuagem', name: 'Filme Transparente (Rolo)', quantity: 5, minStock: 2, unit: 'rolo', usagePerSession: 0.03 },
    { id: 30, category: 'Pós-Tatuagem', name: 'Bepantol Derma', quantity: 5, minStock: 2, unit: 'g', usagePerSession: 5 },

    // Limpeza
    { id: 31, category: 'Limpeza', name: 'Álcool 70% (500ml)', quantity: 5000, minStock: 1000, unit: 'ml', usagePerSession: 50 },
    { id: 32, category: 'Limpeza', name: 'Desinfetante Hospitalar', quantity: 3000, minStock: 500, unit: 'ml', usagePerSession: 100 },
    { id: 33, category: 'Limpeza', name: 'Sacos para Lixo Infectante', quantity: 50, minStock: 10, unit: 'un', usagePerSession: 1 }
  ]);

  const [showLowStock, setShowLowStock] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    minStock: 0,
    unit: 'un',
    usagePerSession: 0
  });

  // Extrai categorias únicas dos itens
  const categories = ['Todos', ...new Set(inventory.map(item => item.category))];

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesStock = !showLowStock || item.quantity <= item.minStock;
    return matchesCategory && matchesStock;
  });

  // Calcula sessões restantes baseado no estoque
  const calculateSessionsLeft = (item) => {
    if (item.usagePerSession <= 0) return 'N/A';
    return Math.floor(item.quantity / item.usagePerSession);
  };

  // Função para abrir o modal de edição
  const handleEdit = (id) => {
    const itemToEdit = inventory.find(item => item.id === id);
    setEditingItem(itemToEdit);
    setFormData({
      name: itemToEdit.name,
      category: itemToEdit.category,
      quantity: itemToEdit.quantity,
      minStock: itemToEdit.minStock,
      unit: itemToEdit.unit,
      usagePerSession: itemToEdit.usagePerSession
    });
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setEditingItem(null);
  };

  // Função para atualizar os dados do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'minStock' || name === 'usagePerSession' 
        ? Number(value) 
        : value
    });
  };

  // Função para salvar as alterações
  const handleSave = (e) => {
    e.preventDefault();
    const updatedInventory = inventory.map(item => 
      item.id === editingItem.id ? { ...item, ...formData } : item
    );
    setInventory(updatedInventory);
    handleCloseModal();
  };

  // Função para deletar item
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja remover este item permanentemente?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Controle de Estoque</h2>
        <div className="inventory-controls">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
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

      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Item</th>
              <th>Quantidade</th>
              <th>Unidade</th>
              <th>Uso/Sessão</th>
              <th>Sessões Restantes</th>
              <th>Estoque Mínimo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id} className={item.quantity <= item.minStock ? 'low-stock' : ''}>
                <td>{item.category}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.usagePerSession > 0 ? `${item.usagePerSession} ${item.unit}` : 'N/A'}</td>
                <td>{calculateSessionsLeft(item)}</td>
                <td>{item.minStock}</td>
                <td>
                  {item.quantity <= item.minStock 
                    ? <span className="badge-warning">Repor</span>
                    : <span className="badge-success">OK</span>}
                </td>
                <td className="actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(item.id)}
                    title="Editar item"
                  >
                    <FiEdit className="icon" />
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}
                    title="Remover item"
                  >
                    <FiTrash2 className="icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Editar Item</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.filter(cat => cat !== 'Todos').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantidade:</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unidade:</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="un">Unidade</option>
                    <option value="ml">Mililitro (ml)</option>
                    <option value="g">Grama (g)</option>
                    <option value="par">Par</option>
                    <option value="folhas">Folhas</option>
                    <option value="rolo">Rolo</option>
                    <option value="m">Metro (m)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estoque Mínimo:</label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Uso por Sessão:</label>
                  <input
                    type="number"
                    name="usagePerSession"
                    value={formData.usagePerSession}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiSave className="icon" /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;