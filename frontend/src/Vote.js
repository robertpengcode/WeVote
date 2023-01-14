import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import ProgressBar from "react-bootstrap/ProgressBar";

const Vote = ({ contract }) => {
  const [votesArr, setVotesArr] = useState([]);
  const gateway = "https://gateway.pinata.cloud/";

  useEffect(() => {
    if (!contract) return;

    const filter = contract.filters.CreateVote();
    contract
      .queryFilter(filter)
      .then((result) => {
        createdVotesProcessor(result);
      })
      .catch((err) => console.log("err", err));
  }, [contract]);

  const createdVotesProcessor = async (votesCreated) => {
    const promises = [];
    const votesData = [];
    for (const voteCreated of votesCreated) {
      const voteId = voteCreated.args.voteId.toNumber();
      const promise = contract
        .getVote(voteId)
        .then(async (voteData) => {
          const owner = voteData[0];
          const uri = voteData[1];
          if (!uri) return;
          const record = voteData[3].map((num) => num.toNumber());
          const endTime = voteData[4].toNumber();
          const processedVote = {
            owner: owner,
            index: voteId,
            votes: record,
            total: record.reduce((sum, num) => sum + num, 0),
            endTime: endTime,
          };

          try {
            await fetch(gateway + uri)
              .then((result) => result.json())
              .then((data) => {
                processedVote.description = data.description;
                processedVote.options = data.options;
              });
          } catch (err) {
            console.log(err);
          }
          votesData.push(processedVote);
        })
        .catch((err) => {
          console.log(err);
        });

      promises.push(promise);
    }
    await Promise.all(promises);
    setVotesArr(votesData);
  };

  const voteFunc = async (voteId, option) => {
    await contract
      .vote(voteId, option)
      .then(() => alert("vote success!"))
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Container>
      {votesArr.map((vote, id) => (
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
