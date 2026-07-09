using System.ComponentModel.DataAnnotations;

namespace GankLog.Models;

public class Player
{
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(30)]
    public string Username { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";

    [MaxLength(30)]
    public string Rank { get; set; } = "Sin rango";

    [MaxLength(30)]
    public string Region { get; set; } = "LAS";

    public List<Match> Matches { get; set; } = new();
}