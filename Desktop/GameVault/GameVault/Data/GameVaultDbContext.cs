using Microsoft.EntityFrameworkCore;
using GameVault.Models;

namespace GameVault.Data;

public class GameVaultDbContext : DbContext
{
    public GameVaultDbContext(DbContextOptions<GameVaultDbContext> options)
        : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Game> Games { get; set; }
}