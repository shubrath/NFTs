import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Register from './components/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Nav from './components/Nav';
const { networkConfig } = createNetworkConfig({
	testnet: { url: getFullnodeUrl('testnet') },
	devnet: { url: getFullnodeUrl('devnet') },
});
const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
				<WalletProvider>
        <BrowserRouter>
        <Nav/>
      <Routes>
        {/* <Route element={<RegNav Child={Register}/>} path="/register"></Route> */}
        <Route  path="/" element={<Register />}/>
        {/* <Route path="/login" element={<Login />} />  */}
      </Routes>
    </BrowserRouter>
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
  )
}

export default App