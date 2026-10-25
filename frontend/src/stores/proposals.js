import { defineStore } from 'pinia'

export const useProposalStore = defineStore('proposals', {
  state: () => ({
    proposals: [
      {
        id: 1,
        title: 'Više prostora za učenje u večernjim satima',
        description:
          'Produžimo radno vrijeme čitaonice tijekom ispitnih rokova i osigurajmo miran prostor za sve studente.',
        category: 'Studentski standard',
        status: 'active',
        votesFor: 128,
        votesAgainst: 34,
        daysLeft: 3,
        author: 'Mia K.',
        initials: 'MK',
      },
      {
        id: 2,
        title: 'Održivi povratni sustav za čaše',
        description:
          'Uvedimo povratne čaše u studentske kantine i smanjimo količinu jednokratne plastike na kampusu.',
        category: 'Održivost',
        status: 'active',
        votesFor: 96,
        votesAgainst: 21,
        daysLeft: 6,
        author: 'Luka P.',
        initials: 'LP',
      },
      {
        id: 3,
        title: 'Radionice financijske pismenosti',
        description:
          'Organizirajmo besplatne mjesečne radionice o osobnim financijama, stipendijama i studentskim pravima.',
        category: 'Edukacija',
        status: 'active',
        votesFor: 74,
        votesAgainst: 18,
        daysLeft: 9,
        author: 'Sara B.',
        initials: 'SB',
      },
      {
        id: 4,
        title: 'Uređenje zajedničke studentske terase',
        description:
          'Pretvorimo neiskorišteni prostor u ugodno mjesto za druženje, odmor i studentska događanja.',
        category: 'Kampus',
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
