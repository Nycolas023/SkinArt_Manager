using Dapper;
using Microsoft.Data.SqlClient;
using SkinArt_Manager.DTOs.UsuarioDTO;
using SkinArt_Manager.Models;
using System.Data;

// ----> Comentário

namespace SkinArt_Manager.Data
{
    public class UsuarioRepository(IConfiguration configuration)
    {
        private readonly string _connectionString = configuration.GetConnectionString("DefaultParkingConnection");

        public async Task<List<Usuario?>> GetUsuario()
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "SELECT * FROM Usuario";

            var response = await conn.QueryAsync<Usuario>(sql);

            if (!response.Any()) return null;

            return response.ToList();
        }

        public async Task<Usuario?> GetUsuarioById(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            string sql = "SELECT * FROM Usuario WHERE ID_USUARIO = @id";
            return await conn.QueryFirstOrDefaultAsync<Usuario>(sql, new { id });
        }

        #region Logins
        public async Task<LoginResponseDTO?> GetCredenciaisUsuarioAdmin(LoginRequestDTO credenciais)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new
            {
                LOGIN = credenciais.LOGIN_USUARIO,
                SENHA = credenciais.SENHA_USUARIO
            };

            var resultados = await conn.QueryAsync<dynamic>(
                "STP_LOGIN_ADMIN",
                parametros,
                commandType: CommandType.StoredProcedure
            );

            if (!resultados.Any()) return null;

            var primeiro = resultados.First();

            var response = new LoginResponseDTO
            {
                Usuario = new Usuario
                {
                    ID_USUARIO = primeiro.ID_USUARIO,
                    NOME_USUARIO = primeiro.NOME_USUARIO,
                    SOBRENOME_USUARIO = primeiro.SOBRENOME_USUARIO,
                    CPF_USUARIO = primeiro.CPF_USUARIO,
                    RG_USUARIO = primeiro.RG_USUARIO,
                    DATA_NASC_USUARIO = primeiro.DATA_NASC_USUARIO,
                    LOGIN_USUARIO = primeiro.LOGIN_USUARIO,
                    SENHA_USUARIO = primeiro.SENHA_USUARIO,
                    STATUS_USUARIO = primeiro.STATUS_USUARIO,
                    ULTIMO_LOGIN = primeiro.ULTIMO_LOGIN
                },
            };

            return response;
        }

        public async Task<LoginResponseDTO?> GetCredenciaisUsuarioTatuador(LoginRequestDTO credenciais)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new
            {
                LOGIN = credenciais.LOGIN_USUARIO,
                SENHA = credenciais.SENHA_USUARIO
            };

            var resultados = await conn.QueryAsync<dynamic>(
                "STP_LOGIN_TATUADOR",
                parametros,
                commandType: CommandType.StoredProcedure
            );

            if (!resultados.Any()) return null;

            var primeiro = resultados.First();

            var response = new LoginResponseDTO
            {
                Usuario = new Usuario
                {
                    ID_USUARIO = primeiro.ID_USUARIO,
                    NOME_USUARIO = primeiro.NOME_USUARIO,
                    SOBRENOME_USUARIO = primeiro.SOBRENOME_USUARIO,
                    CPF_USUARIO = primeiro.CPF_USUARIO,
                    RG_USUARIO = primeiro.RG_USUARIO,
                    DATA_NASC_USUARIO = primeiro.DATA_NASC_USUARIO,
                    LOGIN_USUARIO = primeiro.LOGIN_USUARIO,
                    SENHA_USUARIO = primeiro.SENHA_USUARIO,
                    STATUS_USUARIO = primeiro.STATUS_USUARIO,
                    ULTIMO_LOGIN = primeiro.ULTIMO_LOGIN
                },
            };

            return response;
        }

        #endregion

        #region Status
        public async Task<string> AtualizaStatus(AtualizaStatusDTO usuario)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new
            {
                ID_USUARIO = usuario.ID_USUARIO,
                STATUS = usuario.STATUS_USUARIO
            };

            var resultados = await conn.ExecuteAsync(
                "STP_ATUALIZA_STATUS",
                parametros,
                commandType: CommandType.StoredProcedure
            );

            return resultados > 0 ? "Usuário alterado com sucesso" : "Falha ao alterar o usuário";
        }

        #endregion

        public async Task<string> AtualizaUsuario(AtualizaUsuarioDTO usuario)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new
            {
                ID_USUARIO = usuario.ID_USUARIO,
                NOME_USUARIO = usuario.NOME_USUARIO,
                SOBRENOME_USUARIO = usuario.SOBRENOME_USUARIO,
                CPF_USUARIO = usuario.CPF_USUARIO,
                RG_USUARIO = usuario.RG_USUARIO,
                DATA_NASC_USUARIO = usuario.DATA_NASC_USUARIO,
                LOGIN_USUARIO = usuario.LOGIN_USUARIO,
                SENHA_USUARIO = usuario.SENHA_USUARIO,
            };

            var resultados = await conn.ExecuteAsync(
                "STP_ATUALIZA_USUARIO",
                parametros,
                commandType: CommandType.StoredProcedure
            );

            return resultados > 0 ? "Usuário alterado com sucesso" : "Falha ao alterar o usuário";
        }

        public async Task<string> DeleteUsuario(DeleteUsuarioDTO usuario)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new
            {
                ID_USUARIO = usuario.ID_USUARIO,
            };

            var resultados = await conn.ExecuteAsync(
                "STP_DELETA_USUARIO",
                parametros,
                commandType: CommandType.StoredProcedure
            );

            return resultados > 0 ? "Usuário deletado com sucesso" : "Falha ao alterar o usuário";
        }

        public async Task<Usuario?> CreateUsuario(CreateUsuarioDTO usuario)
        {
            using var conn = new SqlConnection(_connectionString);

            var parametros = new
            {
                NOME = usuario.NOME_USUARIO,
                SOBRENOME = usuario.SOBRENOME_USUARIO,
                CPF = usuario.CPF_USUARIO,
                RG = usuario.RG_USUARIO,
                DATA_NASC = usuario.DATA_NASC_USUARIO,
                LOGIN = usuario.LOGIN_USUARIO,
                SENHA = usuario.SENHA_USUARIO,
            };

            var resultados = await conn.QueryAsync<dynamic>(
                "STP_CRIAR_USUARIO",
                parametros,
                commandType: CommandType.StoredProcedure
            );

            if (!resultados.Any()) return null;

            var primeiro = resultados.First();

            return new Usuario
            {
                ID_USUARIO = primeiro.ID_USUARIO,
                NOME_USUARIO = primeiro.NOME_USUARIO,
                SOBRENOME_USUARIO = primeiro.SOBRENOME_USUARIO,
                CPF_USUARIO = primeiro.CPF_USUARIO,
                RG_USUARIO = primeiro.RG_USUARIO,
                DATA_NASC_USUARIO = primeiro.DATA_NASC_USUARIO,
                LOGIN_USUARIO = primeiro.LOGIN_USUARIO,
                SENHA_USUARIO = primeiro.SENHA_USUARIO,
                STATUS_USUARIO = primeiro.STATUS_USUARIO,
                ULTIMO_LOGIN = primeiro.ULTIMO_LOGIN
            };
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
