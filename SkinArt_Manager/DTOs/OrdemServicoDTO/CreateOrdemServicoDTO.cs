namespace SkinArt_Manager.DTOs.OrdemServicoDTO
{
    public class CreateOrdemServicoDTO
    {
        public int ID_CLIENTE { get; set; }
        public int ID_TATUADOR { get; set; }
        public string DESCRICAO_SERVICO { get; set; } = string.Empty;
        public decimal VALOR { get; set; }
        public string STATUS_SERVICO { get; set; } = string.Empty;
        public decimal? COMISSAO { get; set; } // Adicionado
        public string? METODO_PAGAMENTO { get; set; } // Adicionado
        public string? OBSERVACOES { get; set; } // Adicionado
    }
}
