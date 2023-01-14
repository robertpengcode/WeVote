import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import ProgressBar from "react-bootstrap/ProgressBar";

const Vote = ({ contract }) => {
  const [votesArr, setVotesArr] = useState([]);

  useEffect(() => {}, [contract]);

  const voteFunc = async () => {
    await contract
      .vote()
      .then(() => alert("vote success!"))
      .catch((err) => {
        alert(err.message);
      });
  };

  const vote1 = {
    index: 0,
    description: "Who was the best NBA player?",
    options: [
      "Larry Bird",
      "Michael Jordan",
      "Kobe Bryant",
      "LeBron James",
      "Stephen Curry",
    ],
    votes: [1, 5, 3, 2, 2],
    total: 13,
  };
  const vote2 = {
    index: 1,
    description: "What is your favorite programming language?",
    options: ["Java", "C++", "Python", "JavaScript", "Solidity"],
    votes: [1, 2, 3, 4, 5],
    total: 15,
  };
  const testVotes = [vote1, vote2];

  return (
    <Container>
      {testVotes.map((vote, id) => (
        <Card key={id} className="my-2">
          <Card.Header>{vote.description}</Card.Header>
          <Card.Body>
            {vote.options.map((option, idx) => (
              <div key={idx}>
                <p>
                  {option}:{" "}
                  {Math.round(
                    (vote.votes[idx] * 100) / Math.max(1, vote.total)
                  )}
                  %
                </p>
                <div className="d-flex align-items-center">
                  <ProgressBar
                    now={(vote.votes[idx] * 100) / Math.max(1, vote.total)}
                    className="w-100 me-2"
                  />
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => voteFunc(vote.index, idx)}
                  >
                    Vote
                  </Button>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Vote;
