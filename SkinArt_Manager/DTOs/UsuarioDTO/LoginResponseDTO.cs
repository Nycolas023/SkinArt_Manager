using SkinArt_Manager.Models;

namespace SkinArt_Manager.DTOs.UsuarioDTO
{
    public class LoginResponseDTO
    {
        public string Token { get; set; }
        public Usuario Usuario { get; set; }

    }
}
