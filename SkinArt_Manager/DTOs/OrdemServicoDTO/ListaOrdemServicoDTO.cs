namespace SkinArt_Manager.DTOs.OrdemServicoDTO
{
    public class ListaOrdemServicoDTO
    {
        public int ID_ORDEM_SERVICO { get; set; }
        public int ID_CLIENTE { get; set; }         // Adicionado
        public int ID_TATUADOR { get; set; }        // Adicionado
        public string DESCRICAO_SERVICO { get; set; } = string.Empty;
        public decimal VALOR { get; set; }
        public string STATUS_SERVICO { get; set; } = string.Empty;
        public string CLIENTE { get; set; } = string.Empty;
        public string TATUADOR { get; set; } = string.Empty;
        public DateTime DATA_CRIACAO { get; set; }
        public decimal? COMISSAO { get; set; }
        public string? METODO_PAGAMENTO { get; set; }
        public string? OBSERVACOES { get; set; }
    }
}
