// src/services/chatSignalRService.ts
import * as signalR from '@microsoft/signalr';
import type { MessageInfoDto } from '../types/Message';

const BASE = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    : 'http://localhost:20111';

const HUB_URL = `${BASE}/hubs/chat`;

type MsgHandler       = (msg: MessageInfoDto) => void;
type ErrorHandler     = (error: string) => void;
type ReadHandler      = (data: { byUserId: number }) => void;

class ChatSignalRService {
    private connection: signalR.HubConnection | null = null;
    private token: string | null = null;

    // Păstrăm handlerii într-un Set ca să îi re-înregistrăm după reconectare
    private msgHandlers:   Set<MsgHandler>   = new Set();
    private errHandlers:   Set<ErrorHandler> = new Set();
    private readHandlers:  Set<ReadHandler>  = new Set();

    async start(token: string): Promise<void> {
        if (
            this.connection &&
            this.token === token &&
            this.connection.state === signalR.HubConnectionState.Connected
        ) return;

        await this.stop();
        this.token = token;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: () => token,
                transport:
                    signalR.HttpTransportType.WebSockets |
                    signalR.HttpTransportType.ServerSentEvents |
                    signalR.HttpTransportType.LongPolling,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        // Înregistrăm handlerii ÎNAINTE de start() — aceasta e fix-ul principal
        this._registerHandlers();

        this.connection.onreconnected(() => {
            console.log('[ChatSignalR] Reconectat — re-înregistrăm handlerii.');
            this._registerHandlers();
        });
        this.connection.onclose((err) => {
            if (err) console.warn('[ChatSignalR] Conexiune închisă:', err);
        });

        try {
            await this.connection.start();
            console.log('[ChatSignalR] Conectat la', HUB_URL);
        } catch (err) {
            console.error('[ChatSignalR] Eroare la conectare:', err);
        }
    }

    // Re-înregistrează toți handlerii pe conexiunea curentă
    private _registerHandlers(): void {
        if (!this.connection) return;
        // Ștergem mai întâi ca să nu dublăm
        this.connection.off('ReceiveMessage');
        this.connection.off('MessageError');
        this.connection.off('MessagesRead');

        this.msgHandlers.forEach(h  => this.connection!.on('ReceiveMessage', h));
        this.errHandlers.forEach(h  => this.connection!.on('MessageError',   h));
        this.readHandlers.forEach(h => this.connection!.on('MessagesRead',   h));
    }

    async stop(): Promise<void> {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
            this.token = null;
        }
    }

    async sendMessage(receiverId: number, content: string): Promise<void> {
        if (this.connection?.state !== signalR.HubConnectionState.Connected)
            throw new Error('ChatHub nu este conectat.');
        await this.connection.invoke('SendMessage', receiverId, content);
    }

    async markAsRead(otherUserId: number): Promise<void> {
        if (this.connection?.state === signalR.HubConnectionState.Connected)
            await this.connection.invoke('MarkAsRead', otherUserId);
    }

    onReceiveMessage(handler: MsgHandler): void {
        this.msgHandlers.add(handler);
        this.connection?.on('ReceiveMessage', handler);
    }
    offReceiveMessage(handler: MsgHandler): void {
        this.msgHandlers.delete(handler);
        this.connection?.off('ReceiveMessage', handler);
    }

    onMessageError(handler: ErrorHandler): void {
        this.errHandlers.add(handler);
        this.connection?.on('MessageError', handler);
    }
    offMessageError(handler: ErrorHandler): void {
        this.errHandlers.delete(handler);
        this.connection?.off('MessageError', handler);
    }

    onMessagesRead(handler: ReadHandler): void {
        this.readHandlers.add(handler);
        this.connection?.on('MessagesRead', handler);
    }
    offMessagesRead(handler: ReadHandler): void {
        this.readHandlers.delete(handler);
        this.connection?.off('MessagesRead', handler);
    }

    get state(): signalR.HubConnectionState {
        return this.connection?.state ?? signalR.HubConnectionState.Disconnected;
    }
}

export const chatSignalRService = new ChatSignalRService();