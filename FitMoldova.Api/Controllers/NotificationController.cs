using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/notification")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationLogic _notificationLogic;

    public NotificationController(IMapper mapper)
    {
        var bl = new BusinessLogic(mapper);
        _notificationLogic = bl.NotificationLogic();
    }

    // GET api/notification
    // Returnează toate notificările utilizatorului autentificat
    [HttpGet]
    public IActionResult GetForUser()
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _notificationLogic.GetForUser(userId);
        return Ok(result);
    }

    // GET api/notification/unread-count
    // Returnează numărul de notificări necitite (folosit pentru badge-ul din navbar)
    [HttpGet("unread-count")]
    public IActionResult GetUnreadCount()
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _notificationLogic.GetUnreadCount(userId);
        return Ok(result);
    }

    // PATCH api/notification/42/read
    // Marchează o notificare ca citită
    [HttpPatch("{id}/read")]
    public IActionResult MarkAsRead(int id)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _notificationLogic.MarkAsRead(id, userId);
        if (!result.isSuccess)
            return NotFound(result);
        return Ok(result);
    }

    // PATCH api/notification/read-all
    // Marchează toate notificările ca citite
    [HttpPatch("read-all")]
    public IActionResult MarkAllAsRead()
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _notificationLogic.MarkAllAsRead(userId);
        return Ok(result);
    }

    // DELETE api/notification/42
    // Șterge o notificare
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _notificationLogic.Delete(id, userId);
        if (!result.isSuccess)
            return NotFound(result);
        return NoContent();
    }
}
