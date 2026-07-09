using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GankLog.Data;
using GankLog.Models;
using GankLog.DTOs;

namespace GankLog.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly GankLogDbContext _context;

    public PlayersController(GankLogDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<PlayerDto>>> GetPlayers()
    {
        var players = await _context.Players
            .Select(p => new PlayerDto
            {
                Id = p.Id,
                Username = p.Username,
                Rank = p.Rank,
                Region = p.Region
            })
            .ToListAsync();

        return Ok(players);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PlayerDto>> GetPlayerById(int id)
    {
        var player = await _context.Players.FindAsync(id);

        if (player == null)
            return NotFound();

        return Ok(new PlayerDto
        {
            Id = player.Id,
            Username = player.Username,
            Rank = player.Rank,
            Region = player.Region
        });
    }

    [HttpPost]
    public async Task<ActionResult<PlayerDto>> CreatePlayer(CreatePlayerDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var usernameTaken = await _context.Players.AnyAsync(p => p.Username == dto.Username);
        if (usernameTaken)
            return Conflict("Ya existe un jugador con ese username.");

        var player = new Player
        {
            Username = dto.Username,
            Rank = dto.Rank,
            Region = dto.Region
        };

        _context.Players.Add(player);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPlayerById), new { id = player.Id }, new PlayerDto
        {
            Id = player.Id,
            Username = player.Username,
            Rank = player.Rank,
            Region = player.Region
        });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdatePlayer(int id, CreatePlayerDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var player = await _context.Players.FindAsync(id);
        if (player == null)
            return NotFound();

        player.Username = dto.Username;
        player.Rank = dto.Rank;
        player.Region = dto.Region;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePlayer(int id)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null)
            return NotFound();

        _context.Players.Remove(player);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{id}/stats")]
    public async Task<ActionResult<PlayerStatsDto>> GetPlayerStats(int id)
    {
        var player = await _context.Players
            .Include(p => p.Matches)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (player == null)
            return NotFound();

        var matches = player.Matches;

        if (matches.Count == 0)
        {
            return Ok(new PlayerStatsDto
            {
                PlayerId = player.Id,
                Username = player.Username,
                TotalMatches = 0,
                Wins = 0,
                Losses = 0,
                WinRatePercent = 0,
                AverageKDA = 0,
                MostPlayedChampion = null,
                BestWinRateChampion = null
            });
        }

        var wins = matches.Count(m => m.Result == Models.MatchResult.Win);
        var losses = matches.Count - wins;

        var avgKda = matches.Average(m =>
            m.Deaths == 0 ? m.Kills + m.Assists : (double)(m.Kills + m.Assists) / m.Deaths);

        var mostPlayed = matches
            .GroupBy(m => m.Champion)
            .OrderByDescending(g => g.Count())
            .First()
            .Key;

        var bestWinRateChampion = matches
            .GroupBy(m => m.Champion)
            .Select(g => new
            {
                Champion = g.Key,
                WinRate = g.Count(m => m.Result == Models.MatchResult.Win) / (double)g.Count()
            })
            .OrderByDescending(g => g.WinRate)
            .First()
            .Champion;

        return Ok(new PlayerStatsDto
        {
            PlayerId = player.Id,
            Username = player.Username,
            TotalMatches = matches.Count,
            Wins = wins,
            Losses = losses,
            WinRatePercent = Math.Round(wins / (double)matches.Count * 100, 1),
            AverageKDA = Math.Round(avgKda, 2),
            MostPlayedChampion = mostPlayed,
            BestWinRateChampion = bestWinRateChampion
        });
    }
}