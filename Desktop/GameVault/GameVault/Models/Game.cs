using System.ComponentModel.DataAnnotations;
namespace GameVault.Models;

public class Game
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Title { get; set; } = "";

    [Required]
    public string Genre { get; set; } = "";

    [Required]
    public string Platform { get; set; } = "";

    [Required]
    public string Status { get; set; } = "";
    //relaciones con user
    public int UserId { get; set; }
    public User? User { get; set; }
}