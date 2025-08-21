export function buildEnhancedPrompt(userPrompt: string): string {
  return `
    Generate a complete web application based on this request: "${userPrompt}"

    CRITICAL REQUIREMENTS:
    1. Create a single HTML file with embedded CSS and JavaScript
    2. Create mock HyperionKit components that look and feel like the real ones
    3. Initialize components with placeholder functionality until real HyperionKit is integrated
    4. Add relevant HyperionKit components based on project needs:
    - ConnectWallet (top-right corner)
    - Swap for DeFi/trading features
    - Bridge for cross-chain features  
    - Staking for yield farming
    - Faucet for testnet functionality
    6. Use modern, responsive design with professional appearance
    7. Make it fully functional and ready to run with React support if needed
    8. Use attractive styling with gradients, shadows, and modern UI elements

    REQUIRED STRUCTURE:
    <body>
        <div id="root"></div>
        
        <script>
            // Mock HyperionKit components that work without external dependencies
            window.HyperionKit = {
                HyperkitProvider: function({ children }) {
                    return React.createElement('div', { className: 'hyperkit-provider' }, children);
                },
                ConnectWallet: function(props) {
                    const [connected, setConnected] = React.useState(false);
                    const [address, setAddress] = React.useState('');
                    const [isConnecting, setIsConnecting] = React.useState(false);
                    
                    const connectWallet = async () => {
                        if (connected) {
                            // Disconnect
                            setConnected(false);
                            setAddress('');
                            return;
                        }
                        
                        setIsConnecting(true);
                        
                        try {
                            // Check if MetaMask is installed
                            if (typeof window.ethereum !== 'undefined') {
                                // Request account access
                                const accounts = await window.ethereum.request({
                                    method: 'eth_requestAccounts'
                                });
                                
                                if (accounts.length > 0) {
                                    const account = accounts[0];
                                    setAddress(account);
                                    setConnected(true);
                                    
                                    // Try to switch to Metis Andromeda network
                                    try {
                                        await window.ethereum.request({
                                            method: 'wallet_switchEthereumChain',
                                            params: [{ chainId: '0x440' }], // Metis Andromeda chain ID
                                        });
                                    } catch (switchError) {
                                        // If network doesn't exist, add it
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
                                            });
                                        }
                                    }
                                }
                            } else {
                                alert('MetaMask is not installed. Please install MetaMask to connect your wallet.');
                            }
                        } catch (error) {
                            console.error('Wallet connection error:', error);
                            alert('Failed to connect wallet: ' + error.message);
                        } finally {
                            setIsConnecting(false);
                        }
                    };
                    
                    const formatAddress = (addr) => {
                        if (!addr) return '';
                        return addr.slice(0, 6) + '...' + addr.slice(-4);
                    };
                    
                    return React.createElement('button', {
                        style: {
                            background: connected ? 
                                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                                isConnecting ?
                                'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '25px',
                            cursor: isConnecting ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)',
                            minWidth: '160px',
                            opacity: isConnecting ? 0.7 : 1
                        },
                        onClick: connectWallet,
                        disabled: isConnecting,
                        onMouseOver: (e) => {
                            if (!isConnecting) {
                                e.target.style.transform = 'scale(1.05)';
                            }
                        },
                        onMouseOut: (e) => {
                            e.target.style.transform = 'scale(1)';
                        }
                    }, isConnecting ? '🔄 Connecting...' : 
                    connected ? '✅ ' + formatAddress(address) : 
                    '🔗 Connect Wallet');
                },
                Swap: function(props) {
                    return React.createElement('div', {
                        style: { padding: '20px', border: '2px dashed #10b981', borderRadius: '10px', textAlign: 'center' }
                    }, 'Token Swap Component (HyperionKit placeholder)');
                },
                Bridge: function(props) {
                    return React.createElement('div', {
                        style: { padding: '20px', border: '2px dashed #3b82f6', borderRadius: '10px', textAlign: 'center' }
                    }, 'Bridge Component (HyperionKit placeholder)');
                },
                Staking: function(props) {
                    return React.createElement('div', {
                        style: { padding: '20px', border: '2px dashed #8b5cf6', borderRadius: '10px', textAlign: 'center' }
                    }, 'Staking Component (HyperionKit placeholder)');
                },
                Faucet: function(props) {
                    return React.createElement('div', {
                        style: { padding: '20px', border: '2px dashed #f59e0b', borderRadius: '10px', textAlign: 'center' }
                    }, 'Faucet Component (HyperionKit placeholder)');
                }
            };
            
            // Trigger app initialization
            window.addEventListener('load', () => {
                window.dispatchEvent(new CustomEvent('app-ready'));
            });
        </script>
        
        <script type="text/babel">
            function App() {
                const { HyperkitProvider, ConnectWallet, Swap, Bridge, Staking, Faucet } = window.HyperionKit;
                
                return React.createElement(HyperkitProvider, null,
                    React.createElement('div', null,
                        React.createElement('div', { 
                            style: { position: 'fixed', top: '20px', right: '20px', zIndex: 1000 } 
                        }, React.createElement(ConnectWallet)),
                        
                        // Your app content here
                    )
                );
            }
            
            window.addEventListener('app-ready', () => {
                ReactDOM.render(React.createElement(App), document.getElementById('root'));
            });
        </script>
    </body>

    Please respond with ONLY the HTML code, no explanations or markdown formatting.
    `;
}

export function generateFallbackHTML(prompt: string): string {
  const projectName = prompt.split(' ').slice(0, 3).join(' ') || 'HyperionKit Project';
  
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${projectName}</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://unpkg.com/hyperionkit@latest/dist/index.js"></script>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
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
            
        </style>
    </head>
    <body>
        <div id="root"></div>
        <script type="text/babel">
            function App() {
                const [counter, setCounter] = React.useState(0);
                const [currentTime, setCurrentTime] = React.useState(new Date().toLocaleString());
                const [message, setMessage] = React.useState('Hello from React!');
                const [likes, setLikes] = React.useState(0);
                
                React.useEffect(() => {
                    const timer = setInterval(() => {
                        setCurrentTime(new Date().toLocaleString());
                    }, 1000);
                    return () => clearInterval(timer);
                }, []);
                
                const showAlert = (feature) => {
                    alert('🎉 You clicked on ' + feature + ' feature! This is a fully interactive app with HyperionKit!');
                };
                
                const launchDApp = () => {
                    const messages = [
                        '🚀 Initializing Web3 connection...',
                        '⚡ Loading smart contracts...',
                        '🔗 Connecting to blockchain...',
                        '✅ DApp ready! Welcome to the future!'
                    ];
                    
                    let i = 0;
                    const interval = setInterval(() => {
                        alert(messages[i]);
                        i++;
                        if (i >= messages.length) {
                            clearInterval(interval);
                        }
                    }, 1000);
                };
                
                // Check if HyperionKit is loaded
                const HyperionKit = window.hyperionkit;
                let ConnectWallet, Swap, Bridge, Staking, Faucet, HyperkitProvider;
                
                if (HyperionKit) {
                    ({ ConnectWallet, Swap, Bridge, Staking, Faucet, HyperkitProvider } = HyperionKit);
                }
                
                const renderWithProvider = (content) => {
                    if (HyperkitProvider) {
                        return React.createElement(HyperkitProvider, null, content);
                    }
                    return content;
                };
                
                const appContent = React.createElement('div', null,
                    // Wallet section
                    React.createElement('div', { className: 'wallet-section' },
                        ConnectWallet ? React.createElement(ConnectWallet) : 
                        React.createElement('div', { 
                            style: { 
                                background: '#667eea', 
                                color: 'white', 
                                padding: '10px 20px', 
                                borderRadius: '10px',
                                cursor: 'pointer'
                            },
                            onClick: () => alert('HyperionKit ConnectWallet would appear here!')
                        }, '� Connect Wallet')
                    ),
                    
                    // Main container
                    React.createElement('div', { className: 'container' },
                        // Header
                        React.createElement('div', { className: 'header' },
                            React.createElement('h1', null, '${projectName}'),
                            React.createElement('p', null, 'Built with HyperionKit - Web3 Made Simple')
                        ),
                        
                        // Interactive section
                        React.createElement('div', { className: 'interactive-section' },
                            React.createElement('h2', null, '� Live Interactive Demo'),
                            
                            // Real-time clock
                            React.createElement('div', { className: 'live-time' },
                                '🕐 Current Time: ' + currentTime
                            ),
                            
                            // Counter
                            React.createElement('div', { className: 'counter' },
                                React.createElement('h3', null, 'Interactive Counter'),
                                React.createElement('button', { 
                                    onClick: () => setCounter(counter - 1) 
                                }, '-'),
                                React.createElement('span', { 
                                    style: { fontSize: '2rem', margin: '0 20px' } 
                                }, counter),
                                React.createElement('button', { 
                                    onClick: () => setCounter(counter + 1) 
                                }, '+')
                            ),
                            
                            // React demo
                            React.createElement('div', { className: 'react-demo' },
                                React.createElement('h3', null, '⚛️ React Component Running Live'),
                                React.createElement('p', { style: { marginBottom: '10px' } }, message),
                                React.createElement('button', {
                                    onClick: () => setLikes(likes + 1),
                                    style: { 
                                        background: '#3b82f6', 
                                        color: 'white', 
                                        padding: '8px 16px', 
                                        border: 'none', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer',
                                        marginRight: '10px'
                                    }
                                }, '👍 Like (' + likes + ')'),
                                React.createElement('button', {
                                    onClick: () => setMessage(message === 'Hello from React!' ? '🎉 React is working perfectly!' : 'Hello from React!'),
                                    style: { 
                                        background: '#10b981', 
                                        color: 'white', 
                                        padding: '8px 16px', 
                                        border: 'none', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer' 
                                    }
                                }, 'Toggle Message')
                            )
                        ),
                        
                        // Features
                        React.createElement('div', { className: 'features' },
                            React.createElement('div', { 
                                className: 'feature-card',
                                onClick: () => showAlert('Lightning Fast')
                            },
                                React.createElement('h3', null, '🚀 Lightning Fast'),
                                React.createElement('p', null, 'Built with modern Web3 technologies for optimal performance and user experience. Click me!')
                            ),
                            React.createElement('div', { 
                                className: 'feature-card',
                                onClick: () => showAlert('Secure')
                            },
                                React.createElement('h3', null, '🔒 Secure'),
                                React.createElement('p', null, 'Industry-standard security practices and audited smart contracts ensure your assets are safe. Interactive!')
                            ),
                            React.createElement('div', { 
                                className: 'feature-card',
                                onClick: () => showAlert('Cross-Chain')
                            },
                                React.createElement('h3', null, '🌐 Cross-Chain'),
                                React.createElement('p', null, 'Seamless integration across multiple blockchain networks with our bridge technology. Try clicking!')
                            )
                        ),
                        
                        // HyperionKit Components
                        React.createElement('div', { className: 'dapp-components' },
                            React.createElement('h2', null, '🔥 HyperionKit Components'),
                            React.createElement('div', { className: 'components-grid' },
                                React.createElement('div', { className: 'component-container' },
                                    React.createElement('h3', null, '💱 Token Swap'),
                                    Swap ? React.createElement(Swap) : 
                                    React.createElement('p', null, 'HyperionKit Swap component would render here')
                                ),
                                React.createElement('div', { className: 'component-container' },
                                    React.createElement('h3', null, '🌉 Bridge'),
                                    Bridge ? React.createElement(Bridge) : 
                                    React.createElement('p', null, 'HyperionKit Bridge component would render here')
                                ),
                                React.createElement('div', { className: 'component-container' },
                                    React.createElement('h3', null, '📈 Staking'),
                                    Staking ? React.createElement(Staking) : 
                                    React.createElement('p', null, 'HyperionKit Staking component would render here')
                                ),
                                React.createElement('div', { className: 'component-container' },
                                    React.createElement('h3', null, '🚰 Faucet'),
                                    Faucet ? React.createElement(Faucet) : 
                                    React.createElement('p', null, 'HyperionKit Faucet component would render here')
                                )
                            )
                        ),
                        
                        // CTA section
                        React.createElement('div', { className: 'cta-section' },
                            React.createElement('h2', null, 'Ready to Get Started?'),
                            React.createElement('p', null, 'Connect your wallet and start exploring the decentralized web'),
                            React.createElement('button', { 
                                className: 'cta-button',
                                onClick: launchDApp
                            }, 'Explore DApp')
                        )
                    )
                );
                
                return renderWithProvider(appContent);
            }
            
             // Wait for HyperionKit to load before rendering
            function initApp() {
                console.log('${projectName} loaded successfully!');
                console.log('🔥 Full JavaScript support enabled!');
                console.log('⚛️ React components working!');
                console.log('🎯 Interactive features active!');
                
                if (window.HyperionKit) {
                    console.log('✅ HyperionKit loaded:', Object.keys(window.HyperionKit));
                } else {
                    console.log('⚠️ HyperionKit not found - using fallback components');
                }
                
                ReactDOM.render(React.createElement(App), document.getElementById('root'));
            }
            
            // Initialize immediately when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initApp);
            } else {
                initApp();
            }
        </script>
    </body>
    </html>`;
}
