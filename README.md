# Blockchain projekt

### Autor: Ana Rogalo

### Smjer: Diplomski studij informatike

### Godina: 2. godina

### Aplikacija StudentVote: 
    - Aplikacija koja omogućuje članovima studentske zajednice kreiranje prijedloga i transparentno glasanje putem pametnih ugovora

## Slanje ETH-a putem frontenda

Frontend se pokreće iz mape `frontend/` naredbom `npm run dev`. Povezivanje MetaMaska i slanje transakcija obrađuje `ethers` v6 u `frontend/src/wallet.js`. U pregledniku s instaliranim MetaMaskom odaberi **Poveži novčanik**, prebaci se na mrežu **Sepolia**, zatim unesi adresu primatelja i iznos testnog ETH-a. Svaku transakciju potrebno je pregledati i potvrditi u MetaMasku; za nju je potreban i Sepolia ETH za naknadu mreže. Transakcije se mogu provjeriti na Sepolia Etherscanu.