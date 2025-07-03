using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.DTOs;
using SkinArt_Manager.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient; // Use este em vez de System.Data.SqlClient

// ----> Comentário

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class ClienteController : ControllerBase
{
    private readonly ClienteService _clienteService;

    public ClienteController(ClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClienteDTO>>> GetClientes([FromQuery] string? searchTerm = null)
    {
        var clientes = await _clienteService.GetAllClientes(searchTerm);
        return Ok(clientes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteDTO>> GetCliente(int id)
    {
        var cliente = await _clienteService.GetClienteById(id);
        if (cliente == null)
        {
            return NotFound();
        }
        return Ok(cliente);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ClienteDTO>> AddCliente([FromBody] CriarClienteDTO newCliente)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var newId = await _clienteService.AddCliente(newCliente);
            if (newId > 0)
            {
                var createdCliente = await _clienteService.GetClienteById(newId);
                return CreatedAtAction(nameof(GetCliente), new { id = newId }, createdCliente);
            }
            return BadRequest("Não foi possível adicionar o cliente.");
        }
        catch (SqlException ex) when (ex.Message.Contains("UNIQUE KEY"))
        {
            return Conflict("Já existe um cliente cadastrado com este e-mail.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Erro interno: " + ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateCliente(int id, [FromBody] AtualizarClienteDTO updatedCliente)
    {
        if (id != updatedCliente.Id)
        {
            return BadRequest("O ID do cliente na URL não corresponde ao ID no corpo da requisição.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var success = await _clienteService.UpdateCliente(updatedCliente);
        if (success)
        {
            return NoContent();
        }
        return NotFound("Cliente não encontrado ou falha na atualização.");
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        var success = await _clienteService.DeleteCliente(id);
        if (success)
        {
            return NoContent();
        }
        return NotFound("Cliente não encontrado.");
    }
}