// src/services/signalRService.ts
//
// Singleton SignalR pentru notificări push în timp real.
// Se conectează la /hubs/notifications și trimite JWT-ul din localStorage.
//
// Folosire (ex. în AuthContext sau NotificationsPage):
//   import { signalRService } from '../services/signalRService';
//   signalRService.start(token);
//   signalRService.on('ReceiveNotification', (notif) => { ... });
//   signalRService.off('ReceiveNotification', handler);
//   // La logout:
//   signalRService.stop();

import * as signalR from '@microsoft/signalr';

const SIGNALR_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : 'http://localhost:5296';

const HUB_URL = `${SIGNALR_BASE}/hubs/notifications`;

// Tipul payload-ului trimis de NotificationHub
export interface SignalRNotification {
  type: 'club_post' | 'like' | 'follow' | 'reply' | string;
  content: string;
  postId?: number;
  clubId?: number;
  fromUserId: number;
  createdAt: string;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private token: string | null = null;

  /** Pornește conexiunea (dacă nu e deja pornită). */
  async start(token: string): Promise<void> {
    // Dacă deja conectat cu același token — nu refacem conexiunea
    if (
      this.connection &&
      this.token === token &&
      this.connection.state === signalR.HubConnectionState.Connected
    ) {
      return;
    }

    // Dacă există o conexiune veche cu alt token, o oprim
    await this.stop();

    this.token = token;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        // SignalR trimite tokenul ca query param pentru WebSocket
        accessTokenFactory: () => token,
        // Prefer WebSockets, fallback la SSE, LongPolling
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.ServerSentEvents |
          signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // Re-înregistrăm handlerii după reconectare automată
    this.connection.onreconnected(() => {
      console.log('[SignalR] Reconectat la hub-ul de notificări.');
    });

    this.connection.onclose((err) => {
      if (err) console.warn('[SignalR] Conexiune închisă cu eroare:', err);
    });

    try {
      await this.connection.start();
      console.log('[SignalR] Conectat la NotificationHub.');
    } catch (err) {
      console.error('[SignalR] Eroare la conectare:', err);
    }
  }

  /** Oprește și distruge conexiunea. */
  async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.token = null;
    }
  }

  /** Abonează un handler la un eveniment SignalR. */
  on(eventName: string, handler: (...args: unknown[]) => void): void {
    this.connection?.on(eventName, handler);
  }

  /** Dezabonează un handler de la un eveniment SignalR. */
  off(eventName: string, handler: (...args: unknown[]) => void): void {
    this.connection?.off(eventName, handler);
  }

  get state(): signalR.HubConnectionState {
    return this.connection?.state ?? signalR.HubConnectionState.Disconnected;
  }
}

// Export singleton — o singură instanță în toată aplicația
export const signalRService = new SignalRService();
