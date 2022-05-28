import { Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
// import Axios from "axios";
import Web3Modal from "web3modal";
import {
  VK_NFT,
  VK_NFT_ABI,
  PVS_NFT,
  PVS_NFT_ABI,
  MESSI_NFT,
  MESSI_NFT_ABI,
} from "../constants";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  let contractAddr = "";
  let contractABI = "";
  let celebNameEvent = "Gardening";
  let celebName = "Pokemon";

  // // Extra
  // const [movieName, setMovieName] = useState("");
  // const [review, setReview] = useState("");
  // const [movieReviewList, setMovieList] = useState([]);

  // useEffect(() => {
  //   Axios.get("http://localhost:3000/api/get").then((response) => {
  //     console.log(response.data);
  //     setMovieList(response.data);
  //     // EXTRA
  //   });
  // }, []);

  // const submitReview = () => {
  //   Axios.post("http://localhost:3001/api/insert", {
  //     movieName: movieName,
  //     movieReview: review,
  //   });
  //   setMovieList([
  //     ...movieReviewList,
  //     { movieName: movieName, movieReview: review },
  //   ]);
  // };

  // Set NFT_addr, NFT_ABI by accessing data from SQL
  // use useEffect, fetch data from sql and then take decision
  let condition = true;
  if (condition) {
    // VK NFT
    contractAddr = VK_NFT;
    contractABI = VK_NFT_ABI;
  } else if (condition) {
    // PVS NFT
    contractAddr = PVS_NFT;
    contractABI = PVS_NFT_ABI;
  } else if (condition) {
    // Messi NFT
    contractAddr = MESSI_NFT;
    contractABI = MESSI_NFT_ABI;
  } else {
    contractAddr = "";
    contractABI = "";
  }

  const web3ModalRef = useRef();

  const publicMint = async () => {
    try {
      if (contractABI || contractAddr) {
        const signer = await getProviderOrSigner(true);
        const nftContract = new Contract(contractAddr, contractABI, signer);
        const tx = await nftContract.mint({
          value: utils.parseEther("0"),
        });
        setLoading(true);
        await tx.wait();
        setLoading(false);
        window.alert(`You successfully claimed the NFT!!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getTokenIdsMinted = async () => {
    try {
      if (contractABI || contractAddr) {
        const provider = await getProviderOrSigner();
        const nftContract = new Contract(contractAddr, contractABI, provider);
        const _tokenIds = await nftContract.tokenIds();
        setTokenIdsMinted(_tokenIds.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
      getTokenIdsMinted();
      setInterval(async function () {
        await getTokenIdsMinted();
      }, 5 * 1000);
    }
  }, [walletConnected]);

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    if (loading) {
      return (
        <button disabled={loading} className={styles.button}>
          Loading...
        </button>
      );
    }

    return (
      <button className={styles.button} onClick={publicMint}>
        Public Mint 🚀
      </button>
    );
  };

  return (
    <div className={styles.body}>
      <Head>
        <title>{celebNameEvent}</title>
        <meta name="description" content="Celeb-NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.navMenu}>
        <div className={styles.navTitle}>{celebNameEvent}</div>
      </nav>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to {celebNameEvent} NFT collection!
          </h1>
          <div className={styles.description}>
            Congratulations!! you have successfully completed the tasks, so as
            for the reward you get to mint this NFT and enjoy the benifits
          </div>
          <div className={styles.description}>
            {tokenIdsMinted} people have been minted this NFT so far!!
          </div>
          {renderButton()}
        </div>
        {/* <div>
          <img className={styles.image} src="./LW3punks/1.png" />
        </div> */}
      </div>

      {/* <h1>CRUD Applications</h1>
      <div className={styles.form}>
        <label>Movie Name:</label>
        <input
          type="text"
          name="movieName"
          onChange={(e) => {
            setMovieName(e.target.value);
          }}
        />
        <label>Review:</label>
        <input
          type="text"
          name="review"
          onChange={(e) => {
            setReview(e.target.value);
          }}
        />
        <button onClick={submitReview}>Submit</button>

        {movieReviewList.map((val) => {
          return (
            <h1>
              movieName: {val.movieName} | movieReview: {val.movieReview}
            </h1>
          );
        })}
      </div> */}

      <footer className={styles.footer}>
        Made with &#10084; by Fantastic Four
      </footer>
    </div>
  );
}
