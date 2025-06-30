using SkinArt_Manager.Data;
using SkinArt_Manager.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SkinArt_Manager.Services
{
    // ----> Comentário
    public class ClienteService
    {
        private readonly ClienteRepository _clienteRepository;

        public ClienteService(ClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }

        public async Task<IEnumerable<ClienteDTO>> GetAllClientes(string? searchTerm = null)
        {
            return await _clienteRepository.GetAllClientes(searchTerm);
        }

        public async Task<ClienteDTO?> GetClienteById(int id)
        {
            return await _clienteRepository.GetClienteById(id);
        }

        public async Task<int> AddCliente(CriarClienteDTO newCliente)
        {
            return await _clienteRepository.AddCliente(newCliente);
        }

        public async Task<bool> UpdateCliente(AtualizarClienteDTO updatedCliente)
        {
            var existingCliente = await _clienteRepository.GetClienteById(updatedCliente.Id);
            if (existingCliente == null)
            {
                return false; 
            }
            return await _clienteRepository.UpdateCliente(updatedCliente);
        }

        public async Task<bool> DeleteCliente(int id)
        {
            return await _clienteRepository.DeleteCliente(id);
        }
    }
}