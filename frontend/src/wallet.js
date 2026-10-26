import { BrowserProvider, isAddress, parseEther } from 'ethers'

export const SEPOLIA_CHAIN_ID = 11155111n

function getInjectedProvider() {
  if (!window.ethereum) {
    throw new Error('MetaMask nije pronađen. Instaliraj MetaMask i pokušaj ponovno.')
  }

  return new BrowserProvider(window.ethereum)
}

export function isMetaMaskAvailable() {
  return Boolean(window.ethereum)
}

export async function getWalletState() {
  const provider = getInjectedProvider()
  const [accounts, network] = await Promise.all([
    provider.send('eth_accounts', []),
    provider.getNetwork(),
  ])

  return {
    account: accounts[0] || '',
    chainId: network.chainId,
  }
}

export async function connectWallet() {
  const provider = getInjectedProvider()
  const accounts = await provider.send('eth_requestAccounts', [])
  const network = await provider.getNetwork()

  return {
    account: accounts[0] || '',
    chainId: network.chainId,
  }
}

export async function switchToSepolia() {
  if (!window.ethereum) {
    throw new Error('MetaMask nije pronađen. Instaliraj MetaMask i pokušaj ponovno.')
  }

  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }],
  })

  return (await getWalletState()).chainId
}

export async function sendSepoliaEth(recipient, amount) {
  const provider = getInjectedProvider()
  const network = await provider.getNetwork()

  if (network.chainId !== SEPOLIA_CHAIN_ID) {
    throw new Error('Za slanje transakcije prebaci MetaMask na Sepolia mrežu.')
  }
  if (!isAddress(recipient.trim())) {
    throw new Error('Unesi valjanu Ethereum adresu kolege.')
  }

  let value
  try {
    value = parseEther(amount.trim())
  } catch {
    throw new Error('Unesi valjan iznos ETH-a s najviše 18 decimalnih mjesta.')
  }
  if (value <= 0n) {
    throw new Error('Iznos mora biti veći od 0.')
  }

  const signer = await provider.getSigner()
  const transaction = await signer.sendTransaction({
    to: recipient.trim(),
    value,
  })

  return transaction.hash
}
