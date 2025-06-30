using SkinArt_Manager.Data;
using SkinArt_Manager.DTOs.UsuarioDTO;
using SkinArt_Manager.Models;
using System.Text;

namespace SkinArt_Manager.Services
{
    // ----> Comentário
    public class UsuarioService
    {
        private readonly UsuarioRepository repository;

        public UsuarioService(UsuarioRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Usuario?> CreateUsuario(CreateUsuarioDTO usuario)
        {
            return await repository.CreateUsuario(usuario);
        }

        public async Task<List<Usuario?>> UsuarioRetornaTodosUsuarios() 
        {
            return await repository.GetUsuario();
        }

        public async Task<LoginResponseDTO?> GetLoginAdmin(LoginRequestDTO credenciais)
        {
            return await repository.GetCredenciaisUsuarioAdmin(credenciais);
        }

        public async Task<LoginResponseDTO?> GetLoginTatuador(LoginRequestDTO credenciais)
        {
            return await repository.GetCredenciaisUsuarioTatuador(credenciais);
        }

        public async Task<string> SetStatus(AtualizaStatusDTO atualizaStatus)
        {
            return await repository.AtualizaStatus(atualizaStatus);
        }

        public async Task<string> SetUsuario(AtualizaUsuarioDTO usuario)
        {
            return await repository.AtualizaUsuario(usuario);
        }

        public async Task<string> DeleteUsuario(DeleteUsuarioDTO usuario)
        {
            return await repository.DeleteUsuario(usuario);
        }
    }
}
