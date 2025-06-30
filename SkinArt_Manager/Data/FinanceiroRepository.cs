using Dapper;
using Microsoft.Data.SqlClient;
using SkinArt_Manager.DTOs;
using SkinArt_Manager.DTOs.FinanceiroDTO;
using System.Data;

namespace SkinArt_Manager.Data
{
    public class FinanceiroRepository(IConfiguration configuration)
    {
        private readonly string _connectionString = configuration.GetConnectionString("DefaultParkingConnection");

        public async Task<List<ResumoFinanceiroDTO>> GetResumoFinanceiro()
        {
            using var conn = new SqlConnection(_connectionString);

            var resultados = await conn.QueryAsync<ResumoFinanceiroDTO>(
                "stp_resumo_financeiro",
                commandType: CommandType.StoredProcedure
            );

            return resultados.ToList();
        }


        //stp_resumo_financeiro
    }
}
