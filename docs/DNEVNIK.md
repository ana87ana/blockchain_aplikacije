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

- Što je AI napravio dobro: 
- Što je AI napravio drugačije nego što sam očekivao:
- Što sam dodao u AGENTS.md: 
- Provjera: 
- Commit: 

| Nalaz | Odluka (prihvaćeno / odbijeno) | Obrazloženje |
|---|---|---|
| 1. Izdavanje nakon aktivnosti je istodobno opisano kao pravilo i kao nerazrađeno | prihvaćeno | Detalji neki su još podložni promjenama pa u odgovorima nisu dani speifični uvjeti |
| 3. Administratorska uloga je obvezna, ali početno postavljanje i oporavak nisu definirani | prihvaćeno | |
| 4. Prijenosno odobrenje nije dovoljno precizno definirano da bi se znalo što točno odobrava | odbijeno | Nalaz je odbijen jer iako je kritika dobro postavljena, rješenje nije bilo zadovoljavajuće. Predloženo je povezivanje odobravanja s korisnicima, a ne s adminom |
| 5. Nisu određeni rubni uvjeti iznosa i adresa | prihvaćeno | |
| 6. Kriterij ne pokriva ponovljeno izdavanje za isto sudjelovanje | prihvaćeno | |