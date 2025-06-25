using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.DTOs;
using SkinArt_Manager.Services;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UsuarioService _usuarioService;

    public AuthController(UsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest credenciais)
    {
        var usuario = await _usuarioService.GetLogin(credenciais);

        // Usuário fixo para testes
        if (usuario != null && credenciais.LOGIN_USUARIO == usuario.LOGIN_USUARIO && credenciais.SENHA_USUARIO == usuario.SENHA_USUARIO)
        {
            var token = TokenService.GenerateToken(credenciais);
            return Ok(new { token });
        }

        return Unauthorized("Usuário ou senha inválidos");
    }

    [HttpGet("protegido")]
    [Authorize]
    public IActionResult Protegido()
    {
        var user = User.Identity.Name;
        return Ok($"Bem-vindo, {user}!");
    }
}