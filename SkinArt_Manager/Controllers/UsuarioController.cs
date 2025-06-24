using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.Models;
using SkinArt_Manager.Services;

namespace SkinArt_Manager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService usuarioService;

        public UsuarioController(UsuarioService usuarioService)
        {
            this.usuarioService = usuarioService;
        }

        [HttpGet]
        public async Task<Usuario?> GetUsuarioAsync()
        {
            return await usuarioService.UsuarioRetornaUsuarioTeste(1);
        }
    }
}
