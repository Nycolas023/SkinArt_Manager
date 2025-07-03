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
            return Ok(new
            {
                Token = usuario.Token,
                Usuario = new
                {
                    usuario.Usuario.ID_USUARIO,
                    usuario.Usuario.NOME_USUARIO,
                    usuario.Usuario.SOBRENOME_USUARIO,
                    usuario.Usuario.DATA_NASC_USUARIO,
                    usuario.Usuario.CPF_USUARIO,
                    usuario.Usuario.RG_USUARIO,
                    usuario.Usuario.LOGIN_USUARIO,
                    usuario.Usuario.SENHA_USUARIO,
                    usuario.Usuario.STATUS_USUARIO,
                    usuario.Usuario.ULTIMO_LOGIN,
                    // Adicione o campo de papel/função aqui
                    NOME_PAPEL = "Admin"
                }
            });
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
            return Ok(new
            {
                Token = usuario.Token,
                Usuario = new
                {
                    usuario.Usuario.ID_USUARIO,
                    usuario.Usuario.NOME_USUARIO,
                    usuario.Usuario.SOBRENOME_USUARIO,
                    usuario.Usuario.DATA_NASC_USUARIO,
                    usuario.Usuario.CPF_USUARIO,
                    usuario.Usuario.RG_USUARIO,
                    usuario.Usuario.LOGIN_USUARIO,
                    usuario.Usuario.SENHA_USUARIO,
                    usuario.Usuario.STATUS_USUARIO,
                    usuario.Usuario.ULTIMO_LOGIN,
                    // Adicione o campo de papel/função aqui
                    NOME_PAPEL = "Tatuador"
                }
            });
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
            return Ok(new
            {
                Token = usuarioAdmin.Token,
                Usuario = new
                {
                    usuarioAdmin.Usuario.ID_USUARIO,
                    usuarioAdmin.Usuario.NOME_USUARIO,
                    usuarioAdmin.Usuario.SOBRENOME_USUARIO,
                    usuarioAdmin.Usuario.DATA_NASC_USUARIO,
                    usuarioAdmin.Usuario.CPF_USUARIO,
                    usuarioAdmin.Usuario.RG_USUARIO,
                    usuarioAdmin.Usuario.LOGIN_USUARIO,
                    usuarioAdmin.Usuario.SENHA_USUARIO,
                    usuarioAdmin.Usuario.STATUS_USUARIO,
                    usuarioAdmin.Usuario.ULTIMO_LOGIN,
                    NOME_PAPEL = "Admin"
                }
            });
        }

        // Se não for admin, tenta como tatuador
        var usuarioTatuador = await _usuarioService.GetLoginTatuador(credenciais);
        if (usuarioTatuador != null &&
            credenciais.LOGIN_USUARIO.Equals(usuarioTatuador.Usuario.LOGIN_USUARIO, StringComparison.OrdinalIgnoreCase) &&
            credenciais.SENHA_USUARIO == usuarioTatuador.Usuario.SENHA_USUARIO)
        {
            usuarioTatuador.Token = TokenService.GenerateToken(usuarioTatuador);
            return Ok(new
            {
                Token = usuarioTatuador.Token,
                Usuario = new
                {
                    usuarioTatuador.Usuario.ID_USUARIO,
                    usuarioTatuador.Usuario.NOME_USUARIO,
                    usuarioTatuador.Usuario.SOBRENOME_USUARIO,
                    usuarioTatuador.Usuario.DATA_NASC_USUARIO,
                    usuarioTatuador.Usuario.CPF_USUARIO,
                    usuarioTatuador.Usuario.RG_USUARIO,
                    usuarioTatuador.Usuario.LOGIN_USUARIO,
                    usuarioTatuador.Usuario.SENHA_USUARIO,
                    usuarioTatuador.Usuario.STATUS_USUARIO,
                    usuarioTatuador.Usuario.ULTIMO_LOGIN,
                    NOME_PAPEL = "Tatuador"
                }
            });
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