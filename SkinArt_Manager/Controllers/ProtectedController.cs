using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProtectedController : ControllerBase
{
    /// <summary>
    /// Obtém dados protegidos (requer autenticação)
    /// </summary>
    /// <returns>Dados protegidos</returns>
    [HttpGet("data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult GetProtectedData()
    {
        return Ok(new
        {
            Message = "Você acessou dados protegidos!",
            User = User.Identity.Name,
            Data = new[] { "Item1", "Item2", "Item3" }
        });
    }
}