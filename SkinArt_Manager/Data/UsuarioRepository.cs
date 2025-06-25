using SkinArt_Manager.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using SkinArt_Manager.DTOs;

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

        public async Task<LoginRequest?> GetCredenciaisUsuario(LoginRequest credenciais)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new
            {
                LOGIN = credenciais.LOGIN_USUARIO,
                SENHA = credenciais.SENHA_USUARIO,
            };

            return await conn.QueryFirstOrDefaultAsync<LoginRequest>(
                "STP_LOGIN",
                parametros,
                commandType: System.Data.CommandType.StoredProcedure
            );
        }
    }
}
