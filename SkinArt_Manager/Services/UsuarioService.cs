using SkinArt_Manager.Data;
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
    }
}
