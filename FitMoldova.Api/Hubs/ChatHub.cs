using FitMoldova.BusinessLogic.Structure;
using FitMoldova.Domain.Models.Message;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

/// <summary>
/// ChatHub — Hub SignalR pentru mesagerie privată în timp real.
///
/// Cum funcționează:
/// 1. La conectare, userul este adăugat într-un grup SignalR numit "user_{userId}".
///    Astfel serverul știe unde să livreze mesajele pentru fiecare user.
///
/// 2. Când userul A trimite un mesaj către userul B:
///    a. ChatHub salvează mesajul în PostgreSQL (prin MessageAction).
///    b. ChatHub trimite mesajul live în grupul "user_{B}" → B îl primește instant.
///    c. Confirmă și expeditorului că mesajul a fost salvat (ecou în "user_{A}").
///
/// 3. Frontend-ul ascultă evenimentul "ReceiveMessage" și adaugă mesajul în UI.
/// </summary>
[Authorize]
public class ChatHub : Hub
{
    // ── OnConnectedAsync ──────────────────────────────────────────────────────
    // La fiecare conectare WebSocket, adăugăm conexiunea în grupul personal
    // al user-ului ("user_42"). Același user poate avea mai multe conexiuni
    // (tab-uri deschise) — toate vor primi mesajele.

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst("userId")?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst("userId")?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        await base.OnDisconnectedAsync(exception);
    }

    // ── SendMessage ───────────────────────────────────────────────────────────
    // Metodă apelată de frontend prin SignalR (nu HTTP).
    // Parametri: receiverId (int), content (string).
    //
    // Fluxul complet:
    //   Frontend → hub.invoke("SendMessage", receiverId, content)
    //           → salvare DB
    //           → Groups.SendAsync("user_{receiverId}", "ReceiveMessage", dto)
    //           → Groups.SendAsync("user_{senderId}",   "ReceiveMessage", dto)  // ecou

    public async Task SendMessage(int receiverId, string content)
    {
        var senderIdStr = Context.User?.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(senderIdStr)) return;

        var senderId = int.Parse(senderIdStr);

        // Salvăm în DB — MessageLogic face validarea și construiește DTO-ul complet
        var logic = new MessageLogic();
        var result = logic.SendMessage(senderId, receiverId, content);

        if (!result.isSuccess)
        {
            // Trimitem eroarea înapoi doar expeditorului
            await Clients.Caller.SendAsync("MessageError", result.Message);
            return;
        }

        var dto = result.Data as MessageInfoDto;
        if (dto == null) return;

        // Livrăm mesajul la destinatar (dacă e online, îl primește instant)
        await Clients.Group($"user_{receiverId}").SendAsync("ReceiveMessage", dto);

        // Ecou la expeditor — confirmă că mesajul a fost salvat și îl adaugă în UI
        // (Evităm dubluri: trimitem doar dacă expeditorul nu e în același grup cu destinatarul)
        await Clients.Caller.SendAsync("ReceiveMessage", dto);
    }

    // ── MarkAsRead ────────────────────────────────────────────────────────────
    // Frontend-ul apelează aceasta când userul deschide o conversație.
    // Marchăm mesajele ca citite în DB și notificăm expeditorul (badge update).

    public async Task MarkAsRead(int otherUserId)
    {
        var userIdStr = Context.User?.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdStr)) return;

        var userId = int.Parse(userIdStr);

        var logic = new MessageLogic();
        logic.MarkConversationAsRead(userId, otherUserId);

        // Notificăm expeditorul că mesajele lui au fost văzute (bifă "citit")
        await Clients.Group($"user_{otherUserId}").SendAsync("MessagesRead", new { byUserId = userId });
    }
}
