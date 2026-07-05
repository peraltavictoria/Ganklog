using System.ComponentModel.DataAnnotations;

namespace GameVault.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string Username { get; set; } = "";

    public List<Game> Games { get; set; } = new();
}