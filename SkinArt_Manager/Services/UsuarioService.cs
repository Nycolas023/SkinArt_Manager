using SkinArt_Manager.Data;
using SkinArt_Manager.DTOs;
using SkinArt_Manager.Models;

namespace SkinArt_Manager.Services
{
    public class UsuarioService
    {
        private readonly UsuarioRepository repository;

        public UsuarioService(UsuarioRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Usuario?> UsuarioRetornaUsuarioTeste(int id) 
        {
            return await repository.GetUsuario(id);
        }

        public async Task<LoginResponseDTO?> GetLogin(LoginRequestDTO credenciais)
        {
            return await repository.GetCredenciaisUsuario(credenciais);
        }

        public async Task<List<RetornaFuncionalidadeDTO>> GetFuncionalidades(int id)
        {
            return await repository.GetFuncionalidades(id);
        }
    }
}
