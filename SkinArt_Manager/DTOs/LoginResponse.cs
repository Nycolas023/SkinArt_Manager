using SkinArt_Manager.Models;

namespace SkinArt_Manager.DTOs
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public Usuario Usuario { get; set; }
    }
}
