# AllIn1

A modern, feature-rich chat application built with Next.js that supports multiple AI models from leading providers and provides an interactive UI creation environment.

## Features

- 🤖 **Comprehensive AI Model Support**

  - OpenAI - All models supported
  - Google Gemini - All models supported
  - Groq - All models supported
  - Easy model switching and configuration
  - Real-time model selection

- 🎨 **Interactive UI Canvas**

  - Preview shadcn/ui components
  - Real-time UI generation from AI
  - Live component customization
  - Resizable preview panel
  - Copy-paste ready code
  - Component library integration

- 💬 **Advanced Chat Interface**

  - Message threading
  - Real-time responses
  - Code block support
  - Message editing
  - Markdown and math equation support
  - File upload capabilities

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark/Light theme
  - Smooth animations
  - Loading indicators
  - Toast notifications

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: NeonDB (PostgreSQL) with Drizzle ORM
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **AI Integration**: AI SDK (@ai-sdk/\*)
- **Code Editor**: CodeMirror
- **Authentication**: Better Auth

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-chat-app.git
   cd ai-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your API keys and database credentials.

4. Set up the database:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Management

- Generate migrations: `npm run db:generate`
- Apply migrations: `npm run db:migrate`
- Database UI: `npm run db:studio`

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
