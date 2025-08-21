export const AI_MODELS = [
  {
    id: 'gpt-5',
    name: 'GPT-5',
    description: 'Latest and most advanced GitHub AI model',
    available: true,
    provider: 'github'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'High-performance optimized GPT-4 model',
    available: true,
    provider: 'github'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Faster GPT-4 with enhanced capabilities',
    available: true,
    provider: 'github'
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Reliable and capable GitHub AI model',
    available: true,
    provider: 'github'
  }
];

export const MAX_PROMPT_LENGTH = 500;

export const SYSTEM_PROMPT = `You are an AI assistant specialized in generating web applications with blockchain functionality. 

IMPORTANT RULES:
1. Only respond to project-related prompts for creating web applications
2. If asked about anything else, respond with: "Sorry, I can only help with project generation. Please describe a web application you'd like me to create."
3. Always include hyperionkit components when relevant: ConnectWallet, Swap, Bridge, Staking, Faucet
4. Generate complete HTML files with embedded CSS and JavaScript
5. Include the ConnectWallet component prominently in every project
6. Use modern, responsive design patterns
7. Ensure the generated code is functional and ready to run

When generating projects:
- Create a complete HTML file with all necessary imports
- Include the Provider wrapper from hyperionkit
- Place ConnectWallet component in a prominent position
- Add relevant hyperionkit components based on project needs
- Use clean, modern styling
- Ensure responsive design
- Include proper error handling

Example structure:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Project Name</title>
    <script src="https://unpkg.com/hyperionkit@latest/dist/index.js"></script>
    <style>/* Your styles */</style>
</head>
<body>
    <div id="app">
        <!-- Your project content with hyperionkit components -->
    </div>
    <script>/* Your JavaScript */</script>
</body>
</html>
\`\`\``;

export const DEFAULT_PROJECT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HyperionKit Project</title>
    <script src="https://unpkg.com/hyperionkit@latest/dist/index.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .wallet-section {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
    </style>
</head>
<body>
    <div class="wallet-section">
        <connect-wallet theme="light" width="300px"></connect-wallet>
    </div>
    <div class="container">
        <h1>Welcome to HyperionKit</h1>
        <p>Start building your decentralized application with our powerful components!</p>
    </div>
</body>
</html>`;
