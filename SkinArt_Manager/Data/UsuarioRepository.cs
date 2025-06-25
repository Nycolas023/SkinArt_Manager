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

        public async Task<LoginResponseDTO?> GetCredenciaisUsuario(LoginRequestDTO credenciais)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new
            {
                LOGIN = credenciais.LOGIN_USUARIO,
                SENHA = credenciais.SENHA_USUARIO
            };

            var resultado = await conn.QueryFirstOrDefaultAsync(
                "STP_LOGIN",
                parametros,
                commandType: System.Data.CommandType.StoredProcedure
            );

            if (resultado == null) return null;

            //PAREI AQUI ESTA COM BUG
            var response = new LoginResponseDTO
            {
                Usuario = new Usuario
                {
                    ID_USUARIO = resultado.ID_USUARIO,
                    NOME_USUARIO = resultado.NOME_USUARIO,
                    SOBRENOME_USUARIO = resultado.SOBRENOME_USUARIO,
                    DATA_NASC_USUARIO = resultado.DATA_NASC_USUARIO,
                    CPF_USUARIO = resultado.CPF_USUARIO,
                    RG_USUARIO = resultado.RG_USUARIO,
                    LOGIN_USUARIO = resultado.LOGIN_USUARIO,
                    SENHA_USUARIO = resultado.SENHA_USUARIO,
                    ALERGIA_USUARIO = resultado.ALERGIA_USUARIO,
                    AUTORIZACAO_MENOR_USUARIO = resultado.AUTORIZACAO_MENOR_USUARIO
                },
                NOME_PAPEL = resultado.NOME_PAPEL 
            };

            return response;
        }


        public async Task<List<RetornaFuncionalidadeDTO>> GetFuncionalidades(int id)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new
            {
                ID_USUARIO = id,
            };

            var resultado = await conn.QueryAsync<RetornaFuncionalidadeDTO>(
                "STP_RETORNA_FUNCIONALIDADES_USUARIO",
                parametros,
                commandType: System.Data.CommandType.StoredProcedure
            );

            return resultado.ToList();
        }
    }
}



//--EXEC STP_LOGIN 'joao.silva', 'senha123'
//--EXEC STP_RETORNA_FUNCIONALIDADES_USUARIO 1
//--EXEC STP_DELETA_USUARIO 2
//--EXEC sp_atualizar_usuario 
//--	@ID_USUARIO = 1,
//--	@NOME_USUARIO = 'Carlos',
//--	@SOBRENOME_USUARIO = 'Moraes',
//--	@DATA_NASC_USUARIO = '1991-01-01',
//--	@CPF_USUARIO = '123.456.789-00',
//--	@RG_USUARIO = '12.345.678-9',
//--	@LOGIN_USUARIO = 'carlos.m',
//--	@SENHA_USUARIO = 'novasenha456';
