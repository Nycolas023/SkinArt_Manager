using System.ComponentModel.DataAnnotations;

namespace SkinArt_Manager.DTOs
{
    // ----> Comentário
    public class CriarClienteDTO
    {
        [Required(ErrorMessage = "O nome completo é obrigatório.")]
        [MaxLength(255, ErrorMessage = "O nome completo não pode exceder 255 caracteres.")]
        public string NomeCompleto { get; set; } = string.Empty;

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
        [MaxLength(255, ErrorMessage = "O e-mail não pode exceder 255 caracteres.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "O telefone é obrigatório.")]
        [Phone(ErrorMessage = "Formato de telefone inválido.")]
        [MaxLength(20, ErrorMessage = "O telefone não pode exceder 20 caracteres.")]
        public string Telefone { get; set; } = string.Empty;

        public DateTime? DataNascimento { get; set; }

        [MaxLength(4000, ErrorMessage = "As observações não podem exceder 4000 caracteres.")]
        public string? Observacoes { get; set; }
    }
}