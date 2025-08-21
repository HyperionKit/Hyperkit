# HyperionKit AI - Web3 Project Generator

An AI-powered tool that generates complete Web3 applications using natural language prompts. Built with Next.js, TypeScript, and integrated with HyperionKit blockchain components.

## 🚀 Features

- **AI-Powered Generation**: Describe your Web3 project and get a complete application
- **Blockchain Integration**: Automatic integration of HyperionKit components (ConnectWallet, Swap, Bridge, Staking, Faucet)
- **Live Preview**: See your generated project in real-time with iframe preview
- **File Management**: Download complete project files or publish to HyperionKit platform
- **Multiple AI Models**: Support for various AI models (GPT-4, GPT-3.5, etc.)
- **Smart Prompting**: Restricted to project-related prompts only

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Zustand with persistence
- **AI Integration**: Alith AI wrapper
- **Icons**: Lucide React
- **Blockchain**: HyperionKit components

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hyperionkit-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GITHUB_TOKEN=your_github_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Basic Usage

1. **Select AI Model**: Choose your preferred AI model from the dropdown
2. **Enter Prompt**: Describe your Web3 project (max 500 characters)
3. **Generate**: Click send and watch your project come to life
4. **Preview**: View the generated application in the preview panel
5. **Download/Publish**: Download the files or publish to HyperionKit platform

### Example Prompts

```
✅ Good prompts:
- "Create a DeFi dashboard with staking features"
- "Build an NFT marketplace with wallet connection"
- "Make a crypto portfolio tracker"
- "Generate a token swapping interface"

❌ Avoid:
- General questions about blockchain
- Non-project related queries
- Personal information requests
```

## 🏗️ Project Structure

```
src/
├── api/
│   └── aiService.ts          # AI integration service
├── components/
│   ├── ChatPanel.tsx         # Left panel - chat interface
│   ├── PreviewPanel.tsx      # Right panel - project preview
│   ├── ModelSelector.tsx     # AI model selection
│   └── ErrorBoundary.tsx     # Error handling component
├── constants/
│   └── index.ts             # App constants and configurations
├── lib/
│   ├── fileService.ts       # File download/upload utilities
│   └── env.ts              # Environment configuration
├── store/
│   └── useAppStore.ts       # Zustand state management
├── types/
│   └── index.ts            # TypeScript type definitions
└── app/
    ├── layout.tsx
    ├── page.tsx            # Main application page
    └── globals.css
```

## 🔧 Configuration

### AI Models

The application supports multiple AI models configured in `src/constants/index.ts`:

```typescript
export const AI_MODELS = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Most capable model for complex code generation',
    available: true
  },
  // Add more models...
];
```

### HyperionKit Components

Generated projects automatically include:

- **ConnectWallet**: Always included for wallet connectivity
- **Swap**: Token swapping functionality
- **Bridge**: Cross-chain bridging
- **Staking**: Token staking features
- **Faucet**: Testnet token claiming

Built with ❤️ by the HyperionKit team
