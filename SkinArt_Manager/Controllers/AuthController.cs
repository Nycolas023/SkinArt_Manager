using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.Models;
using SkinArt_Manager.Services;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] Usuario login)
    {
        // Usuário fixo para testes
        if (login.LOGIN_USUARIO == "admin" && login.SENHA_USUARIO == "123456")
        {
            var token = TokenService.GenerateToken(login);
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