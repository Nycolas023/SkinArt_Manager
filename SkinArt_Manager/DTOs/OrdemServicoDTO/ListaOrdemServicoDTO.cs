namespace SkinArt_Manager.DTOs.OrdemServicoDTO
{
    public class ListaOrdemServicoDTO
    {
        public int ID_ORDEM_SERVICO { get; set; }
        public string DESCRICAO_SERVICO { get; set; } = string.Empty;
        public int VALOR { get; set; }
        public string STATUS_SERVICO { get; set; } = string.Empty;
        public string CLIENTE { get; set; } = string.Empty;
        public string TATUADOR { get; set; } = string.Empty;
        public DateTime DATA_CRIACAO { get; set; }

    }
}
