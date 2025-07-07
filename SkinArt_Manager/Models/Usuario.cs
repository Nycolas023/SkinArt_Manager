namespace SkinArt_Manager.Models
{
    public class Usuario
    {
        public int ID_USUARIO { get; set; }
        public string NOME_USUARIO { get; set; } = string.Empty;
        public string SOBRENOME_USUARIO { get; set; } = string.Empty;
        public DateTime DATA_NASC_USUARIO { get; set; }
        public string CPF_USUARIO { get; set; } = string.Empty;
        public string RG_USUARIO { get; set; } = string.Empty;
        public string LOGIN_USUARIO { get; set; } = string.Empty;
        public string SENHA_USUARIO { get; set; } = string.Empty;
        public string? STATUS_USUARIO { get; set; } = string.Empty;
        public DateTime? ULTIMO_LOGIN { get; set; }
    }

}