import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Scheduling.css';

// Configuração do calendário
const localizer = momentLocalizer(moment);
moment.locale('pt-BR');

function Scheduling({ userRole }) {
  // Estado inicial com agendamentos de exemplo
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'João Silva - Braço',
      start: new Date(2023, 4, 15, 14, 0),
      end: new Date(2023, 4, 15, 16, 0),
      client: { id: 1, name: 'João Silva', phone: '(11) 9999-9999' },
      artist: { id: 1, name: 'Maria Souza' },
      type: 'Braço',
      notes: 'Finalizar tatuagem do dragão',
      status: 'confirmed',
      value: 800.00
    },
    {
      id: 2,
      title: 'Ana Oliveira - Costas',
      start: new Date(2023, 4, 15, 16, 30),
      end: new Date(2023, 4, 15, 18, 30),
      client: { id: 2, name: 'Ana Oliveira', phone: '(11) 8888-8888' },
      artist: { id: 2, name: 'Carlos Lima' },
      type: 'Costas',
      notes: 'Primeira sessão',
      status: 'confirmed',
      value: 1200.00
    },
    {
      id: 3,
      title: 'Pedro Santos - Perna',
      start: new Date(2023, 4, 15, 19, 0),
      end: new Date(2023, 4, 15, 21, 0),
      client: { id: 3, name: 'Pedro Santos', phone: '(11) 7777-7777' },
      artist: { id: 1, name: 'Maria Souza' },
      type: 'Perna',
      notes: 'Tatuagem tribal',
      status: 'pending',
      value: 600.00
    }
  ]);

  const [clients] = useState([
    { id: 1, name: 'João Silva', phone: '(11) 9999-9999' },
    { id: 2, name: 'Ana Oliveira', phone: '(11) 8888-8888' },
    { id: 3, name: 'Pedro Santos', phone: '(11) 7777-7777' }
  ]);

  const [artists] = useState([
    { id: 1, name: 'Maria Souza', specialization: 'Tribal, Realismo' },
    { id: 2, name: 'Carlos Lima', specialization: 'Old School, Pontilhismo' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [view, setView] = useState('week');
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filtra eventos por tatuador e status
  const filteredEvents = events.filter(event => {
    const artistMatch = selectedArtist === 'all' || event.artist.id.toString() === selectedArtist;
    const statusMatch = selectedStatus === 'all' || event.status === selectedStatus;
    return artistMatch && statusMatch;
  });

  // Cores diferentes para diferentes status
  const eventStyleGetter = (event) => {
    let backgroundColor = '';
    if (event.status === 'confirmed') backgroundColor = '#28a745';
    if (event.status === 'pending') backgroundColor = '#ffc107';
    if (event.status === 'canceled') backgroundColor = '#dc3545';
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleSelectEvent = (event) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleSelectSlot = (slotInfo) => {
    const newEvent = {
      id: null,
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      client: null,
      artist: null,
      type: '',
      notes: '',
      status: 'pending',
      value: 0
    };
    setCurrentEvent(newEvent);
    setShowModal(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const updatedEvent = {
  id: currentEvent.id || Math.max(...events.map(e => e.id), 0) + 1,
  title: `${formData.get('client')} - ${formData.get('type')}`,
  start: new Date(formData.get('start-date')),
  end: new Date(formData.get('end-date')),
  client: clients.find(c => c.id === parseInt(formData.get('client'))) || null,
  artist: artists.find(a => a.id === parseInt(formData.get('artist'))) || null,
  type: formData.get('type'),
  notes: formData.get('notes'),
  status: formData.get('status'),
  value: parseFloat(formData.get('value'))
};

    if (currentEvent.id) {
      // Atualizar evento existente
      setEvents(events.map(event => 
        event.id === currentEvent.id ? updatedEvent : event
      ));
    } else {
      // Adicionar novo evento
      setEvents([...events, updatedEvent]);
    }

    setShowModal(false);
  };

  const handleDeleteEvent = () => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      setEvents(events.map(event => 
        event.id === currentEvent.id ? { ...event, status: 'canceled' } : event
      ));
      setShowModal(false);
    }
  };

  const handleSendReminder = () => {
    alert(`Lembrete enviado para ${currentEvent.client.name} (${currentEvent.client.phone})`);
  };

  return (
    <div className="scheduling">
      <div className="page-header">
        <h3>Agendamentos</h3>
        
        <div className="controls">
          <div className="filters">
            <select
              className="form-control"
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
            >
              <option value="all">Todos Tatuadores</option>
              {artists.map(artist => (
                <option key={artist.id} value={artist.id}>{artist.name}</option>
              ))}
            </select>
            
            <select
              className="form-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos Status</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendentes</option>
              <option value="canceled">Cancelados</option>
            </select>
          </div>
          
          <div className="view-options">
            <button 
              className={`btn ${view === 'day' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('day')}
            >
              Dia
            </button>
            <button 
              className={`btn ${view === 'week' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('week')}
            >
              Semana
            </button>
            <button 
              className={`btn ${view === 'month' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('month')}
            >
              Mês
            </button>
          </div>
        </div>
      </div>
      
      <div className="card calendar-container">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={userRole !== 'tatuador'}
          defaultView={view}
          views={['day', 'week', 'month']}
          eventPropGetter={eventStyleGetter}
          messages={{
            today: 'Hoje',
            previous: 'Anterior',
            next: 'Próximo',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            agenda: 'Agenda',
            date: 'Data',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'Nenhum agendamento neste período.'
          }}
          min={new Date(0, 0, 0, 9, 0, 0)}  // Início às 9h
          max={new Date(0, 0, 0, 22, 0, 0)}  // Fim às 22h
        />
      </div>
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>{currentEvent.id ? 'Editar Agendamento' : 'Novo Agendamento'}</h4>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSaveEvent}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Cliente *</label>
                    <select 
                      name="client"
                      className="form-control" 
                      required
                      defaultValue={currentEvent.client?.id || ''}
                    >
                      <option value="">Selecione um cliente</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name} - {client.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group col-md-6">
                    <label>Tatuador *</label>
                    <select 
                      name="artist"
                      className="form-control" 
                      required
                      defaultValue={currentEvent.artist?.id || ''}
                    >
                      <option value="">Selecione um tatuador</option>
                      {artists.map(artist => (
                        <option key={artist.id} value={artist.id}>
                          {artist.name} ({artist.specialization})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label>Data Início *</label>
                    <input
                      type="datetime-local"
                      name="start-date"
                      className="form-control"
                      required
                      defaultValue={moment(currentEvent.start).format('YYYY-MM-DDTHH:mm')}
                    />
                  </div>
                  
                  <div className="form-group col-md-4">
                    <label>Data Fim *</label>
                    <input
                      type="datetime-local"
                      name="end-date"
                      className="form-control"
                      required
                      defaultValue={moment(currentEvent.end).format('YYYY-MM-DDTHH:mm')}
                    />
                  </div>
                  
                  <div className="form-group col-md-4">
                    <label>Status *</label>
                    <select
                      name="status"
                      className="form-control"
                      defaultValue={currentEvent.status || 'pending'}
                    >
                      <option value="confirmed">Confirmado</option>
                      <option value="pending">Pendente</option>
                      {currentEvent.id && <option value="canceled">Cancelado</option>}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Tipo de Tatuagem *</label>
                    <input
                      type="text"
                      name="type"
                      className="form-control"
                      required
                      defaultValue={currentEvent.type || ''}
                      placeholder="Ex: Braço, Costas, Perna"
                    />
                  </div>
                  
                  <div className="form-group col-md-6">
                    <label>Valor (R$) *</label>
                    <input
                      type="number"
                      name="value"
                      className="form-control"
                      step="0.01"
                      required
                      defaultValue={currentEvent.value || ''}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Observações</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    rows="3"
                    defaultValue={currentEvent.notes || ''}
                  ></textarea>
                </div>
              </div>
              
              <div className="modal-footer">
                <div className="left-actions">
                  {currentEvent.id && currentEvent.status !== 'canceled' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={handleSendReminder}
                      >
                        <i className="fas fa-bell"></i> Enviar Lembrete
                      </button>
                      
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDeleteEvent}
                      >
                        <i className="fas fa-times"></i> Cancelar Agendamento
                      </button>
                    </>
                  )}
                </div>
                
                <div className="right-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Fechar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Salvar Agendamento
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scheduling;