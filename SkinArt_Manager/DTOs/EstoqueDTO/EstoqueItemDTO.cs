namespace SkinArt_Manager.DTOs.EstoqueDTO
{
    public class EstoqueItemDTO
    {
        public int Id { get; set; }
        public string Categoria { get; set; }
        public string NomeItem { get; set; }
        public int Quantidade { get; set; }
        public string Unidade { get; set; }
        public decimal? UsoPorSessao { get; set; }
        public int EstoqueMinimo { get; set; }
        public int? SessoesRestantes => UsoPorSessao.HasValue && UsoPorSessao.Value > 0
                                        ? (int?)(Quantidade / UsoPorSessao.Value)
                                        : null;
        public string Status => Quantidade >= EstoqueMinimo ? "OK" : "Abaixo do Mínimo";
    }
}