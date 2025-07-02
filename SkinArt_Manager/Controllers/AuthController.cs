using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.DTOs.UsuarioDTO;
using SkinArt_Manager.Services;

// ----> Comentário

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UsuarioService _usuarioService;

    public AuthController(UsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpPost("loginAdmin")]
    public async Task<IActionResult> LoginAdmin([FromBody] LoginRequestDTO credenciais)
    {
        var usuario = await _usuarioService.GetLoginAdmin(credenciais);

        if (usuario != null &&
            credenciais.LOGIN_USUARIO.Equals(usuario.Usuario.LOGIN_USUARIO, StringComparison.OrdinalIgnoreCase) &&
            credenciais.SENHA_USUARIO == usuario.Usuario.SENHA_USUARIO)
        {
            usuario.Token = TokenService.GenerateToken(usuario); // Armazena direto no DTO
            return Ok(usuario);
        }

        return Unauthorized("Usuário ou senha inválidos");
    }

    [HttpPost("loginTatuador")]
    public async Task<IActionResult> LoginTatuador([FromBody] LoginRequestDTO credenciais)
    {
        var usuario = await _usuarioService.GetLoginTatuador(credenciais);

        if (usuario != null &&
            credenciais.LOGIN_USUARIO.Equals(usuario.Usuario.LOGIN_USUARIO, StringComparison.OrdinalIgnoreCase) &&
            credenciais.SENHA_USUARIO == usuario.Usuario.SENHA_USUARIO)
        {
            usuario.Token = TokenService.GenerateToken(usuario); // Armazena direto no DTO
            return Ok(usuario);
        }

        return Unauthorized("Usuário ou senha inválidos");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO credenciais)
    {
        // Tenta primeiro como admin
        var usuarioAdmin = await _usuarioService.GetLoginAdmin(credenciais);
        if (usuarioAdmin != null &&
            credenciais.LOGIN_USUARIO.Equals(usuarioAdmin.Usuario.LOGIN_USUARIO, StringComparison.OrdinalIgnoreCase) &&
            credenciais.SENHA_USUARIO == usuarioAdmin.Usuario.SENHA_USUARIO)
        {
            usuarioAdmin.Token = TokenService.GenerateToken(usuarioAdmin);
            return Ok(usuarioAdmin);
        }

        // Se não for admin, tenta como tatuador
        var usuarioTatuador = await _usuarioService.GetLoginTatuador(credenciais);
        if (usuarioTatuador != null &&
            credenciais.LOGIN_USUARIO.Equals(usuarioTatuador.Usuario.LOGIN_USUARIO, StringComparison.OrdinalIgnoreCase) &&
            credenciais.SENHA_USUARIO == usuarioTatuador.Usuario.SENHA_USUARIO)
        {
            usuarioTatuador.Token = TokenService.GenerateToken(usuarioTatuador);
            return Ok(usuarioTatuador);
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