import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NavbarTop from "./Navbar";
import CreateVote from "./CreateVote";
import Vote from "./Vote";
import { connect, getContract } from "./contract";
import { useState, useEffect } from "react";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        setIsConnected(true);
        getContract().then(({ contract, signer }) => {
          setContract(contract);
          if (contract) {
            signer.getAddress().then((address) => {
              contract.members(address).then((result) => {
                setIsMember(result);
              });
            });
          }
        });
      } else {
        setIsConnected(false);
      }
    });
  }, []);

  const connectMetaMask = async () => {
    //console.log("run connect");
    const { contract } = await connect();
    if (contract) {
      setContract(contract);
      setIsConnected(true);
      alert("Connect!");
    }
  };

  const joinMember = async () => {
    //console.log("run join");
    if (!contract) {
      alert("Please connect to MetaMask!");
    } else {
      await contract
        .joinMember()
        .then(() => {
          setIsMember(true);
          alert("Joint!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="App">
      <Router>
        <NavbarTop
          connectMetaMask={connectMetaMask}
          joinMember={joinMember}
          isConnected={isConnected}
          isMember={isMember}
        />
        <div className="container">
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="create-vote" element={<CreateVote />} />
            <Route path="vote" element={<Vote />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
