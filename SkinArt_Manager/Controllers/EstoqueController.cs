using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.DTOs.EstoqueDTO;
using SkinArt_Manager.Services;

[ApiController]
[Route("api/[controller]")]
public class EstoqueController : ControllerBase
{
    private readonly EstoqueService _estoqueService;

    public EstoqueController(EstoqueService estoqueService)
    {
        _estoqueService = estoqueService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EstoqueItemDTO>>> GetEstoque([FromQuery] string? categoria = null)
    {
        var itens = await _estoqueService.GetAllEstoqueItens(categoria);
        return Ok(itens);
    }

    [HttpGet("baixo")]
    public async Task<ActionResult<IEnumerable<EstoqueItemDTO>>> GetEstoqueBaixo()
    {
        var itens = await _estoqueService.GetEstoqueItensBaixo();
        return Ok(itens);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EstoqueItemDTO>> GetEstoqueItem(int id)
    {
        var item = await _estoqueService.GetEstoqueItemById(id);
        if (item == null)
        {
            return NotFound();
        }
        return Ok(item);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<EstoqueItemDTO>> AddEstoqueItem([FromBody] CriarEstoqueItemDTO newItem)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var newId = await _estoqueService.AddItemEstoque(newItem);
        if (newId > 0)
        {
            var createdItem = await _estoqueService.GetEstoqueItemById(newId);
            return CreatedAtAction(nameof(GetEstoqueItem), new { id = newId }, createdItem);
        }
        return BadRequest("Não foi possível adicionar o item.");
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateEstoqueItem(int id, [FromBody] AtualizarEstoqueItemDTO updatedItem)
    {
        if (id != updatedItem.Id)
        {
            return BadRequest("O ID do item na URL não corresponde ao ID no corpo da requisição.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var success = await _estoqueService.UpdateEstoqueItem(updatedItem);
        if (success)
        {
            return NoContent();
        }
        return NotFound("Item de estoque não encontrado ou falha na atualização.");
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteEstoqueItem(int id)
    {
        var success = await _estoqueService.DeleteItemEstoque(id);
        if (success)
        {
            return NoContent();
        }
        return NotFound("Item de estoque não encontrado.");
    }
}