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

        public async Task<LoginRequest?> GetLogin(LoginRequest credenciais)
        {
            return await repository.GetCredenciaisUsuario(credenciais);
        }
    }
}
