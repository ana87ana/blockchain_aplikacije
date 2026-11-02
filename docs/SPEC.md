# Specifikacija

## Opis
Članovi Kluba mladih predlažu aktivnosti i glasaju o tome što će zajedno organizirati, primjerice filmske večeri, knjižni klub, izlete i odlaske na koncerte. Token služi za sudjelovanje u glasanju, a glasanje se provodi putem pametnih ugovora na Ethereum Sepolia mreži.

## Korisnici i uloge
### Administrator
- Postoji jedan administrator.
- Potvrđuje sudjelovanje člana u aktivnosti i time odobrava izdavanje tokena.
- Može dodijeliti tokene i izvan potvrde sudjelovanja; dodatna pravila za takve dodjele još nisu definirana.
- Zasebno odobrava svaki prijenos tokena.

### Član Kluba mladih
- Predlaže aktivnosti.
- Sudjeluje u glasanju.
- Tokeni se troše prilikom glasanja.

## Odluke o tokenu
- Naziv: `Žeton`
- Oznaka: `ZTN`
- Broj decimala: `3`
- Izdavanje: administrator odobrava izdavanje tokena nakon potvrde sudjelovanja člana u aktivnosti. Administrator može dodijeliti tokene i u drugim slučajevima, ali pravila i uvjeti za te dodjele tek će se definirati.
- Ukupna količina: nije unaprijed ograničena.
- Količina: Ugovor odbija izdavanje i prijenos količine nula te primatelja nulte adrese; prihvaća samo cjelobrojnu količinu najmanjih jedinica tokena. Iznos iznad maksimalno podržane vrijednosti ne mijenja stanje i uzrokuje neuspjeh s točno navedenom porukom
- Prenosivost: prijenos je dopušten samo uz prethodno, zasebno odobrenje administratora za taj prijenos. Mogućnost odobravanja od drugih osoba nije definirana za ovu verziju.
- Trošenje: tokeni se troše pri glasanju. Količina tokena koja se troši po glasanju i način na koji se količina tokena odražava na glas još nisu definirani.
- Administratori: jedan administratorski novčanik. Pri postavljanju ugovora administrator je adresa navedena u konstruktoru; nulta adresa ne može biti administrator. Ako se podržava promjena administratora, samo trenutačni administrator može postaviti novu valjanu adresu, a nakon uspjeha stari administrator više ne može pozivati zaštićene funkcije
- Gubitak ključa: privatni ključ se ne može obnoviti. Preporuka analitičara, koja još nije potvrđena: unaprijed odrediti zamjenski novčanik koji može preuzeti administratorsku ulogu.

## Odluke o modulu
- Modul obuhvaća predlaganje aktivnosti i glasanje članova o tome što će Klub mladih organizirati.
- Tokeni se troše pri glasanju.
- Format glasanja, količina tokena potrebna za glasanje, mogućnost ponovnog glasanja i način određivanja rezultata nisu specificirani.

## Funkcije

| Funkcija | Tko je smije pozvati | Ulazni podaci | Što radi | Kada pada i s kojom porukom |
|---|---|---|---|---|
| Odobravanje izdavanja tokena | Administrator | Član, količina tokena i potvrda sudjelovanja u aktivnosti | Odobrava izdavanje tokena članu nakon sudjelovanja. | Pozivatelj nije administrator: `Samo administrator moze odobriti izdavanje ZTN-a.` |
| Dodjela tokena izvan aktivnosti | Administrator | Primatelj i količina tokena | Omogućuje administratoru dodatnu dodjelu tokena; njezina dodatna pravila nisu definirana. | Pozivatelj nije administrator: `Samo administrator moze dodijeliti ZTN.` |
| Odobravanje prijenosa | Administrator | Podaci o prijenosu | Zasebno odobrava pojedini prijenos prije njegova izvršenja. | Pozivatelj nije administrator: `Samo administrator moze odobriti prijenos ZTN-a.` |
| Prijenos tokena | Član koji šalje tokene, nakon prethodnog odobrenja administratora | Primatelj i količina tokena | Prenosi tokene samo ako je taj prijenos prethodno odobren. | Prijenos nije prethodno odobren: `Prijenos ZTN-a nije odobren.`; pošiljatelj nema dovoljnu količinu: `Nedovoljno ZTN-a za prijenos.` |
| Predlaganje aktivnosti i glasanje | Član Kluba mladih | Pravila i ulazni podaci još nisu definirani | Omogućuje predlaganje aktivnosti i sudjelovanje u glasanju; glasanje troši tokene. | Uvjeti i poruke pogreške još nisu definirani. |

### Dodatni komentari
- Za aktivnost s jedinstvenim ID-jem i člana s jedinstvenom adresom, nakon evidentiranja potvrde sudjelovanja administrator može izdati točno definiranu količinu tokena; drugi pokušaj izdavanja za istu kombinaciju aktivnosti i člana ne mijenja stanje tokena.”
- Nakon uspješnog izdavanja za određeni par aktivnosti i člana, svaki ponovljeni pokušaj izdavanja za isti par ne uspije i ne mijenja ukupnu količinu ni stanje člana

## Matrica ovlasti

| Radnja | Administrator | Član Kluba mladih |
|---|---|---|
| Odobriti izdavanje tokena nakon aktivnosti | Da | Ne |
| Dodijeliti tokene izvan aktivnosti | Da, prema pravilima koja tek treba definirati | Ne |
| Odobriti pojedini prijenos tokena | Da | Ne |
| Izvršiti prijenos tokena | Samo ako je pošiljatelj tokena i prijenos je prethodno odobren | Da, samo uz prethodno odobrenje administratora |
| Predložiti aktivnost | Nije definirano | Da |
| Glasati | Nije definirano | Da; glasanje troši tokene |
| Preuzeti administratorsku ulogu u slučaju gubitka ključa | Nije definirano; zamjenski novčanik je samo preporuka | Nije definirano; zamjenski novčanik je samo preporuka |

## Model podataka na lancu
- ERC-20 naziv tokena, oznaka, broj decimala, ukupna količina i stanja tokena po adresama.
- Odobrenja za pojedine prijenose tokena.
- Podaci potrebni za predlaganje aktivnosti i glasanje još nisu definirani.
- Ne pohranjuju se privatni ključevi.

## Što se NE sprema na blockchain
- Privatni ključevi.
- Osobni podaci članova koji nisu potrebni za izvršavanje funkcija ugovora.
- Opis ostalih podataka izvan lanca nije dodatno specificiran.

## Kriteriji prihvaćanja

### K1 — Metapodaci tokena
- **Zadano:** Ugovor tokena je postavljen.
- **Kada:** Korisnik provjeri metapodatke tokena.
- **Tada:** Naziv je `Žeton`, oznaka je `ZTN`, a broj decimala je `3`.

### K2 — Izdavanje nakon potvrde aktivnosti
- **Zadano:** Administrator je potvrdio sudjelovanje člana u aktivnosti.
- **Kada:** Administrator odobri izdavanje dogovorene količine tokena tom članu.
- **Tada:** Tokeni se izdaju članu, a ukupna količina tokena povećava se za izdani iznos.

### K3 — Izdavanje tokena ne-administratoru
- **Zadano:** Pozivatelj nije administrator.
- **Kada:** Pokuša odobriti izdavanje tokena.
- **Tada:** Zahtjev ne uspije s točnom porukom `Samo administrator moze odobriti izdavanje ZTN-a.`

### K4 — Dodjela tokena izvan aktivnosti ne-administratoru
- **Zadano:** Pozivatelj nije administrator.
- **Kada:** Pokuša dodijeliti tokene izvan potvrde sudjelovanja u aktivnosti.
- **Tada:** Zahtjev ne uspije s točnom porukom `Samo administrator moze dodijeliti ZTN.`

### K5 — Odobravanje prijenosa ne-administratoru
- **Zadano:** Pozivatelj nije administrator.
- **Kada:** Pokuša odobriti prijenos tokena.
- **Tada:** Zahtjev ne uspije s točnom porukom `Samo administrator moze odobriti prijenos ZTN-a.`

### K6 — Prijenos bez prethodnog odobrenja
- **Zadano:** Administrator nije prethodno odobrio pojedini prijenos.
- **Kada:** Član pokuša izvršiti taj prijenos.
- **Tada:** Zahtjev ne uspije s točnom porukom `Prijenos ZTN-a nije odobren.`

### K7 — Prijenos iznad raspoloživog stanja
- **Zadano:** Administrator je odobrio prijenos, ali pošiljatelj nema dovoljno tokena.
- **Kada:** Pošiljatelj pokuša prenijeti više tokena nego što ima.
- **Tada:** Zahtjev ne uspije s točnom porukom `Nedovoljno ZTN-a za prijenos.`

### K8 — Prijenos nakon prethodnog odobrenja
- **Zadano:** Administrator je prethodno odobrio pojedini prijenos, a pošiljatelj ima dovoljnu količinu tokena.
- **Kada:** Pošiljatelj izvrši odobreni prijenos.
- **Tada:** Tokeni se prenesu primatelju.

### K9 — Dodjela tokena izvan aktivnosti od strane administratora
- **Zadano:** Pozivatelj je administrator, a primatelj i količina tokena su valjani.
- **Kada:** Administrator dodijeli tokene izvan potvrde sudjelovanja u aktivnosti.
- **Tada:** Tokeni se dodijele primatelju, a ukupna količina tokena poveća se za dodijeljeni iznos.

### K10 — Ukupna količina tokena bez unaprijed zadanog limita
- **Zadano:** Administrator izdaje valjanu količinu tokena.
- **Kada:** Ukupna količina nakon izdavanja premaši bilo koju ranije izdanu količinu.
- **Tada:** Izdavanje uspije jer nije postavljen unaprijed zadani ukupni limit.

### K11 — Potrošnja tokena pri glasanju
- **Zadano:** Član sudjeluje u glasanju i ima tokene koje glasanje troši.
- **Kada:** Njegov glas bude prihvaćen prema pravilima glasanja.
- **Tada:** Tokeni predviđeni za potrošnju pri tom glasanju oduzmu se od stanja člana.

## Izvan opsega
- Privatni ključevi.
- Osobni podaci članova koji nisu potrebni za izvršavanje funkcija ugovora.
- Opis ostalih podataka izvan lanca nije dodatno specificiran.

## Otvorena pitanja
- Koliko tokena član dobiva za sudjelovanje u aktivnosti i kako se potvrda evidentira?
- Koja su dodatna pravila za dodjelu tokena izvan aktivnosti?
- Hoće li u budućnosti prijenose moći odobravati i osobe osim administratora?
- Kako se postavlja administratorski novčanik?
- Potvrditi ili izmijeniti preporuku za unaprijed određeni zamjenski administratorski novčanik u slučaju gubitka ključa.
- Koliko se tokena troši po glasanju i kako količina utječe na glas?
- Koji je format glasanja, kako se određuje rezultat i smije li član glasati više puta?
- Koji su ulazni podaci i uvjeti za predlaganje aktivnosti?
- Koji su uvjeti neuspjeha i točne poruke pogreške za glasanje i dodatnu dodjelu tokena?

## Sljedivost
- Opis proizvoda i zajednice: zahtjev korisnika za glasanje članova Kluba mladih o zajedničkim aktivnostima.
- Token: odgovori korisnika tijekom analize zahtjeva — naziv `Žeton`, oznaka `ZTN`, `3` decimale, izdavanje za sudjelovanje u aktivnostima, bez unaprijed ograničene ukupne količine, ograničeni prijenosi uz prethodno odobrenje administratora i trošenje tokena pri glasanju.
- Uloge: odgovor korisnika — jedan administrator, koji potvrđuje izdavanje tokena, može dodatno dodjeljivati tokene prema pravilima koja će se definirati te odobrava svaki prijenos.
- Gubitak ključa: korisnik je zatražio preporuku; zamjenski administratorski novčanik naveden je kao preporuka koja čeka potvrdu.
