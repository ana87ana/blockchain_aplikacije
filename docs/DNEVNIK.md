# AI dnevnik

## T1 — Postavljanje projekta (19.10.2026.)
- Cilj termina: Postaviti projekt
- Najkorisniji prompt (kopiran u cijelosti): možeš li mi urediti da bude još jednostavnije, bez previše slika i ikona, kako bi to mogla kasnije dodavat
- Što je AI napravio dobro: vrlo dobro je shvatio zahtjeve aplikacije
- Što je AI napravio drugačije nego što sam očekivao: na prvom upitu je napravio puno više nego što je prvo napisano u promptu
- Što sam dodao u AGENTS.md: Osnovne informacije o projektu
- Provjera: Čitanje kroz kod
- Commit: Uvodni sat i početni frontend aplikacije


## T2 — Napraviti Wallet i osnovne transakcije(26.10.2026.)
- Cilj termina: Napraviti Wallet u MetaMasku i napraviti prvu transakciju
- Najkorisniji prompt (kopiran u cijelosti): na frontendu napravi da se mogu spojiti sa svojim metamask walletom i da mogu poslati transakciju kolegi
- Što je AI napravio dobro: nakon prompta me pitao što točno želim poslati i ponudio točan odgovor
- Što je AI napravio drugačije nego što sam očekivao: prvobitno je samo napravio promjene na frontendu, a iako nisam napisala, očekivala sam da će i backend dio isto napraviti
- Što sam dodao u AGENTS.md: Ništa
- Provjera: npm run dev i slanje Sepolie kolegi
- Commit: Dodana mogućnost povezivanja Walleta i mogućnost transakcije

## T3 — Specifikacija prije koda (02.11.2026.)
- Cilj termina: napisati specifikaciju svog tokena i modula koja je dovoljno precizna da AI iz nje može napisati
pametni ugovor bez nagađanja
- Najkorisniji prompt (kopiran u cijelosti): Ti si strogi recenzent specifikacija pametnih ugovora. Pročitaj specifikaciju u nastavku
i pronađi:
1. kontradikcije,
2. rubne slučajeve koje nijedan kriterij prihvaćanja ne pokriva,
3. načine na koje bi korisnik ili administrator mogao zloupotrijebiti pravila,
4. kriterije koji nisu provjerljivi.
Za svaki nalaz navedi točan odjeljak i predloži konkretan kriterij prihvaćanja.
Ne prepravljaj specifikaciju i ne hvali je.
to moraš napraviti za spec.md koji ti je dodan u kontekst

- Što je AI napravio dobro: postavlja pitanja prije svake odluke
- Što je AI napravio drugačije nego što sam očekivao: 
- Što sam dodao u AGENTS.md: Promjena teme projekta, novi naziv i opis
- Provjera: npm run dev radi i interface prolazi u remix.live bez grešaka
- Commit: 72da7a3654037b8cc44f105133950cbf84688571

| Nalaz | Odluka (prihvaćeno / odbijeno) | Obrazloženje |
|---|---|---|
| 1. Izdavanje nakon aktivnosti je istodobno opisano kao pravilo i kao nerazrađeno | prihvaćeno | Detalji neki su još podložni promjenama pa u odgovorima nisu dani speifični uvjeti |

| 3. Administratorska uloga je obvezna, ali početno postavljanje i oporavak nisu definirani | prihvaćeno | U prvoj verziji specifikacije nije spomenuto ni postavljanje ni oporavak, što je AI kao kritičar uočio i to je sad ispravljeno |

| 4. Prijenosno odobrenje nije dovoljno precizno definirano da bi se znalo što točno odobrava | odbijeno | Nalaz je odbijen jer iako je kritika dobro postavljena, rješenje nije bilo zadovoljavajuće. Predloženo je povezivanje odobravanja s korisnicima, a ne s adminom |

| 5. Nisu određeni rubni uvjeti iznosa i adresa | prihvaćeno | Na početku nisu bili specificirani uvjeti, sada je točno određeno koliko se smije prenijesti i tko smije poslati token kako bi glasanje bilo moguće|

| 6. Kriterij ne pokriva ponovljeno izdavanje za isto sudjelovanje | prihvaćeno | Nije bilo specificirano prije, član može dobiti određenu količinu tokena za sudjelovanje samo jednom|

## T4 — Testovi(16.11.2026.)
- Cilj termina: Upoznati se s Hardhatom i provesti testove
- Najkorisniji prompt (kopiran u cijelosti): U docs/SPEC.md su kriteriji prihvaćanja za token (K1, K2, ...), a u
contracts/lapp:klub_mladih.sol je ugovor.
Napiši Hardhat 3 testove u test/ZTN.test.js: JavaScript (ne TypeScript),
ESM,
mocha + chai, ethers v6, na početku:
import { network } from "hardhat"; const { ethers } = await
network.connect();
Pravila:
- jedan it() po kriteriju tokena, naziv počinje oznakom kriterija (npr. "K3:
...");
- za neuspješne kriterije koristi revertedWith s točnom porukom iz ugovora;
- za događaje koristi emit(...).withArgs(...);
- svaki test sam priprema stanje u beforeEach, bez ovisnosti o drugim
testovima;
- ne mijenjaj ugovor; ako kriterij nije moguće testirati, napiši to kao
komentar.

- Što je AI napravio dobro: Konstantno pita dodatna pitanja kako bi vrlo precizno napravio što prompt traži
- Što je AI napravio drugačije nego što sam očekivao: dodao mape koje nisam očekivala da će dodati
- Što sam dodao u AGENTS.md: ništa
- Provjera: npx hardhat test 
- Commit: 
- Prompt: Napiši Hardhat 3 testove u 'test/ZTN.test.js' za kriterije tokena iz 'docs/SPEC.md', koristeći JavaScript, ESM, Mocha, Chai i ethers v6; svaki test neka bude neovisan, a kriteriji koji se ne mogu testirati neka budu označeni komentarom.
- Testova: 11, prolazi: 8
- Greška AI-ja koju sam uočio: nije bilo pada testa, 'network.connect()' prikazao je bezopasno upozorenje o zastarijevanju.
- Mutacijska provjera: maknuo sam 'require(msg.sender == owner(), "Samo administrator moze dodijeliti ZTN.");', pao je test 'K4: odbija dodjelu tokena od ne-administratora', a 'require' je vraćen.
- Contract Deployment:
Contract deployment: ZTN
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0x0d2f4dbfc3e54a09506b75a458ab57628c4fbb45b87dc8de4ad42d4d3121d408
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            1463256 of 1463256
  Block #1:            0x2cfca6942512d1bddff63fe3dcf3ac3cb0d86d8851c0ef4c708613efae769657
### Vježba 4: objava na lokalnoj mreži
- Adresa ugovora / hash transakcije / blok / gas: 
  Ugovor ZTN objavljen je na adresi "0x5fbdb2315678afecb367f032d93f642f64180aa3", transakcija je "0x0d2f4dbfc3e54a09506b75a458ab57628c4fbb45b87dc8de4ad42d4d3121d408", blok je 1, a potrošeno je 1.463.256 gasa.
- Zašto objava troši gas, a čitanje salda ne?
  Objava zapisuje bytecode i početno stanje ugovora na blockchain, dok je čitanje salda uobičajeno "eth_call" koji ne mijenja stanje i ne troši gas korisnika.
- Zašto je druga transakcija (postaviAdministratora) potrošila puno manje
gasa od objave?
  U ovoj objavi nije bilo druge transakcije "postaviAdministratora" jer se vlasnik postavlja u konstruktoru, a općenito promjena jedne vrijednosti stanja troši manje gasa od objave cijelog ugovora.
- Što bi se dogodilo s ugovorom da sad ugasim npx hardhat node?
  Ugovor i njegovo stanje nestali bi s ugašenom privremenom lokalnom mrežom, ali ugovor objavljen na Sepoliji ne bi bio pogođen.



