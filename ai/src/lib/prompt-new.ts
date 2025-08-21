export function buildEnhancedPrompt(userPrompt: string): string {
  return `
    Generate a complete React project based on this request: "${userPrompt}"

    REQUIREMENTS:
    1. Create a modern React application with separate component files
    2. Use functional components with hooks
    3. Include HyperionKit Web3 components with real functionality
    4. Generate clean, maintainable code structure
    5. Include proper styling and responsive design
    6. Make components interactive and functional
    7. Focus on the specific requirements: ${userPrompt}

    The project should include:
    - package.json with dependencies
    - Vite configuration
    - React components with proper structure
    - CSS styling
    - Real wallet connectivity
    - Interactive Web3 features

    Please respond with ONLY the HTML code, no explanations or markdown formatting.
    `;
}

export interface ProjectFile {
  path: string;
  content: string;
}

export function generateProjectStructure(prompt: string): ProjectFile[] {
  const projectName = prompt.split(' ').slice(0, 3).join('-').toLowerCase().replace(/[^a-z0-9-]/g, '') || 'hyperionkit-project';
  
  return [
    // package.json
    {
      path: 'package.json',
      content: JSON.stringify({
        name: projectName,
        version: '1.0.0',
        private: true,
        type: 'module',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          vite: '^4.4.5',
          '@vitejs/plugin-react': '^4.0.3'
        },
        devDependencies: {},
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        }
      }, null, 2)
    },

    // vite.config.js
    {
      path: 'vite.config.js',
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  css: {
    postcss: {
      plugins: []
    }
  },
  esbuild: {
    target: 'es2015'
  }
})`
    },

    // .postcssrc.json (to override parent PostCSS config)
    {
      path: '.postcssrc.json',
      content: JSON.stringify({
        plugins: {}
      }, null, 2)
    },

    // index.html
    {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="./src/main.jsx"></script>
</body>
</html>`
    },

    // src/main.jsx
    {
      path: 'src/main.jsx',
      content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { HyperkitProvider } from './components/HyperionKit.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HyperkitProvider>
      <App />
    </HyperkitProvider>
  </React.StrictMode>,
)`
    },

    // src/App.jsx
    {
      path: 'src/App.jsx',
      content: generateAppComponent(prompt)
    },

    // src/components/HyperionKit.jsx
    {
      path: 'src/components/HyperionKit.jsx',
      content: generateHyperionKitComponents()
    },

    // src/styles.css
    {
      path: 'src/styles.css',
      content: generateStyles()
    }
  ];
}

function generateAppComponent(prompt: string): string {
  return `import React, { useState, useEffect } from 'react'
import { ConnectWallet, Swap, Bridge, Staking, Faucet } from './components/HyperionKit'

function App() {
  const [counter, setCounter] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="app">
      {/* Wallet in top-right corner */}
      <div className="wallet-section">
        <ConnectWallet />
      </div>

      {/* Main content */}
      <div className="container">
        <header className="header">
          <h1>${prompt}</h1>
          <p>Built with HyperionKit - Web3 Made Simple</p>
        </header>

        <section className="interactive-section">
          <h2>🚀 Live Interactive Demo</h2>
          
          <div className="live-time">
            🕐 Current Time: {currentTime}
          </div>

          <div className="counter">
            <h3>Interactive Counter</h3>
            <button onClick={() => setCounter(counter - 1)}>-</button>
            <span className="counter-value">{counter}</span>
            <button onClick={() => setCounter(counter + 1)}>+</button>
          </div>
        </section>

        <section className="features">
          <div className="feature-card" onClick={() => alert('🚀 Lightning Fast feature clicked!')}>
            <h3>🚀 Lightning Fast</h3>
            <p>Built with modern Web3 technologies for optimal performance.</p>
          </div>
          <div className="feature-card" onClick={() => alert('🔒 Secure feature clicked!')}>
            <h3>🔒 Secure</h3>
            <p>Industry-standard security practices and audited smart contracts.</p>
          </div>
          <div className="feature-card" onClick={() => alert('🌐 Cross-Chain feature clicked!')}>
            <h3>🌐 Cross-Chain</h3>
            <p>Seamless integration across multiple blockchain networks.</p>
          </div>
        </section>

        <section className="components-section">
          <h2>🔥 HyperionKit Components</h2>
          <div className="components-grid">
            <div className="component-container">
              <h3>💱 Token Swap</h3>
              <Swap />
            </div>
            <div className="component-container">
              <h3>🌉 Bridge</h3>
              <Bridge />
            </div>
            <div className="component-container">
              <h3>📈 Staking</h3>
              <Staking />
            </div>
            <div className="component-container">
              <h3>🚰 Faucet</h3>
              <Faucet />
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Connect your wallet and start exploring the decentralized web</p>
          <button className="cta-button" onClick={() => alert('🎉 DApp launched!')}>
            Explore DApp
          </button>
        </section>
      </div>
    </div>
  )
}

export default App`
}

function generateHyperionKitComponents(): string {
  return `import React, { useState, createContext, useContext } from 'react'

// Context for HyperionKit
const HyperkitContext = createContext()

export function HyperkitProvider({ children }) {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  return (
    <HyperkitContext.Provider value={{
      walletConnected,
      setWalletConnected,
      walletAddress,
      setWalletAddress
    }}>
      {children}
    </HyperkitContext.Provider>
  )
}

export function useWallet() {
  return useContext(HyperkitContext)
}

export function ConnectWallet() {
  const { walletConnected, setWalletConnected, walletAddress, setWalletAddress } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    if (walletConnected) {
      setWalletConnected(false)
      setWalletAddress('')
      return
    }

    setIsConnecting(true)

    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })

        if (accounts.length > 0) {
          const account = accounts[0]
          setWalletAddress(account)
          setWalletConnected(true)

          // Switch to Metis Andromeda network
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x440' }],
            })
          } catch (switchError) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x440',
                  chainName: 'Metis Andromeda',
                  nativeCurrency: {
                    name: 'METIS',
                    symbol: 'METIS',
                    decimals: 18
                  },
                  rpcUrls: ['https://andromeda.metis.io/?owner=1088'],
                  blockExplorerUrls: ['https://andromeda-explorer.metis.io/']
                }]
              })
            }
          }
        }
      } else {
        alert('MetaMask is not installed. Please install MetaMask to connect your wallet.')
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      alert('Failed to connect wallet: ' + error.message)
    } finally {
      setIsConnecting(false)
    }
  }

  const formatAddress = (addr) => {
    if (!addr) return ''
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  }

  return (
    <button
      className={\`connect-wallet-btn \${walletConnected ? 'connected' : ''} \${isConnecting ? 'connecting' : ''}\`}
      onClick={connectWallet}
      disabled={isConnecting}
    >
      {isConnecting ? '🔄 Connecting...' : 
       walletConnected ? \`✅ \${formatAddress(walletAddress)}\` : 
       '🔗 Connect Wallet'}
    </button>
  )
}

export function Swap() {
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('USDC')
  const [amount, setAmount] = useState('')

  const handleSwap = () => {
    alert(\`🔄 Swapping \${amount} \${fromToken} to \${toToken} (Mock)\`)
  }

  return (
    <div className="swap-container">
      <div className="swap-input-group">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
          <option value="ETH">ETH</option>
          <option value="BTC">BTC</option>
          <option value="USDC">USDC</option>
          <option value="METIS">METIS</option>
        </select>
      </div>
      
      <div className="swap-arrow">⬇️</div>
      
      <div className="swap-input-group">
        <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
          <option value="USDC">USDC</option>
          <option value="ETH">ETH</option>
          <option value="BTC">BTC</option>
          <option value="METIS">METIS</option>
        </select>
      </div>
      
      <button className="swap-btn" onClick={handleSwap}>
        Swap Tokens
      </button>
    </div>
  )
}

export function Bridge() {
  const [fromChain, setFromChain] = useState('Ethereum')
  const [toChain, setToChain] = useState('Metis')
  const [amount, setAmount] = useState('')

  return (
    <div className="bridge-container">
      <div className="bridge-input-group">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="bridge-chains">
        <select value={fromChain} onChange={(e) => setFromChain(e.target.value)}>
          <option value="Ethereum">Ethereum</option>
          <option value="Polygon">Polygon</option>
          <option value="BSC">BSC</option>
        </select>
        <span>→</span>
        <select value={toChain} onChange={(e) => setToChain(e.target.value)}>
          <option value="Metis">Metis</option>
          <option value="Arbitrum">Arbitrum</option>
          <option value="Optimism">Optimism</option>
        </select>
      </div>
      <button className="bridge-btn" onClick={() => alert(\`🌉 Bridging \${amount} from \${fromChain} to \${toChain}\`)}>
        Start Bridge
      </button>
    </div>
  )
}

export function Staking() {
  const [stakeAmount, setStakeAmount] = useState('')
  const [userStake, setUserStake] = useState(0)

  const stake = () => {
    if (stakeAmount) {
      setUserStake(prev => prev + parseFloat(stakeAmount))
      setStakeAmount('')
      alert(\`📈 Staked \${stakeAmount} tokens!\`)
    }
  }

  return (
    <div className="staking-container">
      <div className="staking-info">
        <p>APY: 12.5%</p>
        <p>Your Stake: {userStake} tokens</p>
        <p>Rewards: {(userStake * 0.125).toFixed(2)} tokens/year</p>
      </div>
      <div className="staking-input">
        <input
          type="number"
          placeholder="Amount to stake"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
        />
      </div>
      <button className="staking-btn" onClick={stake}>
        Stake Tokens
      </button>
    </div>
  )
}

export function Faucet() {
  const [claimed, setClaimed] = useState(false)
  const [claimHistory, setClaimHistory] = useState([])

  const claimTokens = () => {
    setClaimed(true)
    const timestamp = new Date().toLocaleTimeString()
    setClaimHistory(prev => [...prev, { amount: 100, time: timestamp }])
    alert('🚰 100 Test Tokens claimed!')
    setTimeout(() => setClaimed(false), 10000) // 10 second cooldown
  }

  return (
    <div className="faucet-container">
      <div className="faucet-info">
        <p>Get free testnet tokens</p>
        <p>Limit: 100 tokens per 10 seconds</p>
      </div>
      
      {claimHistory.length > 0 && (
        <div className="claim-history">
          <h4>Recent Claims:</h4>
          {claimHistory.slice(-3).map((claim, index) => (
            <p key={index}>{claim.amount} tokens at {claim.time}</p>
          ))}
        </div>
      )}
      
      <button 
        className={\`faucet-btn \${claimed ? 'claimed' : ''}\`}
        disabled={claimed}
        onClick={claimTokens}
      >
        {claimed ? 'Claimed ✅ (Cooldown)' : 'Claim 100 Tokens'}
      </button>
    </div>
  )
}`
}

function generateStyles(): string {
  return `/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

.app {
  min-height: 100vh;
  padding: 20px;
}

.wallet-section {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.connect-wallet-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  min-width: 160px;
}

.connect-wallet-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.connect-wallet-btn.connected {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.connect-wallet-btn.connecting {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  opacity: 0.7;
  cursor: not-allowed;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.header p {
  font-size: 1.2rem;
  color: #666;
}

.interactive-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 30px;
  border-radius: 15px;
  margin: 30px 0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.live-time {
  background: #4f46e5;
  color: white;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  margin: 20px 0;
  font-size: 1.2rem;
}

.counter {
  text-align: center;
  margin: 20px 0;
}

.counter button {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.counter button:hover {
  background: #764ba2;
  transform: translateY(-2px);
}

.counter-value {
  font-size: 2rem;
  margin: 0 20px;
  font-weight: bold;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 40px 0;
}

.feature-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.components-section {
  margin-top: 50px;
}

.components-section h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.component-container {
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid #667eea;
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
}

.component-container:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.02);
}

.component-container h3 {
  margin-bottom: 15px;
  color: #667eea;
  text-align: center;
}

.cta-section {
  text-align: center;
  margin-top: 60px;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
}

.cta-button {
  background: white;
  color: #667eea;
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

/* Component styles */
.swap-container,
.bridge-container,
.staking-container,
.faucet-container {
  padding: 20px;
  border-radius: 10px;
  min-height: 200px;
}

.swap-container {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
  border: 2px solid #10b981;
}

.bridge-container {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
  border: 2px solid #3b82f6;
}

.staking-container {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  border: 2px solid #8b5cf6;
}

.faucet-container {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
  border: 2px solid #f59e0b;
}

.swap-input-group,
.bridge-input-group,
.staking-input {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.swap-input-group input,
.swap-input-group select,
.bridge-input-group input,
.staking-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.swap-arrow {
  text-align: center;
  font-size: 1.5rem;
  margin: 10px 0;
}

.bridge-chains {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.bridge-chains select {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.swap-btn,
.bridge-btn,
.staking-btn,
.faucet-btn {
  width: 100%;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.swap-btn {
  background: #10b981;
  color: white;
}

.bridge-btn {
  background: #3b82f6;
  color: white;
}

.staking-btn {
  background: #8b5cf6;
  color: white;
}

.faucet-btn {
  background: #f59e0b;
  color: white;
}

.faucet-btn.claimed {
  background: #6b7280;
  cursor: not-allowed;
}

.staking-info,
.faucet-info {
  margin-bottom: 15px;
  text-align: center;
}

.claim-history {
  background: rgba(0,0,0,0.1);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.claim-history h4 {
  margin-bottom: 5px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .wallet-section {
    position: static;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .components-grid {
    grid-template-columns: 1fr;
  }
}`
}
