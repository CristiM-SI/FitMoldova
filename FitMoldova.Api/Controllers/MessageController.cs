using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.BusinessLogic.Structure;
using FitMoldova.Domain.Models.Message;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/messages")]
[Authorize]
public class MessageController : ControllerBase
{
    private readonly IMessageLogic _messageLogic;

    public MessageController()
    {
        _messageLogic = new MessageLogic();
    }

    // GET api/messages/conversations
    // Lista tuturor conversațiilor utilizatorului curent (pentru sidebar)
    [HttpGet("conversations")]
    public IActionResult GetConversations()
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _messageLogic.GetConversations(userId);
        return Ok(result);
    }

    // GET api/messages/{otherUserId}
    // Istoricul mesajelor dintre utilizatorul curent și alt user
    [HttpGet("{otherUserId:int}")]
    public IActionResult GetMessages(int otherUserId)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _messageLogic.GetMessages(userId, otherUserId);
        return Ok(result);
    }

    // POST api/messages
    // Trimite un mesaj (REST fallback dacă SignalR nu e disponibil)
    [HttpPost]
    public IActionResult SendMessage([FromBody] MessageCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Content))
            return BadRequest(new { isSuccess = false, message = "Conținut invalid." });

        var senderId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _messageLogic.SendMessage(senderId, dto.ReceiverId, dto.Content);

        if (!result.isSuccess)
            return BadRequest(result);

        return Ok(result);
    }

    // PATCH api/messages/{otherUserId}/read
    // Marchează toate mesajele dintr-o conversație ca citite
    [HttpPatch("{otherUserId:int}/read")]
    public IActionResult MarkAsRead(int otherUserId)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _messageLogic.MarkConversationAsRead(userId, otherUserId);
        return Ok(result);
    }

    // GET api/messages/unread-count
    // Numărul total de mesaje necitite (pentru badge în navbar)
    [HttpGet("unread-count")]
    public IActionResult GetUnreadCount()
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _messageLogic.GetUnreadCount(userId);
        return Ok(result);
    }

    // DELETE api/messages/{messageId}
    // Șterge un mesaj (soft delete — doar expeditorul poate șterge)
    [HttpDelete("{messageId:int}")]
    public IActionResult DeleteMessage(int messageId)
    {
        var senderId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _messageLogic.DeleteMessage(messageId, senderId);

        if (!result.isSuccess)
            return NotFound(result);

        return Ok(result);
    }
}
