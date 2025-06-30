using SkinArt_Manager.Models;

namespace SkinArt_Manager.DTOs.UsuarioDTO
{
    // ----> Comentário
    public class LoginResponseDTO
    {
        public string Token { get; set; }
        public Usuario Usuario { get; set; }

    }
}
