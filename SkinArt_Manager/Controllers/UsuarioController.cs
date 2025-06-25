using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.DTOs;
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

        //[HttpGet]
        //public async Task<Usuario?> GetUsuarioAsync()
        //{
        //    return await usuarioService.UsuarioRetornaUsuarioTeste(1);
        //}

        [Authorize]
        [HttpGet("RetornaFuncionalidadesUsuario")]
        public async Task<IActionResult> Get(int id)
        {
            var response = await usuarioService.GetFuncionalidades(id);

            if (response == null || response.Count == 0)
                return NotFound();
            return Ok(response);
        }
    }
}
