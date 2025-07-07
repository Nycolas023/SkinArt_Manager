using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SkinArt_Manager.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

// ----> Comentário

namespace SkinArt_Manager.Data
{
    public class ClienteRepository
    {
        private readonly string _connectionString;

        public ClienteRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultParkingConnection");
        }

        public async Task<IEnumerable<ClienteDTO>> GetAllClientes(string? searchTerm = null)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "SELECT ID_CLIENTE AS Id, NOME_COMPLETO AS NomeCompleto, EMAIL AS Email, TELEFONE AS Telefone, DATA_NASCIMENTO AS DataNascimento, OBSERVACOES AS Observacoes FROM Cliente";

            if (!string.IsNullOrEmpty(searchTerm))
            {
                sql += " WHERE NOME_COMPLETO LIKE @SearchTerm OR EMAIL LIKE @SearchTerm OR TELEFONE LIKE @SearchTerm";
                searchTerm = $"%{searchTerm}%"; // Adiciona curingas para pesquisa "LIKE"
                return await conn.QueryAsync<ClienteDTO>(sql, new { SearchTerm = searchTerm });
            }

            return await conn.QueryAsync<ClienteDTO>(sql);
        }

        public async Task<ClienteDTO?> GetClienteById(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "SELECT ID_CLIENTE AS Id, NOME_COMPLETO AS NomeCompleto, EMAIL AS Email, TELEFONE AS Telefone, DATA_NASCIMENTO AS DataNascimento, OBSERVACOES AS Observacoes FROM Cliente WHERE ID_CLIENTE = @Id";
            return await conn.QueryFirstOrDefaultAsync<ClienteDTO>(sql, new { Id = id });
        }

        public async Task<int> AddCliente(CriarClienteDTO newCliente)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = @"
                INSERT INTO Cliente (NOME_COMPLETO, EMAIL, TELEFONE, DATA_NASCIMENTO, OBSERVACOES)
                VALUES (@NomeCompleto, @Email, @Telefone, @DataNascimento, @Observacoes);
                SELECT CAST(SCOPE_IDENTITY() as int);"; // Retorna o ID do cliente recém-criado

            return await conn.ExecuteScalarAsync<int>(sql, newCliente);
        }

        public async Task<bool> UpdateCliente(AtualizarClienteDTO updatedCliente)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = @"
                UPDATE Cliente
                SET
                    NOME_COMPLETO = @NomeCompleto,
                    EMAIL = @Email,
                    TELEFONE = @Telefone,
                    DATA_NASCIMENTO = @DataNascimento,
                    OBSERVACOES = @Observacoes,
                    DATA_ATUALIZACAO = GETDATE()
                WHERE ID_CLIENTE = @Id;";

            var affectedRows = await conn.ExecuteAsync(sql, updatedCliente);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteCliente(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "DELETE FROM Cliente WHERE ID_CLIENTE = @Id";
            var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });
            return affectedRows > 0;
        }
    }
}