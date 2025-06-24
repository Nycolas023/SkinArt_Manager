using SkinArt_Manager.Models;
using Dapper;
using Microsoft.Data.SqlClient;

namespace SkinArt_Manager.Data
{
    public class UsuarioRepository(IConfiguration configuration)
    {
        private readonly string _connectionString = configuration.GetConnectionString("DefaultParkingConnection");

        public async Task<Usuario?> GetUsuario(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "SELECT * FROM Usuario WHERE ID_USUARIO = @id";
            return await conn.QueryFirstOrDefaultAsync<Usuario>(sql, new { id });
        }
    }
}
