using System.ComponentModel.DataAnnotations;
using GankLog.Models;

namespace GankLog.DTOs;

public class MatchDto
{
    public int Id { get; set; }
    public string Champion { get; set; } = "";
    public Role Role { get; set; }
    public MatchResult Result { get; set; }
    public int Kills { get; set; }
    public int Deaths { get; set; }
    public int Assists { get; set; }
    public double KDA { get; set; }
    public int DurationMinutes { get; set; }
    public DateTime PlayedAt { get; set; }
}

public class CreateMatchDto
{
    [Required]
    [MaxLength(30)]
    public string Champion { get; set; } = "";

    [Required]
    public Role Role { get; set; }

    [Required]
    public MatchResult Result { get; set; }

    [Range(0, 50)]
    public int Kills { get; set; }

    [Range(0, 50)]
    public int Deaths { get; set; }

    [Range(0, 50)]
    public int Assists { get; set; }

    [Range(1, 120)]
    public int DurationMinutes { get; set; }
}