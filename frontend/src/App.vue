<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useProposalStore } from './stores/proposals'
import {
  connectWallet as connectMetaMask,
  getWalletState,
  isMetaMaskAvailable,
  sendSepoliaEth,
  switchToSepolia as switchMetaMaskToSepolia,
} from './wallet'

const proposalStore = useProposalStore()
const selectedFilter = ref('all')
const searchQuery = ref('')
const notice = ref('')
const account = ref('')
const chainId = ref('')
const walletError = ref('')
const transferStatus = ref('')
const transactionHash = ref('')
const recipientAddress = ref('')
const transferAmount = ref('')
const isConnecting = ref(false)
const isSending = ref(false)

const isOnSepolia = computed(() => chainId.value === 11155111n)
const shortAccount = computed(() =>
  account.value ? `${account.value.slice(0, 6)}...${account.value.slice(-4)}` : '',
)
const filters = [
  { id: 'all', label: 'Svi prijedlozi' },
  { id: 'active', label: 'U tijeku' },
  { id: 'ended', label: 'Završeni' },
]

const visibleProposals = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('hr')

  return proposalStore.proposals.filter((proposal) => {
    const matchesFilter =
      selectedFilter.value === 'all' || proposal.status === selectedFilter.value
    const matchesSearch =
      !query ||
      `${proposal.title} ${proposal.description} ${proposal.category}`
        .toLocaleLowerCase('hr')
        .includes(query)

    return matchesFilter && matchesSearch
  })
})

function getWalletError(error) {
  if (error?.code === 4001) return 'Zahtjev je odbijen u MetaMasku.'
  if (error?.code === 'ACTION_REJECTED') return 'Zahtjev je odbijen u MetaMasku.'
  if (error?.code === -32002) return 'MetaMask već obrađuje zahtjev. Otvori MetaMask i dovrši ga.'
  if (error?.code === 4902) return 'Sepolia mreža nije dodana u MetaMask. Dodaj je pa pokušaj ponovno.'
  return error?.message || 'Došlo je do pogreške pri komunikaciji s MetaMaskom.'
}

async function refreshWallet() {
  if (!isMetaMaskAvailable()) return

  try {
    const wallet = await getWalletState()
    account.value = wallet.account
    chainId.value = wallet.chainId
  } catch (error) {
    walletError.value = getWalletError(error)
  }
}

async function connectWallet() {
  walletError.value = ''
  isConnecting.value = true
  try {
    const wallet = await connectMetaMask()
    account.value = wallet.account
    chainId.value = wallet.chainId
    if (!wallet.account) {
      walletError.value = 'MetaMask nije vratio odabrani račun. Pokušaj ponovno.'
    }
  } catch (error) {
    walletError.value = getWalletError(error)
  } finally {
    isConnecting.value = false
  }
}

async function switchToSepolia() {
  walletError.value = ''
  try {
    chainId.value = await switchMetaMaskToSepolia()
  } catch (error) {
    walletError.value = getWalletError(error)
  }
}

async function sendTransaction() {
  walletError.value = ''
  transferStatus.value = ''
  transactionHash.value = ''

  if (!account.value) {
    walletError.value = 'Prvo poveži svoj MetaMask novčanik.'
    return
  }
  if (!isOnSepolia.value) {
    walletError.value = 'Za slanje transakcije prebaci MetaMask na Sepolia mrežu.'
    return
  }
  isSending.value = true
  try {
    transactionHash.value = await sendSepoliaEth(
      recipientAddress.value,
      transferAmount.value,
    )
    transferStatus.value = 'Transakcija je poslana. Pričekaj potvrdu na Sepolia mreži.'
  } catch (error) {
    walletError.value = getWalletError(error)
  } finally {
    isSending.value = false
  }
}

function handleAccountsChanged(accounts) {
  account.value = accounts[0] || ''
  if (!account.value) transferStatus.value = ''
}

function handleChainChanged(newChainId) {
  chainId.value = BigInt(newChainId)
}

onMounted(() => {
  if (!isMetaMaskAvailable()) return
  window.ethereum.on('accountsChanged', handleAccountsChanged)
  window.ethereum.on('chainChanged', handleChainChanged)
  refreshWallet()
})

onUnmounted(() => {
  if (!isMetaMaskAvailable()) return
  window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
  window.ethereum.removeListener('chainChanged', handleChainChanged)
})

function showProposalNotice() {
  notice.value = 'Kreiranje prijedloga uskoro će biti dostupno.'
}
</script>

<template>
  <div class="site-shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="StudentVote početna stranica">
        <span class="brand-name">StudentVote</span>
      </a>

      <nav class="main-nav" aria-label="Glavna navigacija">
        <a class="nav-link nav-link-current" href="#prijedlozi">Prijedlozi</a>
        <a class="nav-link" href="#kako-radi">Kako funkcionira</a>
      </nav>

      <button
        class="wallet-button"
        type="button"
        :disabled="isConnecting"
        @click="connectWallet"
      >
        <span>{{ isConnecting ? 'Povezivanje...' : shortAccount || 'Poveži novčanik' }}</span>
      </button>
    </header>
    <p v-if="walletError" class="wallet-feedback" role="alert">
      {{ walletError }}
    </p>

    <main>
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <div class="eyebrow">ZAJEDNO ODLUČUJEMO</div>
          <h1 id="hero-title">Tvoj glas.<br />Naša <span>zajednička</span> budućnost.</h1>
          <p class="hero-description">
            Predloži ideju, podrži promjene i sudjeluj u odlukama koje oblikuju
            studentski život.
          </p>
          <div class="hero-actions">
            <a class="primary-button" href="#prijedlozi">
              Istraži prijedloge
            </a>
            <button class="text-button" type="button" @click="showProposalNotice">
              Predloži ideju
            </button>
          </div>
          <div class="network-note">
            Transparentno glasanje na Ethereum Sepolia mreži
          </div>
        </div>
      </section>

      <section class="transfer-section" aria-labelledby="transfer-title">
        <div class="transfer-card">
          <div class="eyebrow section-eyebrow">SEPOLIA TESTNA MREŽA</div>
          <h2 id="transfer-title">Pošalji ETH kolegi</h2>
          <p class="transfer-description">
            Pošalji testni ETH na adresu kolege. Transakciju ćeš pregledati i potvrditi u MetaMasku.
          </p>

          <div v-if="account" class="wallet-state">
            <span class="wallet-indicator" :class="{ 'wallet-indicator-connected': isOnSepolia }"></span>
            <span>{{ shortAccount }} · {{ isOnSepolia ? 'Spojeno na Sepolia' : 'Pogrešna mreža' }}</span>
            <button v-if="!isOnSepolia" class="outline-button" type="button" @click="switchToSepolia">
              Prebaci na Sepolia
            </button>
          </div>
          <p v-else class="wallet-hint">Poveži MetaMask novčanik za slanje transakcije.</p>

          <form class="transfer-form" @submit.prevent="sendTransaction">
            <label class="form-field">
              <span>Adresa primatelja</span>
              <input
                v-model="recipientAddress"
                type="text"
                inputmode="text"
                autocomplete="off"
                placeholder="0x..."
                required
              />
            </label>
            <label class="form-field">
              <span>Iznos (ETH)</span>
              <input
                v-model="transferAmount"
                type="text"
                inputmode="decimal"
                autocomplete="off"
                placeholder="0.01"
                required
              />
            </label>
            <button
              class="primary-button transfer-button"
              type="submit"
              :disabled="isSending || !account || !isOnSepolia"
            >
              {{ isSending ? 'Slanje...' : 'Pošalji ETH' }}
            </button>
          </form>

          <p v-if="walletError" class="transfer-message transfer-error" role="alert">
            {{ walletError }}
          </p>
          <p v-if="transferStatus" class="transfer-message" role="status">
            {{ transferStatus }}
            <a
              v-if="transactionHash"
              :href="`https://sepolia.etherscan.io/tx/${transactionHash}`"
              target="_blank"
              rel="noreferrer"
            >
              Pogledaj transakciju
            </a>
          </p>
        </div>
      </section>

      <section class="stats" aria-label="StudentVote u brojkama">
        <div class="stat-item">
          <span class="stat-copy"><strong>1.240+</strong><small>članova zajednice</small></span>
        </div>
        <div class="stat-item">
          <span class="stat-copy"><strong>{{ proposalStore.proposals.length }}</strong><small>objavljena prijedloga</small></span>
        </div>
        <div class="stat-item">
          <span class="stat-copy"><strong>{{ proposalStore.totalVotes }}</strong><small>zabilježenih glasova</small></span>
        </div>
        <div class="stat-item stat-item-status">
          <span class="stat-copy"><strong>{{ proposalStore.activeCount }} aktivna</strong><small>glasanja su otvorena</small></span>
        </div>
      </section>

      <section id="prijedlozi" class="proposals-section" aria-labelledby="proposals-title">
        <div class="section-heading">
          <div>
            <div class="eyebrow section-eyebrow">TVOJA ZAJEDNICA, TVOJ UTJECAJ</div>
            <h2 id="proposals-title">Prijedlozi zajednice</h2>
            <p>Ideje koje mogu učiniti studentski život boljim.</p>
          </div>
          <button class="outline-button" type="button" @click="showProposalNotice">
            <span>+</span> Novi prijedlog
          </button>
        </div>

        <div class="proposal-toolbar">
          <div class="filter-list" role="tablist" aria-label="Filtriraj prijedloge">
            <button
              v-for="filter in filters"
              :key="filter.id"
              class="filter-button"
              :class="{ 'filter-button-active': selectedFilter === filter.id }"
              type="button"
              role="tab"
              :aria-selected="selectedFilter === filter.id"
              @click="selectedFilter = filter.id"
            >
              {{ filter.label }}
            </button>
          </div>
          <label class="search-box">
            <input v-model="searchQuery" type="search" placeholder="Pretraži prijedloge" aria-label="Pretraži prijedloge" />
          </label>
        </div>

        <div v-if="visibleProposals.length" class="proposal-grid">
          <article v-for="proposal in visibleProposals" :key="proposal.id" class="proposal-card">
            <div class="card-meta">
              <span class="category-tag">{{ proposal.category }}</span>
              <span v-if="proposal.status === 'active'" class="status-tag">
                U tijeku
              </span>
              <span v-else class="status-tag status-tag-ended">Završeno</span>
            </div>
            <h3>{{ proposal.title }}</h3>
            <p class="proposal-description">{{ proposal.description }}</p>
            <div class="vote-summary">
              <div class="vote-labels">
                <span>Za <strong>{{ proposal.votesFor }}</strong></span>
                <span>Protiv <strong>{{ proposal.votesAgainst }}</strong></span>
              </div>
              <div
                class="vote-progress"
                role="img"
                :aria-label="`${Math.round((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100)} posto glasova za`"
              >
                <span :style="{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }"></span>
              </div>
            </div>
            <div class="card-footer">
              <div class="author">
                <span class="author-avatar">{{ proposal.initials }}</span>
                <span>{{ proposal.author }}</span>
              </div>
              <span v-if="proposal.status === 'active'" class="time-left">
                Još {{ proposal.daysLeft }} dana
              </span>
              <span v-else class="time-left">Glasanje zaključeno</span>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">
          <strong>Nema pronađenih prijedloga</strong>
          <p>Pokušaj promijeniti pretragu ili odabrani filter.</p>
        </div>
      </section>

      <section id="kako-radi" class="how-it-works">
        <div class="how-copy">
          <div class="eyebrow section-eyebrow">JEDNOSTAVNO I TRANSPARENTNO</div>
          <h2>Promjene počinju<br />jednim glasom.</h2>
          <p>StudentVote koristi governance tokene kako bi članovi zajednice mogli ravnopravno sudjelovati u donošenju odluka.</p>
        </div>
        <div class="steps">
          <div class="step">
            <span class="step-number">01</span>
            <div><strong>Poveži se</strong><p>Poveži svoj novčanik na Sepolia mreži.</p></div>
          </div>
          <div class="step">
            <span class="step-number">02</span>
            <div><strong>Odaberi prijedlog</strong><p>Pregledaj ideje i odaberi onu koja ti je važna.</p></div>
          </div>
          <div class="step">
            <span class="step-number">03</span>
            <div><strong>Glasaj transparentno</strong><p>Tvoj glas bilježi se na blockchainu.</p></div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <a class="brand footer-brand" href="#" aria-label="StudentVote početna stranica">
        <span class="brand-name">StudentVote</span>
      </a>
      <p>Stvoreno za studentsku zajednicu.</p>
      <span class="footer-network">Sepolia testna mreža</span>
    </footer>

    <div v-if="notice" class="notice" role="status">
      <span>{{ notice }}</span>
      <button type="button" aria-label="Zatvori obavijest" @click="notice = ''">Zatvori</button>
    </div>
  </div>
</template>
