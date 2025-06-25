//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//namespace SkinArt_Manager.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class ExemploController : ControllerBase
//    {
//        // Público (qualquer um pode acessar)
//        [HttpGet("publico")]
//        public IActionResult Publico()
//        {
//            return Ok(new { message = "Acesso público liberado" });
//        }

//        // Requer autenticação (qualquer usuário logado)
//        [HttpGet("protegido")]
//        [Authorize]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
//        public IActionResult Protegido()
//        {
//            return Ok(new { message = "Acesso protegido - usuário autenticado" });
//        }

//        // Requer role específica
//        [HttpGet("admin")]
//        [Authorize(Roles = "admin")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
//        public IActionResult Admin()
//        {
//            return Ok(new { message = "Acesso restrito a administradores" });
//        }
//    }
//}