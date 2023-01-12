import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const wevoteAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const wevoteAbi = [
  "event CreateVote(address indexed owner, uint256 indexed voteId, uint256 timestamp, uint256 endTime)",
  "event Join(address indexed user, uint256 timestamp)",
  "event Voted(address indexed voter, uint256 indexed voteId, uint256 indexed optionIdx, uint256 timestamp)",
  "function createVote(string voteURI, uint256 numOfOptions, uint256 endTime)",
  "function getIsVoted(address user, uint256 voteId) view returns (bool)",
  "function getVote(uint256 voteId) view returns (address, string, uint256, uint256[], uint256)",
  "function joinMember()",
  "function members(address) view returns (bool)",
  "function vote(uint256 voteId, uint256 optionIdx)",
];

export const connect = async () => {
  await provider.send("eth_requestAccounts", []);
  return getContract();
};

export const getContract = async () => {
  const signer = provider.getSigner();
  const wevoteContract = new ethers.Contract(wevoteAddress, wevoteAbi, signer);
  return { contract: wevoteContract, signer: signer };
};
