using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SkinArt_Manager.DTOs.AgendamentoDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinArt_Manager.Data
{
    public class AgendamentoRepository
    {
        private readonly string _connectionString;

        public AgendamentoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultParkingConnection");
        }

        public async Task<IEnumerable<AgendamentoDTO>> GetAgendamentos(
            DateTime? startDate = null,
            DateTime? endDate = null,
            int? tatuadorId = null,
            int? statusId = null)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = @"
                SELECT
                    AG.ID_AGENDAMENTO AS Id,
                    AG.ID_CLIENTE AS IdCliente,
                    C.NOME_COMPLETO AS NomeCliente,
                    AG.ID_TATUADOR AS IdTatuador,
                    U.NOME_USUARIO + ' ' + U.SOBRENOME_USUARIO AS NomeTatuador,
                    AG.DATA_HORA_INICIO AS DataHoraInicio,
                    AG.DATA_HORA_FIM AS DataHoraFim,
                    AG.ID_STATUS_AGENDAMENTO AS IdStatus,
                    SA.NOME_STATUS AS NomeStatus,
                    AG.TIPO_TATUAGEM AS TipoTatuagem,
                    AG.VALOR AS Valor,
                    AG.OBSERVACOES AS Observacoes
                FROM Agendamento AG
                JOIN Cliente C ON AG.ID_CLIENTE = C.ID_CLIENTE
                JOIN Tatuador T ON AG.ID_TATUADOR = T.ID_USUARIO
                JOIN Usuario U ON T.ID_USUARIO = U.ID_USUARIO
                JOIN StatusAgendamento SA ON AG.ID_STATUS_AGENDAMENTO = SA.ID_STATUS_AGENDAMENTO
                WHERE 1 = 1";

            var parameters = new DynamicParameters();

            if (startDate.HasValue)
            {
                sql += " AND AG.DATA_HORA_INICIO >= @StartDate";
                parameters.Add("StartDate", startDate.Value);
            }
            if (endDate.HasValue)
            {
                sql += " AND AG.DATA_HORA_FIM <= @EndDate";
                parameters.Add("EndDate", endDate.Value);
            }
            if (tatuadorId.HasValue)
            {
                sql += " AND AG.ID_TATUADOR = @TatuadorId";
                parameters.Add("TatuadorId", tatuadorId.Value);
            }
            if (statusId.HasValue)
            {
                sql += " AND AG.ID_STATUS_AGENDAMENTO = @StatusId";
                parameters.Add("StatusId", statusId.Value);
            }

            sql += " ORDER BY AG.DATA_HORA_INICIO ASC"; // Ordena por data/hora para o calendário

            return await conn.QueryAsync<AgendamentoDTO>(sql, parameters);
        }

        public async Task<AgendamentoDTO?> GetAgendamentoById(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = @"
                SELECT
                    AG.ID_AGENDAMENTO AS Id,
                    AG.ID_CLIENTE AS IdCliente,
                    C.NOME_COMPLETO AS NomeCliente,
                    AG.ID_TATUADOR AS IdTatuador,
                    U.NOME_USUARIO + ' ' + U.SOBRENOME_USUARIO AS NomeTatuador,
                    AG.DATA_HORA_INICIO AS DataHoraInicio,
                    AG.DATA_HORA_FIM AS DataHoraFim,
                    AG.ID_STATUS_AGENDAMENTO AS IdStatus,
                    SA.NOME_STATUS AS NomeStatus,
                    AG.TIPO_TATUAGEM AS TipoTatuagem,
                    AG.VALOR AS Valor,
                    AG.OBSERVACOES AS Observacoes
                FROM Agendamento AG
                JOIN Cliente C ON AG.ID_CLIENTE = C.ID_CLIENTE
                JOIN Tatuador T ON AG.ID_TATUADOR = T.ID_USUARIO
                JOIN Usuario U ON T.ID_USUARIO = U.ID_USUARIO
                JOIN StatusAgendamento SA ON AG.ID_STATUS_AGENDAMENTO = SA.ID_STATUS_AGENDAMENTO
                WHERE AG.ID_AGENDAMENTO = @Id";
            return await conn.QueryFirstOrDefaultAsync<AgendamentoDTO>(sql, new { Id = id });
        }

        public async Task<int> AddAgendamento(CriarAgendamentoDTO newAgendamento)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = @"
                INSERT INTO Agendamento (ID_CLIENTE, ID_TATUADOR, DATA_HORA_INICIO, DATA_HORA_FIM, ID_STATUS_AGENDAMENTO, TIPO_TATUAGEM, VALOR, OBSERVACOES)
                VALUES (@IdCliente, @IdTatuador, @DataHoraInicio, @DataHoraFim, @IdStatus, @TipoTatuagem, @Valor, @Observacoes);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            return await conn.ExecuteScalarAsync<int>(sql, newAgendamento);
        }

        public async Task<bool> UpdateAgendamento(AtualizarAgendamentoDTO updatedAgendamento)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = @"
                UPDATE Agendamento
                SET
                    ID_CLIENTE = @IdCliente,
                    ID_TATUADOR = @IdTatuador,
                    DATA_HORA_INICIO = @DataHoraInicio,
                    DATA_HORA_FIM = @DataHoraFim,
                    ID_STATUS_AGENDAMENTO = @IdStatus,
                    TIPO_TATUAGEM = @TipoTatuagem,
                    VALOR = @Valor,
                    OBSERVACOES = @Observacoes,
                    DATA_ATUALIZACAO = GETDATE()
                WHERE ID_AGENDAMENTO = @Id;";

            var affectedRows = await conn.ExecuteAsync(sql, updatedAgendamento);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAgendamento(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "DELETE FROM Agendamento WHERE ID_AGENDAMENTO = @Id";
            var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });
            return affectedRows > 0;
        }

        public async Task<IEnumerable<TatuadorDropdownDTO>> GetTatuadoresParaDropdown()
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "SELECT U.ID_USUARIO AS Id, U.NOME_USUARIO + ' ' + U.SOBRENOME_USUARIO AS NomeCompleto FROM Tatuador T JOIN Usuario U ON T.ID_USUARIO = U.ID_USUARIO ORDER BY NomeCompleto";
            return await conn.QueryAsync<TatuadorDropdownDTO>(sql);
        }

        public async Task<IEnumerable<StatusAgendamentoDTO>> GetStatusAgendamentoParaDropdown()
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "SELECT ID_STATUS_AGENDAMENTO AS Id, NOME_STATUS AS Nome FROM StatusAgendamento ORDER BY NOME_STATUS";
            return await conn.QueryAsync<StatusAgendamentoDTO>(sql);
        }
    }
}