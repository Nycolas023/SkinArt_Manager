namespace SkinArt_Manager.DTOs.OrdemServicoDTO
{
    public class UpdateOrdemServico
    {
        public int ID_ORDEM_SERVICO { get; set; }
        public string DESCRICAO_SERVICO { get; set; } = string.Empty;
        public decimal VALOR { get; set; }
        public string STATUS_SERVICO { get; set; } = string.Empty;
    }
}
