using SkinArt_Manager.Models;

namespace SkinArt_Manager.DTOs
{
    public class LoginResponseDTO
    {
        public string Token { get; set; }
        public Usuario Usuario { get; set; }
        public List<string> Papeis { get; set; }

    }
}
