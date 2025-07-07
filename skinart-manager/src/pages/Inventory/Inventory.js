import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiX, FiSave, FiPlus } from 'react-icons/fi';
import './Inventory.css';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    minStock: 0,
    unit: 'un',
    usagePerSession: 0
  });

  // Buscar estoque e categorias ao carregar
  useEffect(() => {
    fetch('/api/estoque')
      .then(res => res.json())
      .then(data => setInventory(
        data.map(item => ({
          id: item.Id ?? item.id,
          name: item.NomeItem ?? item.nomeItem ?? item.name,
          category: item.Categoria ?? item.categoria ?? item.category,
          quantity: item.Quantidade ?? item.quantidade ?? item.quantity,
          minStock: item.EstoqueMinimo ?? item.estoqueMinimo ?? item.minStock,
          unit: item.Unidade ?? item.unidade ?? item.unit,
          usagePerSession: item.UsoPorSessao ?? item.usoPorSessao ?? item.usagePerSession
        }))
      ))
      .catch(() => setInventory([]));

    fetch('/api/estoque/categorias')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // Atualiza lista de estoque após adicionar item
  const refreshInventory = () => {
    fetch('/api/estoque')
      .then(res => res.json())
      .then(data => setInventory(
        data.map(item => ({
          id: item.Id ?? item.id,
          name: item.NomeItem ?? item.nomeItem ?? item.name,
          category: item.Categoria ?? item.categoria ?? item.category,
          quantity: item.Quantidade ?? item.quantidade ?? item.quantity,
          minStock: item.EstoqueMinimo ?? item.estoqueMinimo ?? item.minStock,
          unit: item.Unidade ?? item.unidade ?? item.unit,
          usagePerSession: item.UsoPorSessao ?? item.usoPorSessao ?? item.usagePerSession
        }))
      ));
    fetch('/api/estoque/categorias')
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  const filteredInventory = inventory.filter(item => {
    // Filtro por categoria
    const categoryMatch = selectedCategory === 'Todos' || item.category === selectedCategory;
    // Filtro por baixo estoque
    const lowStockMatch = !showLowStock || item.quantity <= item.minStock;
    return categoryMatch && lowStockMatch;
  });

  const calculateSessionsLeft = (item) => {
    if (item.usagePerSession <= 0) return 'N/A';
    return Math.floor(item.quantity / item.usagePerSession);
  };

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

  const handleCloseModal = () => {
    setEditingItem(null);
    setShowAddModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'minStock' || name === 'usagePerSession'
        ? Number(value)
        : value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const dto = {
        Id: editingItem.id,
        Categoria: formData.category,
        NomeItem: formData.name,
        Quantidade: formData.quantity,
        Unidade: formData.unit,
        UsoPorSessao: formData.usagePerSession,
        EstoqueMinimo: formData.minStock
      };
      const response = await fetch(`/api/estoque/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(dto)
      });
      if (response.ok) {
        refreshInventory();
        handleCloseModal();
      } else {
        const error = await response.text();
        alert('Erro ao salvar item: ' + error);
      }
    } catch (err) {
      alert('Erro ao salvar item.');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const dto = {
      Categoria: formData.category,
      NomeItem: formData.name,
      Quantidade: formData.quantity,
      Unidade: formData.unit,
      UsoPorSessao: formData.usagePerSession,
      EstoqueMinimo: formData.minStock
    };
    try {
      const response = await fetch('/api/estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(dto)
      });
      if (response.ok) {
        refreshInventory();
        handleCloseModal();
      } else {
        const error = await response.text();
        alert('Erro ao adicionar item: ' + error);
      }
    } catch (err) {
      alert('Erro ao adicionar item.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este item permanentemente?')) {
      try {
        const response = await fetch(`/api/estoque/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        if (response.ok) {
          refreshInventory();
        }
      } catch (err) {
        alert('Erro ao remover item.');
      }
    }
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      minStock: 0,
      unit: 'un',
      usagePerSession: 0
    });
    setShowAddModal(true);
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
            <option value="Todos">Todos</option>
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

          <button className="btn btn-success" onClick={openAddModal}>
            <FiPlus className="icon" /> + Adicionar Item
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
                <input
                  type="text"
                  name="category"
                  list="category-list"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
                <datalist id="category-list">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
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

      {/* Modal de Adição */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Novo Item de Estoque</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleAdd}>
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
                <input
                  type="text"
                  name="category"
                  list="category-list"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
                <datalist id="category-list">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
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
                  <FiSave className="icon" /> Adicionar
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