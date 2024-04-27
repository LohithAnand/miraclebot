import fetch from 'node-fetch';
import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

class NexusAppt {
    slotCheckUrl;
    telegramToken;
    telegramChatId;
    bot;

    constructor() {
        this.slotCheckUrl = process.env.SLOT_CHECK_URL;
        this.telegramToken = process.env.TELEGRAM_TOKEN;
        this.telegramChatId = parseInt(process.env.TELEGRAM_CHAT_ID)
        this.bot = new TelegramBot(this.telegramToken, {polling: true});
    }

    main() {
        this.listenChat();

        setInterval(async () => {
            const response = await fetch(this.slotCheckUrl);
            const body = await response.json();
            if (body.availableSlots.length) {
                this.sendChat(JSON.stringify(body.availableSlots));
            } else {
                // this.sendChat("No slots available");
            }
        }, 10000);
    }

    listenChat() {
        this.bot.on('message', (msg) => {
            this.telegramChatId = msg.chat.id;
            console.log("chat id is set", this.telegramChatId);
        });
    }

    sendChat(message) {
        if (!this.telegramChatId) {
            return;
        }
        this.bot.sendMessage(this.telegramChatId, message);
    }
}

new NexusAppt().main();
