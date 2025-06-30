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

        public Task<CreateOrdemServicoDTO> CreateOrdemServico(CreateOrdemServicoDTO ordem)
        {
            return this.respository.CreateOrdemServico(ordem);
        }
        public Task<string> UpdateOrdemServico(UpdateOrdemServico ordem)
        {
            return this.respository.AlterOrdemService(ordem);
        }
    }
}
