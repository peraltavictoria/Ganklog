using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameVault.Data;
using GameVault.Models;

namespace GameVault.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly GameVaultDbContext _context;

    public UsersController(GameVaultDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(user);
    }

    // 🔥 juegos de un usuario
    [HttpGet("{id}/games")]
    public async Task<ActionResult> GetUserGames(int id)
    {
        var user = await _context.Users
            .Include(u => u.Games)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound();

        return Ok(user.Games);
    }
}