import { Api, TelegramClient } from "telegram";
import { Entity } from "telegram/define";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { LogLevel } from "telegram/extensions/Logger";
import { StringSession } from "telegram/sessions";

import { Channel, Product } from "@/db/schema";
import { input } from "@/utils/input";

export type TelegramScraper = Omit<TelegramClient, "session">;

export class TGClient extends TelegramClient implements TelegramScraper {
  private _session: string = "";
  private _cleanup: boolean = false;

  constructor(session?: string | null) {
    const _session = session ?? "";
    const apiId = Number.parseInt(process.env.TELEGRAM_API_ID ?? "", 10);
    const apiHash = process.env.TELEGRAM_API_HASH;

    if (Number.isNaN(apiId) || !apiHash)
      throw new Error("API ID and/or API hash not found");

    super(new StringSession(_session), apiId, apiHash, {
      connectionRetries: 5,
      reconnectRetries: 0,
      autoReconnect: false,
    });

    if (session) this._session = _session;

    this.setLogLevel(LogLevel.NONE);
    this._errorHandler = async function (error) {
      if (error.message && error.message !== "TIMEOUT")
        console.error(`Error occurred for API ID ${this.apiId}:`, error);
    };

    for (const sig of [
      "SIGHUP",
      "SIGINT",
      "SIGQUIT",
      "SIGILL",
      "SIGTRAP",
      "SIGABRT",
      "SIGBUS",
      "SIGFPE",
      "SIGUSR1",
      "SIGSEGV",
      "SIGUSR2",
      "SIGTERM",
    ]) {
      process.on(sig, async () => {
        if (this._cleanup) return;
        this._cleanup = true;
        console.log("\n");
        console.log(`Received: ${sig}, cleaning up`);
        await this.disconnect();
        await this.destroy();
        await Bun.sleep(400);
        process.exit(0);
      });
    }
  }

  async logIn(): Promise<void> {
    await this.start({
      phoneNumber: async () => input("Please enter your number: "),
      password: async () => input("Please enter your password: "),
      phoneCode: async () => input("Please enter the code you received: "),
      onError: (error) => console.log(error),
    });

    this._session =
      this._session.length > 0
        ? this._session
        : (this.session as StringSession).save();
    console.log("Logged in to Telegram!");
  }

  getSession(): string {
    if (!this._session) throw new Error("Session not found");
    return this._session;
  }

  async endSession(): Promise<boolean> {
    return this.invoke(new Api.account.ResetWebAuthorizations());
  }

  private async _NewMessageCallback(
    event: NewMessageEvent,
    products?: Map<bigInt.BigInteger, Product[]>,
    cb?: (
      event: NewMessageEvent,
      channel: string,
      product: string
    ) => void | Promise<void>
  ): Promise<void> {
    if (!products || !cb) return;
    const { message, peerId } = event.message;
    if (!message) return;

    const entity = await this.getEntity(peerId);
    if (!entity) return;

    const _products = products.get(entity.id);
    if (!_products) return;

    for (const product of _products) {
      if (message.toLowerCase().includes(product.name))
        cb(event, product.channel.url, product.name);
    }
  }

  /**
   * @param channels Channels to scrape messages from
   * @param products Products to search for in messages
   * @returns {Promise<void>}
   */
  async listenNewMessages(
    channels: (Channel & {
      products: Product[];
    })[],
    cb?: (
      event: NewMessageEvent,
      channel: string,
      product: string
    ) => void | Promise<void>
  ): Promise<void> {
    const entityCache = new Map<string, Entity>();
    const productCache = new Map<bigInt.BigInteger, Product[]>();

    for (const channel of channels) {
      const entity = await this.getEntity(channel.url);
      if (!entity) {
        console.log(`Failed to get entity for channel: ${channel.name}`);
        continue;
      }

      entityCache.set(channel.url, entity);
      productCache.set(entity.id, channel.products);
    }

    const chats = [...entityCache.values()].map((entity) => entity.id);

    this.addEventHandler(
      async (event: NewMessageEvent) =>
        this._NewMessageCallback(event, productCache, cb),
      new NewMessage({ chats })
    );
  }

  /**
   * Stop listening for new messages
   * @returns {Promise<void>}
   */
  async stopListenNewMessages(): Promise<void> {
    for (const [handler, callback] of this.listEventHandlers()) {
      this.removeEventHandler(callback, handler);
    }
  }
}
