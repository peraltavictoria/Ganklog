using System.ComponentModel.DataAnnotations;

namespace GankLog.DTOs;

public class PlayerDto
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string Rank { get; set; } = "";
    public string Region { get; set; } = "";
}

public class CreatePlayerDto
{
    [Required]
    [MaxLength(30)]
    public string Username { get; set; } = "";

    [MaxLength(30)]
    public string Rank { get; set; } = "Sin rango";

    [MaxLength(30)]
    public string Region { get; set; } = "LAS";
}

public class PlayerStatsDto
{
    public int PlayerId { get; set; }
    public string Username { get; set; } = "";
    public int TotalMatches { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public double WinRatePercent { get; set; }
    public double AverageKDA { get; set; }
    public string? MostPlayedChampion { get; set; }
    public string? BestWinRateChampion { get; set; }
}