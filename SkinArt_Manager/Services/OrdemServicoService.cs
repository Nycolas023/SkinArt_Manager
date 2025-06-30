using SkinArt_Manager.Data;
using SkinArt_Manager.DTOs.OrdemServicoDTO;

namespace SkinArt_Manager.Services
{
    public class OrdemServicoService
    {
        private readonly OrdemServicoRespository respository;
        public OrdemServicoService(OrdemServicoRespository ordemServico)
        {
            this.respository = ordemServico;
        }

        public Task<List<ListaOrdemServicoDTO>> GetOrdemServico(string ordem)
        {
            return this.respository.GetOrdemServico(ordem);
        }
    }
}
