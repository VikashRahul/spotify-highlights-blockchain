import { ethers } from 'ethers';
import './App.css';
import spotify from "./utils/spotify.json";
import React, {useEffect,useState} from "react";

const App=() => {


  const contractAddress = "0x99bC0cb58d5Be2d57266d41fC831896546595a70";
  const [message, setMessage] = useState("");
  const [CurrentAccount, setCurrentAccount]=useState("");
  const [allWaves, setAllWaves]=useState([]);

  const getAllWaves = async () => {
    try{

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const spotifyContract = new ethers.Contract(contractAddress, spotify.abi, signer);

        const waves = await spotifyContract.getAllWaves();

        console.log("these are the waves",waves);

      }
      // if(window.ethereum)
      // {
      //   const provider = new ethers.providers.Web3Provider(ethereum);
      //   const signer = provider.getSigner();
      //   const spotifyContract = new ethers.Contract(contractAddress, spotify.abi, signer);

      //   const waves = await spotifyContract.getAllWaves();

      //   console.log("these are the waves",waves);
      // }
    }
    catch(error)
    {
      console.log(error);
    }

   
  }

  const checkIfwalletisconnected = async() =>{
    try{
      const {ethereum} = window;

      if(!ethereum){
        console.log("make sure you have metamask");
        return;
      }
      else{
        console.log("we have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({method: 'eth_accounts'});

      if(accounts.length !==0)
      {
        const account = accounts[0];
        console.log("found an unauthorised account:",account);
        setCurrentAccount(account)
      }
      else{
        console.log("no authorised account found")
      }
    }
    catch(error)
    {
      console.log(error);
    }
  }

  const connectWallet = async()=>{
    try{
      const {ethereum} = window;

      if(!ethereum){
        console.log("make sure you have metamask");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});

      setCurrentAccount(accounts[0]);


    }
    catch(error){
      console.log(error);
    }
  }

  const wave = async()=>{
      try{
        
        const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const spotifyContract = new ethers.Contract(contractAddress, spotify.abi, signer);
        let count = await spotifyContract.getAllWaves();

        console.log("retrieved wave count", Number(count));
        const waveTxn = await spotifyContract.wave(message);
        console.log("mining.....",waveTxn.hash);

        await waveTxn.wait();
        getAllWaves();
        console.log("mined ...",waveTxn.hash);

        count = spotifyContract.getTotalWaves();


      }
    }catch(error)
      {
        console.log(error);
      }
  }

  useEffect(()=> {
    checkIfwalletisconnected();
  },[])


  return (
    <div className="App">
      <div className='header'>
      🎤 Spotify spotlights in the blockchain
      </div>
      <div className='bio'>
        Hi feel free to flex your spotify choices
      </div>
      
      <div>
       <input type ="text" placeholder="spotify links" className='box'
        onChange={(e)=> setMessage(e.target.value)}></input>
      </div>

      <div>
      <button className='waveButton' onClick={wave}>
        Wave at me
      </button>
      </div>

      { !CurrentAccount && (<div><button className='waveButton' onClick={connectWallet}>
        Connect Wallet
      </button>
      </div>
      )}

      <h1 style={{color:"black"}}>
        Best links below
      </h1>
      {console.log("all waves",allWaves)}

      {allWaves.map((wave,index)=>{
        return(
          <div key ={index} style ={{backgroundColor: "yellow", marginTop: "16px", padding: "20px"}}>
            <div>
              Address: {wave.address}
            </div>
            <div>
              time: {wave.timestamp}
            </div>
            <div>
              message: {wave.message}
            </div>
          </div>
        )
      })};
      
    </div>
  );
}

export default App;
