using System;
using System.ComponentModel.DataAnnotations;

namespace SkinArt_Manager.DTOs
{
    public class CriarAgendamentoDTO
    {
        [Required(ErrorMessage = "O cliente é obrigatório.")]
        public int IdCliente { get; set; }

        [Required(ErrorMessage = "O tatuador é obrigatório.")]
        public int IdTatuador { get; set; }

        [Required(ErrorMessage = "A data e hora de início são obrigatórias.")]
        public DateTime DataHoraInicio { get; set; }

        [Required(ErrorMessage = "A data e hora de fim são obrigatórias.")]
        public DateTime DataHoraFim { get; set; }

        [Required(ErrorMessage = "O status é obrigatório.")]
        public int IdStatus { get; set; }

        [Required(ErrorMessage = "O tipo de tatuagem é obrigatório.")]
        [MaxLength(255, ErrorMessage = "O tipo de tatuagem não pode exceder 255 caracteres.")]
        public string TipoTatuagem { get; set; } = string.Empty;

        [Required(ErrorMessage = "O valor é obrigatório.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
        public decimal Valor { get; set; }

        [MaxLength(4000, ErrorMessage = "As observações não podem exceder 4000 caracteres.")]
        public string? Observacoes { get; set; } = "";
    }
}