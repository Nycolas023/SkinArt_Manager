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

    }
}
