namespace SkinArt_Manager.DTOs
{
    public class CriarEstoqueItemDTO
    {
        // ----> Comentário
        public string Categoria { get; set; } = string.Empty; // Inicializado para evitar nulo
        public string NomeItem { get; set; } = string.Empty; // Inicializado para evitar nulo
        public int Quantidade { get; set; }
        public string Unidade { get; set; } = string.Empty; // Inicializado para evitar nulo
        public decimal? UsoPorSessao { get; set; }
        public int EstoqueMinimo { get; set; }
    }
}