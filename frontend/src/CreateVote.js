import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

const CreateVote = ({ contract }) => {
  const [voteURI, setVoteURI] = useState("");
  const [numOfOptions, setNumOfOptions] = useState("");
  const [endTime, setEndTime] = useState("");

  const createVote = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .createVote(voteURI, numOfOptions, new Date(endTime).getTime() / 1000)
      .then(() => alert("create vote success!"))
      .catch((err) => {
        alert(err.message);
      });
    setVoteURI("");
    setNumOfOptions("");
    setEndTime("");
  };

  return (
    <Container>
      <h1 className="display-6 d-flex justify-content-center">
        Create Your Vote
      </h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>IPFS URI</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter IPFS URI"
            value={voteURI}
            onChange={(e) => {
              setVoteURI(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Number of Options</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter # of Options"
            value={numOfOptions}
            onChange={(e) => {
              setNumOfOptions(e.target.value);
            }}
            min="2"
            max="5"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="Enter End Date"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
            }}
          />
        </Form.Group>

        <Button variant="outline-success" onClick={createVote}>
          Create Vote
        </Button>
      </Form>
    </Container>
  );
};

export default CreateVote;
