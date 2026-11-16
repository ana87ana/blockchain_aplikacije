import { network } from "hardhat";
const { ethers } = await network.connect();
import { expect } from "chai";

describe("ZTN token", function () {
  let token;
  let administrator;
  let member;
  let recipient;
  let nonAdministrator;

  beforeEach(async function () {
    [administrator, member, recipient, nonAdministrator] = await ethers.getSigners();
    token = await ethers.deployContract("ZTN");
    await token.waitForDeployment();
  });

  it("K1: vraca metapodatke tokena", async function () {
    expect(await token.name()).to.equal("Žeton");
    expect(await token.symbol()).to.equal("ZTN");
    expect(await token.decimals()).to.equal(3);
  });

  it.skip("K2: izdaje tokene nakon potvrde aktivnosti", async function () {
    // Blokirano: ugovor nema funkciju izdavanja vezanu uz potvrdu sudjelovanja.
  });

  it.skip("K3: odbija izdavanje nakon aktivnosti od ne-administratora", async function () {
    // Blokirano: ugovor nema funkciju izdavanja nakon aktivnosti koju bi ne-administrator mogao pozvati.
  });

  it("K4: odbija dodjelu tokena od ne-administratora", async function () {
    await expect(
      token.connect(nonAdministrator).dodijeliZTN(recipient.address, 1n),
    ).to.be.revertedWith("Samo administrator moze dodijeliti ZTN.");
  });

  it("K5: odbija odobravanje prijenosa od ne-administratora", async function () {
    await expect(
      token.connect(nonAdministrator).odobriPrijenos(member.address, recipient.address, 1n),
    ).to.be.revertedWith("Samo administrator moze odobriti prijenos ZTN-a.");
  });

  it("K6: odbija prijenos bez prethodnog odobrenja", async function () {
    await token.dodijeliZTN(member.address, 1n);

    await expect(
      token.connect(member).transfer(recipient.address, 1n),
    ).to.be.revertedWith("Prijenos ZTN-a nije odobren.");
  });

  it("K7: odbija odobreni prijenos iznad raspolozivog stanja", async function () {
    await token.dodijeliZTN(member.address, 5n);
    await token.odobriPrijenos(member.address, recipient.address, 6n);

    await expect(
      token.connect(member).transfer(recipient.address, 6n),
    ).to.be.revertedWith("Nedovoljno ZTN-a za prijenos.");
  });

  it("K8: izvrsi prethodno odobreni prijenos i emitira Transfer", async function () {
    await token.dodijeliZTN(member.address, 5n);
    await token.odobriPrijenos(member.address, recipient.address, 3n);

    await expect(token.connect(member).transfer(recipient.address, 3n))
      .to.emit(token, "Transfer")
      .withArgs(member.address, recipient.address, 3n);

    expect(await token.balanceOf(member.address)).to.equal(2n);
    expect(await token.balanceOf(recipient.address)).to.equal(3n);
  });

  it("K9: administrator dodjeljuje tokene i povecava ukupnu kolicinu", async function () {
    await expect(token.dodijeliZTN(recipient.address, 7n))
      .to.emit(token, "Transfer")
      .withArgs(ethers.ZeroAddress, recipient.address, 7n);

    expect(await token.balanceOf(recipient.address)).to.equal(7n);
    expect(await token.totalSupply()).to.equal(7n);
  });

  it("K10: prihvaca izdavanje vece od prethodne ukupne kolicine", async function () {
    const largeAmount = 2n ** 200n;

    await token.dodijeliZTN(recipient.address, largeAmount);

    expect(await token.totalSupply()).to.equal(largeAmount);
    expect(await token.balanceOf(recipient.address)).to.equal(largeAmount);
  });

  it.skip("K11: trosi tokene nakon prihvacenog glasa", async function () {
    // Blokirano: glasanje i potrosnja tokena nisu implementirani u ugovoru.
  });
});
