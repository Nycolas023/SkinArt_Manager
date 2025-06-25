using Microsoft.IdentityModel.Tokens;
using SkinArt_Manager.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SkinArt_Manager.Services
{
    public class TokenService
    {
        public static string GenerateToken(LoginResponseDTO usuario)
        {
            var key = Encoding.ASCII.GetBytes(Configuration.PrivateKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, usuario.Usuario.LOGIN_USUARIO),
            new Claim(ClaimTypes.Role, usuario.NOME_PAPEL) // Papel para [Authorize(Roles="...")]
        }),
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
