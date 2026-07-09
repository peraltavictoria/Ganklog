using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GankLog.Data;
using GankLog.Models;
using GankLog.DTOs;

namespace GankLog.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly GankLogDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(GankLogDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var emailTaken = await _context.Players.AnyAsync(p => p.Email == dto.Email);
        if (emailTaken)
            return Conflict("Ese email ya está registrado.");

        var player = new Player
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Rank = dto.Rank,
            Region = dto.Region
        };

        _context.Players.Add(player);
        await _context.SaveChangesAsync();

        return Ok(new AuthResponseDto
        {
            Token = GenerateToken(player),
            PlayerId = player.Id,
            Username = player.Username
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var player = await _context.Players.FirstOrDefaultAsync(p => p.Email == dto.Email);

        if (player == null || !BCrypt.Net.BCrypt.Verify(dto.Password, player.PasswordHash))
            return Unauthorized("Email o contraseña incorrectos.");

        return Ok(new AuthResponseDto
        {
            Token = GenerateToken(player),
            PlayerId = player.Id,
            Username = player.Username
        });
    }

    private string GenerateToken(Player player)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, player.Id.ToString()),
            new Claim(ClaimTypes.Name, player.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}