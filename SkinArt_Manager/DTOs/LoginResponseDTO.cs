using SkinArt_Manager.Models;

namespace SkinArt_Manager.DTOs
{
    public class LoginResponseDTO
    {
        public string Token { get; set; }
        public Usuario Usuario { get; set; }
        public string NOME_PAPEL { get; set; }

    }
}
