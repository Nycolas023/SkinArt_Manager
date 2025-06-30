using SkinArt_Manager.Data;
using SkinArt_Manager.DTOs.FinanceiroDTO;

namespace SkinArt_Manager.Services
{
    public class FinanceiroService
    {
        private readonly FinanceiroRepository repository;

        public FinanceiroService(FinanceiroRepository financeiroRepository)
        {
            this.repository = financeiroRepository;
        }

        public async Task<List<ResumoFinanceiroDTO>?> GetResumoFinanceiro()
        {
            return await repository.GetResumoFinanceiro();
        }
        
    }
}
