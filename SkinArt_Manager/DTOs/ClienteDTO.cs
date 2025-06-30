namespace SkinArt_Manager.DTOs
{

    // ----> Comentário
    public class ClienteDTO
    {
        public int Id { get; set; }
        public string NomeCompleto { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public DateTime? DataNascimento { get; set; }
        public string? Observacoes { get; set; }
    }
}