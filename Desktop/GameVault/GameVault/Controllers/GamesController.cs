using Microsoft.AspNetCore.Mvc;
using GameVault.Models;
using GameVault.Data;
using Microsoft.EntityFrameworkCore;

namespace GameVault.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly GameVaultDbContext _context;

    public GamesController(GameVaultDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Game>>> GetGames()
    {
        return await _context.Games.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Game>> GetGameById(int id)
    {
        var game = await _context.Games.FindAsync(id);

        if (game == null)
            return NotFound();

        return game;
    }

    [HttpPost]
    public async Task<ActionResult<Game>> CreateGame(Game game)
    {     
        if(!ModelState.IsValid)
           return BadRequest(ModelState); 
           
        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        return Ok(game);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateGame(int id, Game updatedGame)
    {
        var game = await _context.Games.FindAsync(id);

        if (game == null)
            return NotFound();

        game.Title = updatedGame.Title;
        game.Genre = updatedGame.Genre;
        game.Platform = updatedGame.Platform;
        game.Status = updatedGame.Status;

        await _context.SaveChangesAsync();

        return Ok(game);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteGame(int id)
    {
        var game = await _context.Games.FindAsync(id);

        if (game == null)
            return NotFound();

        _context.Games.Remove(game);
        await _context.SaveChangesAsync();

        return Ok();
    }
}