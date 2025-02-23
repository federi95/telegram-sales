# Telegram Offer Monitor

Telegram Offer Monitor is a fullstack application built with Next.js that allows users to monitor product offers within public Telegram chats and channels. Users can add products and channels to track, receiving notifications when a relevant offer is detected.

## Technologies Used

- **Next.js** - React framework for both frontend and backend
- **Mantine UI** - Component library for the UI
- **REST API** - For CRUD operations
- **Telegram API** - To access public channel messages
- **SQLite with Drizzle ORM** - For database management

## Features

- Add and manage products to monitor
- Insert and manage Telegram chats/channels to track
- Automatic notifications when an offer is detected
- Modern and responsive UI with Mantine UI

## Installation

### Prerequisites

- Node.js 18+
- Bun

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/federi95/telegram-sales.git
   cd telegram-sales
   ```
2. Install dependencies:
   ```sh
   bun install
   ```
3. Configure the `.env` file:
   ```env
   DB_FILE_NAME=db.sqlite
   TELEGRAM_API_ID=your_telegram_app_id
   TELEGRAM_API_HASH=your_telegram_app_hash
   WEBHOOK_URL=your_discord_webhook_url
   ```
4. Start the application:
   ```sh
   bun dev
   ```

## API Endpoints

| Method | Endpoint           | Description                             |
| ------ | ------------------ | --------------------------------------- |
| GET    | /api/products      | Retrieve the list of monitored products |
| POST   | /api/products      | Add a new product                       |
| PATCH  | /api/products/\:id | Update a product                        |
| DELETE | /api/products/\:id | Remove a product                        |
| GET    | /api/channels      | Retrieve the list of monitored channels |
| POST   | /api/channels      | Add a new channel                       |
| PATCH  | /api/channels/\:id | Update a channel                        |
| DELETE | /api/channels/\:id | Remove a channel                        |
| POST   | /api/session       | Create a session                        |
| DELETE | /api/session       | Delete a session                        |

## Contributing

If you want to contribute, feel free to open an issue or a pull request.

## License

This project is distributed under the MIT license.

