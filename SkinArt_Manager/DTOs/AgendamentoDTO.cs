using System;

namespace SkinArt_Manager.DTOs
{
    // ----> Comentário
    public class AgendamentoDTO
    {
        public int Id { get; set; }
        public int IdCliente { get; set; }
        public string NomeCliente { get; set; } 
        public int IdTatuador { get; set; }
        public string NomeTatuador { get; set; } 
        public DateTime DataHoraInicio { get; set; }
        public DateTime DataHoraFim { get; set; }
        public int IdStatus { get; set; }
        public string NomeStatus { get; set; } 
        public string TipoTatuagem { get; set; }
        public decimal Valor { get; set; }
        public string? Observacoes { get; set; }
    }
}