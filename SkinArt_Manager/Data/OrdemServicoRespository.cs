using Dapper;
using Microsoft.Data.SqlClient;
using SkinArt_Manager.DTOs.OrdemServicoDTO;
using System.Data;

namespace SkinArt_Manager.Data
{
    public class OrdemServicoRespository(IConfiguration configuration)
    {
        private readonly string _connectionString = configuration.GetConnectionString("DefaultParkingConnection");

        public async Task<List<ListaOrdemServicoDTO>> GetOrdemServico(string ordem = null)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new DynamicParameters();

            if (!string.IsNullOrEmpty(ordem))
            {
                parametros.Add("STATUS_SERVICO", ordem);

                var resultados = await conn.QueryAsync<ListaOrdemServicoDTO>(
                    "stp_listar_ordens_servico",
                    parametros,
                    commandType: CommandType.StoredProcedure
                );

                return resultados.ToList();
            }
            else
            {
                var resultados = await conn.QueryAsync<ListaOrdemServicoDTO>(
                    "stp_listar_ordens_servico",
                    commandType: CommandType.StoredProcedure
                );

                return resultados.ToList();
            }
        }

        //PAREI AQUI PRECISO CRIAR NOVAS ORDENS DE SERVIÇO E CRIAR O ENDPOINT DE EDIÇÃO

        public async Task<CreateOrdemServicoDTO> CreateOrdemServico(CreateOrdemServicoDTO ordem)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new {
                ID_CLIENTE = ordem.ID_CLIENTE,
                ID_TATUADOR = ordem.ID_TATUADOR,
                STATUS_SERVICO = ordem.STATUS_SERVICO ?? "pending",
                VALOR = ordem.VALOR,
                DESCRICAO_SERVICO = ordem.DESCRICAO_SERVICO ?? "",
                COMISSAO = ordem.COMISSAO ?? 0,
                METODO_PAGAMENTO = ordem.METODO_PAGAMENTO ?? "",
                OBSERVACOES = ordem.OBSERVACOES ?? ""
            };

            var resultados = await conn.QueryFirstAsync<CreateOrdemServicoDTO>(
                "stp_inserir_ordem_servico",
                parametros,
                commandType: CommandType.StoredProcedure
            );

            return resultados;
        }

        public async Task<string> AlterOrdemService(UpdateOrdemServico ordem)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new
            {
                ID_ORDEM_SERVICO = ordem.ID_ORDEM_SERVICO,
                ID_CLIENTE = ordem.ID_CLIENTE,           // Adicionado
                ID_TATUADOR = ordem.ID_TATUADOR,         // Adicionado
                DESCRICAO_SERVICO = ordem.DESCRICAO_SERVICO,
                VALOR = ordem.VALOR,
                STATUS_SERVICO = ordem.STATUS_SERVICO,
                COMISSAO = ordem.COMISSAO ?? 0,
                METODO_PAGAMENTO = ordem.METODO_PAGAMENTO ?? "",
                OBSERVACOES = ordem.OBSERVACOES ?? ""
            };

            var resultados = await conn.ExecuteAsync(
                "stp_atualizar_ordem_servico",
                parametros,
                commandType: CommandType.StoredProcedure
            );

            return resultados > 0 ? "Ordem alterada com sucesso" : "Falha ao alterar o ordem";
        }
    }
}

public class CreateOrdemServicoDTO
{
    public int ID_CLIENTE { get; set; }
    public int ID_TATUADOR { get; set; }
    public string DESCRICAO_SERVICO { get; set; }
    public decimal VALOR { get; set; }
    public string STATUS_SERVICO { get; set; }
    public decimal? COMISSAO { get; set; } // Adicionado
    public string METODO_PAGAMENTO { get; set; } // Adicionado
    public string OBSERVACOES { get; set; } // Adicionado
}

public class UpdateOrdemServico
{
    public int ID_ORDEM_SERVICO { get; set; }
    public int ID_CLIENTE { get; set; } // Adicionado
    public int ID_TATUADOR { get; set; } // Adicionado
    public string DESCRICAO_SERVICO { get; set; }
    public decimal VALOR { get; set; }
    public string STATUS_SERVICO { get; set; }
    public decimal? COMISSAO { get; set; } // Adicionado
    public string METODO_PAGAMENTO { get; set; } // Adicionado
    public string OBSERVACOES { get; set; } // Adicionado
}
