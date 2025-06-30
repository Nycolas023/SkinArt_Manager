using SkinArt_Manager.Data;
using SkinArt_Manager.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SkinArt_Manager.Services
{
    // ----> Comentário
    public class EstoqueService
    {
        private readonly EstoqueRepository _estoqueRepository;

        public EstoqueService(EstoqueRepository estoqueRepository)
        {
            _estoqueRepository = estoqueRepository;
        }

        public async Task<IEnumerable<EstoqueItemDTO>> GetAllEstoqueItens(string? categoria = null)
        {
            return await _estoqueRepository.GetAllItensEstoque(categoria);
        }

        public async Task<EstoqueItemDTO?> GetEstoqueItemById(int id)
        {
            return await _estoqueRepository.GetItemEstoqueById(id);
        }

        public async Task<IEnumerable<EstoqueItemDTO>> GetEstoqueItensBaixo()
        {
            return await _estoqueRepository.GetItensEstoqueBaixo();
        }

        public async Task<int> AddItemEstoque(CriarEstoqueItemDTO newItem)
        {
            return await _estoqueRepository.AddItemEstoque(newItem);
        }

        public async Task<bool> UpdateEstoqueItem(AtualizarEstoqueItemDTO item)
        {
            var existingItem = await _estoqueRepository.GetItemEstoqueById(item.Id);
            if (existingItem == null)
            {
                return false;
            }
            return await _estoqueRepository.UpdateItemEstoque(item);
        }

        public async Task<bool> DeleteItemEstoque(int id)
        {
            return await _estoqueRepository.DeleteItemEstoque(id);
        }
    }
}