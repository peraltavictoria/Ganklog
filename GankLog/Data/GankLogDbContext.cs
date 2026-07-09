using Microsoft.EntityFrameworkCore;
using GankLog.Models;

namespace GankLog.Data;

public class GankLogDbContext : DbContext
{
    public GankLogDbContext(DbContextOptions<GankLogDbContext> options)
        : base(options)
    {
    }

    public DbSet<Player> Players { get; set; }
    public DbSet<Match> Matches { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Player>()
            .HasIndex(p => p.Email)
            .IsUnique();

        modelBuilder.Entity<Match>()
            .HasOne(m => m.Player)
            .WithMany(p => p.Matches)
            .HasForeignKey(m => m.PlayerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}