using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinArt_Manager.DTOs;
using SkinArt_Manager.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AgendamentoController : ControllerBase
{
    private readonly AgendamentoService _agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService)
    {
        _agendamentoService = agendamentoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AgendamentoDTO>>> GetAgendamentos(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int? tatuadorId = null,
        [FromQuery] int? statusId = null)
    {
        var agendamentos = await _agendamentoService.GetAgendamentosFiltrados(startDate, endDate, tatuadorId, statusId);
        return Ok(agendamentos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AgendamentoDTO>> GetAgendamento(int id)
    {
        var agendamento = await _agendamentoService.GetAgendamentoById(id);
        if (agendamento == null)
        {
            return NotFound();
        }
        return Ok(agendamento);
    }

    [HttpPost]
    public async Task<ActionResult<AgendamentoDTO>> AddAgendamento([FromBody] CriarAgendamentoDTO newAgendamento)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var newId = await _agendamentoService.AddAgendamento(newAgendamento);
            if (newId > 0)
            {
                var createdAgendamento = await _agendamentoService.GetAgendamentoById(newId);
                return CreatedAtAction(nameof(GetAgendamento), new { id = newId }, createdAgendamento);
            }
            return BadRequest("Não foi possível adicionar o agendamento.");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "Ocorreu um erro interno ao adicionar o agendamento.");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAgendamento(int id, [FromBody] AtualizarAgendamentoDTO updatedAgendamento)
    {
        if (id != updatedAgendamento.Id)
        {
            return BadRequest("O ID do agendamento na URL não corresponde ao ID no corpo da requisição.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var success = await _agendamentoService.UpdateAgendamento(updatedAgendamento);
            if (success)
            {
                return NoContent();
            }
            return NotFound("Agendamento não encontrado.");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "Ocorreu um erro interno ao atualizar o agendamento.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAgendamento(int id)
    {
        var success = await _agendamentoService.DeleteAgendamento(id);
        if (success)
        {
            return NoContent();
        }
        return NotFound("Agendamento não encontrado.");
    }

    [HttpGet("tatuadores-dropdown")]
    public async Task<ActionResult<IEnumerable<TatuadorDropdownDTO>>> GetTatuadoresParaDropdown()
    {
        var tatuadores = await _agendamentoService.GetTatuadoresParaDropdown();
        return Ok(tatuadores);
    }

    [HttpGet("status-dropdown")]
    public async Task<ActionResult<IEnumerable<StatusAgendamentoDTO>>> GetStatusAgendamentoParaDropdown()
    {
        var status = await _agendamentoService.GetStatusAgendamentoParaDropdown();
        return Ok(status);
    }
}