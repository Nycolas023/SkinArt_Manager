using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.DTOs.UsuarioDTO;
using SkinArt_Manager.Models;
using SkinArt_Manager.Services;

// ----> Comentário

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

        [HttpGet("RetornaTodosUsuarios")]
        public async Task<List<Usuario>?> GetUsuarioAsync()
        {
            return await usuarioService.UsuarioRetornaTodosUsuarios();
        }

        [Authorize]
        [HttpPost("CriaUsuario")]
        public async Task<IActionResult> CriaUsuario([FromBody] CreateUsuarioDTO usuario)
        {
            var novoUsuario = await usuarioService.CreateUsuario(usuario);

            if (novoUsuario != null)
            {
                // Removido: associação automática de papel
                return Ok(novoUsuario);
            }

            return BadRequest("Falha ao criar usuário");
        }

        [Authorize]
        [HttpPut("AtualizaUsuarioAtivo")]
        public async Task<IActionResult> AtualizaStatusAtivo(int idUsuario)
        {
            AtualizaStatusDTO atualizaStatus = new();

            atualizaStatus.ID_USUARIO = idUsuario;
            atualizaStatus.STATUS_USUARIO = "Ativo";

            var response = await usuarioService.SetStatus(atualizaStatus);

            if (response == null)
                return NotFound();
            return Ok(response);
        }

        [Authorize]
        [HttpPut("SairUsuario")]
        public async Task<IActionResult> AtualizaStatusInativo(int idUsuario)
        {
            AtualizaStatusDTO atualizaStatus = new();

            atualizaStatus.ID_USUARIO = idUsuario;
            atualizaStatus.STATUS_USUARIO = "Inativo";

            var response = await usuarioService.SetStatus(atualizaStatus);

            if (response == null)
                return NotFound();
            return Ok(response);
        }

        [Authorize]
        [HttpPut("EditarUsuario")]
        public async Task<IActionResult> AtualizaUsuario(AtualizaUsuarioDTO usuario)
        {
            var response = await usuarioService.SetUsuario(usuario);

            if (response == null)
                return NotFound();
            return Ok(response);
        }

        [Authorize]
        [HttpDelete("DeletaUsuario")]
        public async Task<IActionResult> DeletaUsuario(int idUsuario)
        {
            DeleteUsuarioDTO usuario = new()
            {
                ID_USUARIO = idUsuario
            };

            var response = await usuarioService.DeleteUsuario(usuario);

            if (response == null || !response.Contains("sucesso"))
            {
                return NotFound("Usuário não encontrado ou falha ao deletar.");
            }
            
            return Ok(response);
        }
    }
}
