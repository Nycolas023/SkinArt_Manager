import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Scheduling.css';
import axios from 'axios';

// Configuração do axios com interceptor para autenticação
axios.defaults.baseURL = 'https://localhost:5000';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Configuração do calendário
const localizer = momentLocalizer(moment);
moment.locale('pt-BR');

function Scheduling({ userRole }) {
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [artists, setArtists] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [view, setView] = useState('week');
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [date, setDate] = useState(new Date());

  const calendarRef = useRef();

  useEffect(() => {
    loadSchedules();
    loadClients();
    loadArtists();

    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'day' || viewParam === 'week' || viewParam === 'month') {
      setView(viewParam);
      if (viewParam === 'day') setDate(new Date());
    }
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await axios.get('/api/Agendamento');
      const formattedEvents = response.data.map(item => ({
        id: item.Id,
        title: `${item.NomeCliente} - ${item.TipoTatuagem}`,
        start: new Date(item.DataHoraInicio),
        end: new Date(item.DataHoraFim),
        client: {
          id: item.IdCliente,
          name: item.NomeCliente
        },
        artist: {
          id: item.IdTatuador,
          name: item.NomeTatuador
        },
        type: item.TipoTatuagem,
        notes: item.Observacoes,
        status:
          item.NomeStatus?.toLowerCase() === 'confirmado'
            ? 'confirmed'
            : item.NomeStatus?.toLowerCase() === 'pendente'
            ? 'pending'
            : 'canceled',
        value: item.Valor
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await axios.get('/api/Cliente');
      const clientData = response.data.map(cliente => ({
        id: cliente.Id,
        name: cliente.NomeCompleto,
        phone: cliente.Telefone || ''
      }));
      setClients(clientData);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const loadArtists = async () => {
    try {
      const response = await axios.get('/api/Agendamento/tatuadores-dropdown');
      const artistData = response.data.map(usuario => ({
        id: usuario.Id,
        name: usuario.NomeCompleto,
        specialization: ''
      }));
      setArtists(artistData);
    } catch (error) {
      console.error('Erro ao carregar tatuadores:', error);
      console.error('Detalhes do erro:', error.response?.data || error.message);
    }
  };

  // Filtra eventos por tatuador e status
  const filteredEvents = events.filter(event => {
    const artistMatch =
      selectedArtist === 'all' ||
      event.artist.id.toString() === selectedArtist;
    const statusMatch =
      selectedStatus === 'all' || event.status === selectedStatus;
    return artistMatch && statusMatch;
  });

  // Cores diferentes para diferentes status
  const eventStyleGetter = event => {
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

  const handleSelectEvent = event => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleSelectSlot = slotInfo => {
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

  const getStatusId = status => {
    switch (status) {
      case 'confirmed':
        return 2; // Confirmado
      case 'pending':
        return 1; // Pendente
      case 'canceled':
        return 3; // Cancelado
      default:
        return 1; // Padrão: Pendente
    }
  };

  const handleSaveEvent = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const startDate = new Date(formData.get('start-date'));
    const endDate = new Date(formData.get('end-date'));

    if (isNaN(startDate) || isNaN(endDate)) {
      alert('Data inválida!');
      return;
    }

    const eventData = {
      IdCliente: parseInt(formData.get('client')),
      IdTatuador: parseInt(formData.get('artist')),
      DataHoraInicio: startDate.toISOString(),
      DataHoraFim: endDate.toISOString(),
      IdStatus: getStatusId(formData.get('status')),
      TipoTatuagem: formData.get('type'),
      Valor: parseFloat(formData.get('value')) || 0,
      Observacoes: formData.get('notes') || ''
    };

    try {
      if (currentEvent.id) {
        // EDITAR
        await axios.put(`/api/Agendamento/${currentEvent.id}`, {
          ...eventData,
          id: currentEvent.id
        });
      } else {
        // CRIAR
        await axios.post('/api/Agendamento', eventData);
      }

      loadSchedules();
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      if (error.response) {
        console.error('Detalhes do erro:', error.response.data);
        alert('Erro: ' + JSON.stringify(error.response.data));
      } else {
        alert('Ocorreu um erro ao salvar o agendamento. Por favor, tente novamente.');
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (
      window.confirm(
        'Tem certeza que deseja cancelar este agendamento?'
      )
    ) {
      try {
        await axios.put(`/api/Agendamento/${currentEvent.id}`, {
          ...currentEvent,
          IdCliente: currentEvent.client.id,
          IdTatuador: currentEvent.artist.id,
          DataHoraInicio: new Date(currentEvent.start).toISOString(),
          DataHoraFim: new Date(currentEvent.end).toISOString(),
          IdStatus: 3, // "Cancelado"
          TipoTatuagem: currentEvent.type,
          Valor: currentEvent.value,
          Observacoes: currentEvent.notes
        });

        loadSchedules();
        setShowModal(false);
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        alert('Ocorreu um erro ao cancelar o agendamento. Por favor, tente novamente.');
      }
    }
  };

  const handleSendReminder = () => {
    alert(
      `Lembrete enviado para ${currentEvent.client.name} (${currentEvent.client.phone})`
    );
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
              onChange={e => setSelectedArtist(e.target.value)}
            >
              <option value="all">Todos Tatuadores</option>
              {artists.map(artist => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>

            <select
              className="form-control"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos Status</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendentes</option>
              <option value="canceled">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card calendar-container">
        <Calendar
          ref={calendarRef}
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={userRole !== 'tatuador'}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          views={{
            day: true,
            week: true,
            month: true
          }}
          eventPropGetter={eventStyleGetter}
          messages={{
            today: 'Atual',
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
          min={new Date(0, 0, 0, 9, 0, 0)}
          max={new Date(0, 0, 0, 22, 0, 0)}
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
                        onClick={() =>
                          alert(
                            `Lembrete enviado para ${currentEvent.client.name} (${currentEvent.client.phone})`
                          )
                        }
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