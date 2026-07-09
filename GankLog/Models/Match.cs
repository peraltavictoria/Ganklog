using System.ComponentModel.DataAnnotations;

namespace GankLog.Models;

public class Match
{
    public int Id { get; set; }

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

    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;

    public int PlayerId { get; set; }
    public Player? Player { get; set; }
}