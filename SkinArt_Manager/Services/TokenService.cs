using Microsoft.IdentityModel.Tokens;
using SkinArt_Manager.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SkinArt_Manager.Services
{
    public class TokenService
    {
        public static string? GenerateToken(LoginRequest usuario)
        {
            var key = Encoding.ASCII.GetBytes(Configuration.PrivateKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.Name, usuario.LOGIN_USUARIO)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.CreateToken(tokenDescriptor) is SecurityToken token
                ? tokenHandler.WriteToken(token)
                : null;
        }
    }
}
