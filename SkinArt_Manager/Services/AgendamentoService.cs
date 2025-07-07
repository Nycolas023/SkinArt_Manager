using SkinArt_Manager.Data;
using SkinArt_Manager.DTOs.AgendamentoDTO;

namespace SkinArt_Manager.Services
{
    public class AgendamentoService
    {
        private readonly AgendamentoRepository _agendamentoRepository;
        private readonly ClienteRepository _clienteRepository;
        private readonly UsuarioRepository _usuarioRepository;

        public AgendamentoService(
            AgendamentoRepository agendamentoRepository,
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository)
        {
            _agendamentoRepository = agendamentoRepository;
            _clienteRepository = clienteRepository;
            _usuarioRepository = usuarioRepository;
        }

        public async Task<IEnumerable<AgendamentoDTO>> GetAgendamentosFiltrados(
            DateTime? startDate = null,
            DateTime? endDate = null,
            int? tatuadorId = null,
            int? statusId = null)
        {
            return await _agendamentoRepository.GetAgendamentos(startDate, endDate, tatuadorId, statusId);
        }

        public async Task<AgendamentoDTO?> GetAgendamentoById(int id)
        {
            return await _agendamentoRepository.GetAgendamentoById(id);
        }

        public async Task<int> AddAgendamento(CriarAgendamentoDTO newAgendamento)
        {
            var cliente = await _clienteRepository.GetClienteById(newAgendamento.IdCliente);
            if (cliente == null)
            {
                throw new ArgumentException("Cliente não encontrado.");
            }

            var tatuador = await _usuarioRepository.GetUsuarioById(newAgendamento.IdTatuador);
            if (tatuador == null)
            {
                throw new ArgumentException("Tatuador não encontrado.");
            }

            if (newAgendamento.DataHoraInicio >= newAgendamento.DataHoraFim)
            {
                throw new ArgumentException("A data/hora de início deve ser anterior à data/hora de fim.");
            }

            return await _agendamentoRepository.AddAgendamento(newAgendamento);
        }

        public async Task<bool> UpdateAgendamento(AtualizarAgendamentoDTO updatedAgendamento)
        {
            var existingAgendamento = await _agendamentoRepository.GetAgendamentoById(updatedAgendamento.Id);
            if (existingAgendamento == null)
            {
                return false;
            }

            var cliente = await _clienteRepository.GetClienteById(updatedAgendamento.IdCliente);
            if (cliente == null)
            {
                throw new ArgumentException("Cliente não encontrado.");
            }

            var tatuador = await _usuarioRepository.GetUsuarioById(updatedAgendamento.IdTatuador);
            if (tatuador == null)
            {
                throw new ArgumentException("Tatuador não encontrado.");
            }

            if (updatedAgendamento.DataHoraInicio >= updatedAgendamento.DataHoraFim)
            {
                throw new ArgumentException("A data/hora de início deve ser anterior à data/hora de fim.");
            }

            return await _agendamentoRepository.UpdateAgendamento(updatedAgendamento);
        }

        public async Task<bool> DeleteAgendamento(int id)
        {
            return await _agendamentoRepository.DeleteAgendamento(id);
        }

        public async Task<IEnumerable<TatuadorDropdownDTO>> GetTatuadoresParaDropdown()
        {
            return await _agendamentoRepository.GetTatuadoresParaDropdown();
        }

        public async Task<IEnumerable<StatusAgendamentoDTO>> GetStatusAgendamentoParaDropdown()
        {
            return await _agendamentoRepository.GetStatusAgendamentoParaDropdown();
        }
    }
}