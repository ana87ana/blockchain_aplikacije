<script setup>
import { computed, ref } from 'vue'
import { useProposalStore } from './stores/proposals'

const proposalStore = useProposalStore()
const selectedFilter = ref('all')
const searchQuery = ref('')
const notice = ref('')

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

function showWalletNotice() {
  notice.value = 'Povezivanje novčanika bit će dostupno kada povežemo aplikaciju s mrežom Sepolia.'
}

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

      <button class="wallet-button" type="button" @click="showWalletNotice">
        <span>Poveži novčanik</span>
      </button>
    </header>

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
