using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.DTOs.UsuarioDTO;
using SkinArt_Manager.Services;

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
            usuario.Token = TokenService.GenerateToken(usuario);
            return Ok();
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
            usuario.Token = TokenService.GenerateToken(usuario);
            return Ok();
        }

        return Unauthorized("Usuário ou senha inválidos");
    }

}