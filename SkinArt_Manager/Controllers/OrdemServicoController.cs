using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.Services;
using System.Security.Cryptography.X509Certificates;

namespace SkinArt_Manager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdemServicoController : Controller
    {
        private readonly OrdemServicoService ordemServicoService;

        public OrdemServicoController(OrdemServicoService ordemServicoService)
        {
            this.ordemServicoService = ordemServicoService;
        }

        [Authorize]
        [HttpGet("ListaOrdemServico")]
        public async Task<IActionResult> GetOrdemServico(string ordem = null)
        {
            var response = await ordemServicoService.GetOrdemServico(ordem);

            if (response == null)
                return NotFound();
            return Ok(response);
        }
    }
}
