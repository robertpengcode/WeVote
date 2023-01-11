const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("WeVote", function () {
  let owner;
  let user2;
  let user3;
  let weVote;

  before(async () => {
    [owner, user2, user3] = await ethers.getSigners();
    const WeVote = await ethers.getContractFactory("WeVote");
    weVote = await WeVote.deploy();
    await weVote.deployed();
  });

  describe("Join Member", function () {
    it("Should join member", async function () {
      await expect(weVote.joinMember()).to.emit(weVote, "Join");
    });
    it("Should not join member - member already", async function () {
      await expect(weVote.joinMember()).to.be.revertedWith(
        "you are already a member"
      );
    });
  });

  describe("Create Vote", function () {
    it("Should not create vote - member only", async function () {
      const futureTime = (await time.latest()) + 300;
      await expect(
        weVote.connect(user2).createVote("testUri", 2, futureTime)
      ).to.be.revertedWith("member only");
    });
    it("Should not create vote - invalid end time", async function () {
      const pastTime = (await time.latest()) - 300;
      await expect(
        weVote.createVote("testUri", 2, pastTime)
      ).to.be.revertedWith("end time must be in the future");
    });
    it("Should not create vote - invalid options", async function () {
      const futureTime = (await time.latest()) + 300;
      await expect(
        weVote.createVote("testUri", 1, futureTime)
      ).to.be.revertedWith("# of options should between 2 and 5");
      await expect(
        weVote.createVote("testUri", 6, futureTime)
      ).to.be.revertedWith("# of options should between 2 and 5");
    });
    it("Should create vote", async function () {
      const futureTime = (await time.latest()) + 300;
      await expect(weVote.createVote("testUri", 4, futureTime)).to.emit(
        weVote,
        "CreateVote"
      );
    });
  });

  describe("Vote", function () {
    it("Should not vote - member only", async function () {
      await expect(weVote.connect(user3).vote(0, 2)).to.be.revertedWith(
        "member only"
      );
    });
    it("Should not vote - invalid vote id", async function () {
      await expect(weVote.vote(1, 2)).to.be.revertedWith("invalid vote id");
    });
    it("Should not vote - invalid option", async function () {
      await expect(weVote.vote(0, 5)).to.be.revertedWith("invalid option");
    });
    it("Should vote", async function () {
      await expect(weVote.vote(0, 2)).to.emit(weVote, "Voted");
    });
    it("Should not vote - voted already", async function () {
      await expect(weVote.vote(0, 2)).to.be.revertedWith(
        "you have voted already"
      );
    });
    it("Should not vote - vote ended", async function () {
      const futureTime = (await time.latest()) + 60;
      await weVote.createVote("testUri2", 4, futureTime);
      await time.increaseTo(futureTime + 1);
      await expect(weVote.vote(1, 2)).to.be.revertedWith("vote ended");
    });
  });
});
