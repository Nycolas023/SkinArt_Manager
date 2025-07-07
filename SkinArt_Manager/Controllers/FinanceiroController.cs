using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.Services;

namespace SkinArt_Manager.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class FinanceiroController : Controller
    {
        private readonly FinanceiroService financeiroService;

        public FinanceiroController(FinanceiroService financeiroService)
        {
            this.financeiroService = financeiroService;
        }

        [Authorize]
        [HttpGet("ResumoFinanceiro")]
        public async Task<IActionResult> RetornaResumoFinanceiro() 
        {
            var response = await financeiroService.GetResumoFinanceiro();

            if (response == null)
                return NotFound();
            return Ok(response);
        }
    }
}
