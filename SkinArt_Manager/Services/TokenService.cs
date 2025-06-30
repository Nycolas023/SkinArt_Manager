using Microsoft.IdentityModel.Tokens;
using SkinArt_Manager.DTOs.UsuarioDTO;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SkinArt_Manager.Services
{
    // ----> Comentário
    public class TokenService
    {
        public static string GenerateToken(LoginResponseDTO usuario)
        {
            var key = Encoding.ASCII.GetBytes(Configuration.PrivateKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, usuario.Usuario.LOGIN_USUARIO)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


    }
}
