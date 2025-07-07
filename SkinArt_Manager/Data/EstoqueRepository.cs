using Dapper;
using Microsoft.Data.SqlClient;
using SkinArt_Manager.DTOs.EstoqueDTO;

namespace SkinArt_Manager.Data
{
    public class EstoqueRepository
    {
        private readonly string _connectionString;

        public EstoqueRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultParkingConnection");
        }

        public async Task<IEnumerable<EstoqueItemDTO>> GetAllItensEstoque(string? categoria = null)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "SELECT ID_EstoqueItem AS Id, Categoria, NomeItem, Quantidade, Unidade, UsoPorSessao, EstoqueMinimo FROM EstoqueItem";

            if (!string.IsNullOrEmpty(categoria))
            {
                sql += " WHERE Categoria = @Categoria";
                return await conn.QueryAsync<EstoqueItemDTO>(sql, new { Categoria = categoria });
            }

            return await conn.QueryAsync<EstoqueItemDTO>(sql);
        }

        public async Task<EstoqueItemDTO?> GetItemEstoqueById(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "SELECT ID_EstoqueItem AS Id, Categoria, NomeItem, Quantidade, Unidade, UsoPorSessao, EstoqueMinimo FROM EstoqueItem WHERE ID_EstoqueItem = @Id";
            return await conn.QueryFirstOrDefaultAsync<EstoqueItemDTO>(sql, new { Id = id });
        }

        public async Task<IEnumerable<EstoqueItemDTO>> GetItensEstoqueBaixo()
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "SELECT ID_EstoqueItem AS Id, Categoria, NomeItem, Quantidade, Unidade, UsoPorSessao, EstoqueMinimo FROM EstoqueItem WHERE Quantidade < EstoqueMinimo";
            return await conn.QueryAsync<EstoqueItemDTO>(sql);
        }

        public async Task<int> AddItemEstoque(CriarEstoqueItemDTO newItem)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = @"
                INSERT INTO EstoqueItem (Categoria, NomeItem, Quantidade, Unidade, UsoPorSessao, EstoqueMinimo)
                VALUES (@Categoria, @NomeItem, @Quantidade, @Unidade, @UsoPorSessao, @EstoqueMinimo);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            return await conn.ExecuteScalarAsync<int>(sql, newItem);
        }

        public async Task<bool> UpdateItemEstoque(AtualizarEstoqueItemDTO item)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = @"
                UPDATE EstoqueItem
                SET
                    Categoria = @Categoria,
                    NomeItem = @NomeItem,
                    Quantidade = @Quantidade,
                    Unidade = @Unidade,
                    UsoPorSessao = @UsoPorSessao,
                    EstoqueMinimo = @EstoqueMinimo,
                    DataAtualizacao = GETDATE()
                WHERE ID_EstoqueItem = @Id;";

            var affectedRows = await conn.ExecuteAsync(sql, item);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteItemEstoque(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "DELETE FROM EstoqueItem WHERE ID_EstoqueItem = @Id";
            var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });
            return affectedRows > 0;
        }
    }
}