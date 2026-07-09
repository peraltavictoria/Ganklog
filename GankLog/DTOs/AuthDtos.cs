using System.ComponentModel.DataAnnotations;

namespace GankLog.DTOs;

public class RegisterDto
{
    [Required]
    [MaxLength(30)]
    public string Username { get; set; } = "";

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = "";

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = "";

    [MaxLength(30)]
    public string Rank { get; set; } = "Sin rango";

    [MaxLength(30)]
    public string Region { get; set; } = "LAS";
}

public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    public string Password { get; set; } = "";
}

public class AuthResponseDto
{
    public string Token { get; set; } = "";
    public int PlayerId { get; set; }
    public string Username { get; set; } = "";
}