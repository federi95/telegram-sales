import {
  APIEmbedField,
  AttachmentBuilder,
  EmbedBuilder,
  WebhookClient,
  WebhookMessageCreateOptions,
} from "discord.js";
import { Api } from "telegram";
import { NewMessageEvent } from "telegram/events";

import { Channel, Product } from "@/db/schema";
import { eventEmitter } from "@/lib/event";
import { TGClient } from "@/lib/tg-client";
import * as channelService from "@/modules/channel/channel.service";
import * as productService from "@/modules/product/product.service";
import * as sessionService from "@/modules/session/session.service";

const currencies = ["€", "£", "$", "₽", "₺", "₹", "¥", "₩", "₿"];

async function getClient(): Promise<TGClient> {
  const session = await sessionService.getFirst();
  const client = new TGClient(session?.data);
  console.log("Starting client...");
  await client.logIn();

  if (!session) {
    console.log("Session not found, saving new session...");
    const data = client.getSession();
    await sessionService.create({ session: data });
  }

  return client;
}

async function onNewMessage(
  event: NewMessageEvent,
  channel: string,
  product: string
) {
  const url = process.env.WEBHOOK_URL;
  if (!url) {
    console.log("Webhook URL not found.", event);
    return;
  }

  const webhook = new WebhookClient({ url });
  const { media, message, markAsRead } = event.message;

  let image: Buffer | undefined;
  if (media && media instanceof Api.MessageMediaPhoto)
    image = media.photo?.getBytes();

  const messageParts = message.split("\n");
  const [title, ...parts] = messageParts;

  const pricePart = parts.find((part) =>
    currencies.some((currency) => part.includes(currency))
  );

  const fields: APIEmbedField[] = [{ name: "Product", value: product }];

  if (pricePart) fields.push({ name: "Price", value: pricePart, inline: true });

  fields.push(
    { name: "Message", value: message },
    { name: "Channel", value: channel }
  );

  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Offer Bot 📣",
      iconURL:
        "https://cdn.pixabay.com/photo/2021/04/16/12/38/discount-6183488_1280.png",
    })
    .setTitle(title)
    // eslint-disable-next-line unicorn/numeric-separators-style
    .setColor(0x097969)
    .setFields(fields);

  const options: WebhookMessageCreateOptions = {
    embeds: [embed],
  };

  if (image) {
    const file = new AttachmentBuilder(image, { name: "photo.png" });
    embed.setImage("attachment://photo.png");
    options.files = [file];
  }

  try {
    await webhook.send(options);
    await markAsRead();
  } catch (error) {
    console.log("[ERROR]:", error);
  }
}

async function startListen(client: TGClient): Promise<void> {
  console.log("Fetching channels...");
  const { data: channels } = await channelService.list({ limit: 999 });

  if (channels.length === 0) {
    console.log("No channels found, exiting...");
    return;
  }

  const { data: products } = await productService.list({ limit: 999 });

  if (products.length === 0) {
    console.log("No products found, exiting...");
    return;
  }

  const productsMap = new Map<number, Product[]>();
  const _channels: (Channel & {
    products: Product[];
  })[] = [];

  for (const product of products) {
    const _products = productsMap.get(product.channelId) ?? [];
    productsMap.set(product.channelId, [..._products, product]);
  }

  for (const channel of channels) {
    const _products = productsMap.get(channel.id) ?? [];
    _channels.push({ ...channel, products: _products });
  }

  console.log(
    `Listening for new messages for channels: [${_channels.map((c) => c.name).join(", ")}]`
  );

  await client.listenNewMessages(_channels, onNewMessage);
}

export async function startPolling() {
  try {
    console.log("Polling started...");
    const client = await getClient();

    async function restart() {
      console.log("New data inserted, restarting polling...");
      await client.stopListenNewMessages();
      await startListen(client);
    }

    eventEmitter.on("dataChanged", restart);
    await startListen(client);
  } catch (error) {
    console.log("Failed to polling", error);
  }
}
