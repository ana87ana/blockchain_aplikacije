import { defineStore } from 'pinia'

export const useProposalStore = defineStore('proposals', {
  state: () => ({
    proposals: [
      {
        id: 1,
        title: 'Filmska večer petkom',
        description:
          'Okupimo se jednom tjedno uz dobar film, grickalice i druženje nakon projekcije.',
        category: 'Filmska večer',
        status: 'active',
        votesFor: 128,
        votesAgainst: 34,
        daysLeft: 3,
        author: 'Mia K.',
        initials: 'MK',
      },
      {
        id: 2,
        title: 'Pokrenimo knjižni klub',
        description:
          'Birajmo knjigu svakog mjeseca i nađimo se za opušten razgovor o pročitanom.',
        category: 'Knjižni klub',
        status: 'active',
        votesFor: 96,
        votesAgainst: 21,
        daysLeft: 6,
        author: 'Luka P.',
        initials: 'LP',
      },
      {
        id: 3,
        title: 'Jednodnevni izlet u prirodu',
        description:
          'Provedimo dan zajedno na izletu, uz šetnju, istraživanje i zajednički ručak.',
        category: 'Izleti',
        status: 'active',
        votesFor: 74,
        votesAgainst: 18,
        daysLeft: 9,
        author: 'Sara B.',
        initials: 'SB',
      },
      {
        id: 4,
        title: 'Zajedno na koncert',
        description:
          'Odaberimo koncert na koji ćemo otići kao ekipa i dogovorimo zajednički prijevoz.',
        category: 'Koncerti',
        status: 'ended',
        votesFor: 183,
        votesAgainst: 42,
        daysLeft: 0,
        author: 'Ivan R.',
        initials: 'IR',
      },
    ],
  }),
  getters: {
    activeCount: (state) =>
      state.proposals.filter((proposal) => proposal.status === 'active').length,
    totalVotes: (state) =>
      state.proposals.reduce(
        (total, proposal) => total + proposal.votesFor + proposal.votesAgainst,
        0,
      ),
  },
})
