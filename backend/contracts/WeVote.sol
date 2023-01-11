// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract WeVote {
    uint nextVoteId;
    struct Vote {
        address owner;
        string voteURI;
        uint numOfOptions;
        uint[] votesRecord;
        mapping(address => bool) isVoted;
        uint endTime;
    }
    mapping(address => bool) members;
    mapping(uint => Vote) votes;

    modifier memberOnly {
        require(members[msg.sender], "member only");
        _;
    }

    modifier canVote(uint voteId, uint optionIdx) {
        require(voteId < nextVoteId, "invalid vote id");
        require(!votes[voteId].isVoted[msg.sender], "you have voted already");
        require(votes[voteId].endTime > block.timestamp, "vote ended");
        require(optionIdx < votes[voteId].numOfOptions, "invalid option");
        _;
    }

    event Join(address indexed user, uint timestamp);
    event CreateVote(address indexed owner, uint indexed voteId, uint timestamp, uint endTime);
    event Voted(address indexed voter, uint indexed voteId, uint indexed optionIdx, uint timestamp);

    function joinMember() external {
        require(!members[msg.sender], "you are already a member");
        members[msg.sender] = true;
        emit Join(msg.sender, block.timestamp);
    }

    function createVote(string calldata voteURI, uint numOfOptions, uint endTime) external memberOnly {
        require(endTime > block.timestamp, "end time must be in the future");
        require(numOfOptions > 1 && numOfOptions <= 5, "# of options should between 2 and 5");
        uint voteId = nextVoteId;
        Vote storage newVote = votes[voteId];
        newVote.owner = msg.sender;
        newVote.voteURI = voteURI;
        newVote.numOfOptions = numOfOptions;
        newVote.votesRecord = new uint[](numOfOptions);
        newVote.endTime = endTime;
        emit CreateVote(msg.sender, voteId, block.timestamp, endTime);
        nextVoteId++;
    }

    function vote(uint voteId, uint optionIdx) external memberOnly canVote(voteId, optionIdx){
        votes[voteId].votesRecord[optionIdx] += 1;
        votes[voteId].isVoted[msg.sender] = true;
        emit Voted(msg.sender, voteId, optionIdx, block.timestamp);
    }

    function getVote(uint voteId) external view memberOnly returns(address, string memory, uint, uint[] memory, uint){
        return(votes[voteId].owner,
        votes[voteId].voteURI,
        votes[voteId].numOfOptions,
        votes[voteId].votesRecord,
        votes[voteId].endTime);
    }

    function getIsVoted(address user, uint voteId) external view returns(bool){
        return votes[voteId].isVoted[user];
    }
}