namespace SkinArt_Manager.DTOs
{
    public class CriarEstoqueItemDTO
    {
        // ----> Comentário
        public string Categoria { get; set; }
        public string NomeItem { get; set; }
        public int Quantidade { get; set; }
        public string Unidade { get; set; }
        public decimal? UsoPorSessao { get; set; }
        public int EstoqueMinimo { get; set; }
    }
}