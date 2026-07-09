using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using GankLog.Data;
using GankLog.Models;
using GankLog.DTOs;

namespace GankLog.Controllers;

[ApiController]
[Authorize]
[Route("api/players/{playerId}/[controller]")]
public class MatchesController : ControllerBase
{
    private readonly GankLogDbContext _context;

    public MatchesController(GankLogDbContext context)
    {
        _context = context;
    }
     private bool IsOwner(int playerId)
    {
        var tokenPlayerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return tokenPlayerId != null && int.Parse(tokenPlayerId) == playerId;
    }

    [HttpGet]
    public async Task<ActionResult<List<MatchDto>>> GetMatches(
        int playerId, [FromQuery] Role? role, [FromQuery] string? champion)
    {    
        if (!IsOwner(playerId))
            return Forbid();

        var playerExists = await _context.Players.AnyAsync(p => p.Id == playerId);
        if (!playerExists)
            return NotFound("Jugador no encontrado.");

        var query = _context.Matches.Where(m => m.PlayerId == playerId);

        if (role.HasValue)
            query = query.Where(m => m.Role == role.Value);

        if (!string.IsNullOrWhiteSpace(champion))
            query = query.Where(m => m.Champion == champion);

        var matches = await query
            .OrderByDescending(m => m.PlayedAt)
            .Select(m => ToDto(m))
            .ToListAsync();

        return Ok(matches);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MatchDto>> GetMatchById(int playerId, int id)
    {   if (!IsOwner(playerId))
             return Forbid();

        var match = await _context.Matches
            .FirstOrDefaultAsync(m => m.Id == id && m.PlayerId == playerId);

        if (match == null)
            return NotFound();

        return Ok(ToDto(match));
    }

    [HttpPost]
    public async Task<ActionResult<MatchDto>> CreateMatch(int playerId, CreateMatchDto dto)
    {    if (!IsOwner(playerId))
            return Forbid();

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var playerExists = await _context.Players.AnyAsync(p => p.Id == playerId);
        if (!playerExists)
            return NotFound("Jugador no encontrado.");

        var match = new Match
        {
            PlayerId = playerId,
            Champion = dto.Champion,
            Role = dto.Role,
            Result = dto.Result,
            Kills = dto.Kills,
            Deaths = dto.Deaths,
            Assists = dto.Assists,
            DurationMinutes = dto.DurationMinutes,
            PlayedAt = DateTime.UtcNow
        };

        _context.Matches.Add(match);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMatchById), new { playerId, id = match.Id }, ToDto(match));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateMatch(int playerId, int id, CreateMatchDto dto)
    {    if (!IsOwner(playerId))
            return Forbid();

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var match = await _context.Matches
            .FirstOrDefaultAsync(m => m.Id == id && m.PlayerId == playerId);

        if (match == null)
            return NotFound();

        match.Champion = dto.Champion;
        match.Role = dto.Role;
        match.Result = dto.Result;
        match.Kills = dto.Kills;
        match.Deaths = dto.Deaths;
        match.Assists = dto.Assists;
        match.DurationMinutes = dto.DurationMinutes;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMatch(int playerId, int id)
    {    
        if (!IsOwner(playerId))
            return Forbid();
        var match = await _context.Matches
            .FirstOrDefaultAsync(m => m.Id == id && m.PlayerId == playerId);

        if (match == null)
            return NotFound();

        _context.Matches.Remove(match);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static MatchDto ToDto(Match m) => new()
    {
        Id = m.Id,
        Champion = m.Champion,
        Role = m.Role,
        Result = m.Result,
        Kills = m.Kills,
        Deaths = m.Deaths,
        Assists = m.Assists,
        KDA = m.Deaths == 0 ? m.Kills + m.Assists : Math.Round((double)(m.Kills + m.Assists) / m.Deaths, 2),
        DurationMinutes = m.DurationMinutes,
        PlayedAt = m.PlayedAt
    };
}