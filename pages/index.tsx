import { useState } from "react";
import Image from "next/image";
import {
  ChainId,
  ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useMetamask,
  useMintNFT,
  useNFTs,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import style from "./Main.module.scss";
import Head from "next/head";

const Home: NextPage = () => {
  const address: any = useAddress();
  const connectWithMetamask = useMetamask();

  const [userInput, setUserInput] = useState<any>({
    name: "",
    file: "",
  });

  const inputHandler = (event: any) => {
    setUserInput({
      ...userInput,
      [event.target.name]: event.target.value,
    });
  };

  const imgHandler = (e: any) => {
    setUserInput({
      ...userInput,
      file: e.target.files[0],
    });
  };

  const { contract } = useContract(
    // "0xAbccaFf49F8b141ADe0A098Df9fCCC3c5C976E57"
    "0xc46d1C937C44f7818524Ec5Eb5000b65c25499a0"
  );

  const shortenAddress = (address: string) =>
    `${address.slice(0, 9)}...${address.slice(address.length - 6)}`;

  // const capitalizeFirstLetter = (value: string) => {
  //   return value.charAt(0).toUpperCase() + value.slice(1)
  // }

  const { data: nfts, isLoading: isLoadingNfts } = useNFTs(contract);
  const {
    mutate: mintNft,
    isLoading: isMinting,
    error: mintErr,
  } = useMintNFT(contract);

  const isWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const mintAnNft = async (e: any) => {
    e.preventDefault();
    if (!address) {
      connectWithMetamask();
      return;
    }
    if (isWrongNetwork) {
      switchNetwork?.(ChainId.Mumbai);
      return;
    }

    mintNft(
      {
        metadata: {
          name: userInput.name,
          image:
            // "https://kaijego-v1.vercel.app/_next/static/media/bird.f7cef8ff.svg",
            userInput.file,
        },
        to: address,
      },
      {
        onSuccess(data) {
          alert("Minted Successfully");
          setUserInput({
            name: "",
            file: "",
          });
        },
        onError() {
          alert("Sorry your wallet is not authorized to mint");
        },
      }
    );
  };

  return (
    <>
      <Head>
        <title>Chill Collektion</title>
        <meta name="description" content="Chill Nft Collektion" />

        <link rel="icon" href="/icon2.svg" />
      </Head>
      <div className={style.noRes}>
        <p>
          Sorry you can&apos;t view app on this device please switch to a bigger
          device.
        </p>
      </div>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Chill <span>Collektion 01</span>{" "}
          </h1>
          <br /> <br />
          <ConnectWallet />
          <br />
          {!isLoadingNfts ? (
            <div className={style.nftsBox}>
              {nfts?.map((nft) => (
                <div className={style.nft} data-key={nft?.metadata}>
                  <ThirdwebNftMedia
                    metadata={nft?.metadata}
                    controls={true}
                    style={{
                      width: "250px",
                      height: "250px",
                      borderRadius: "15px",
                    }}
                    // height={"400"}
                    // width={"400"}
                    className={style.nftItem}
                  />
                  <div className={style.nftTxt}>
                    <h3>{nft?.metadata?.name}</h3>
                    <p>Owner : {shortenAddress(nft?.owner)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading NFTs....</p>
          )}
          <br />
        </main>
        <div className={style.mintBx}>
          <h2 className={styles.title2}>
            {" "}
            Mint an <span>NFT</span>
          </h2>
          <form className={style.mintForm} onSubmit={mintAnNft}>
            <div className={style.input}>
              <input
                type="text"
                placeholder="NFT Name"
                name="name"
                onChange={inputHandler}
                value={userInput.name}
                required
              />
            </div>
            <div className={style.fileContainer}>
              <input
                type="file"
                placeholder="NFT"
                name="file"
                onChange={imgHandler}
                required
              />
              {userInput.file !== "" ? (
                <Image
                  src={URL?.createObjectURL(userInput.file)}
                  width={100}
                  height={100}
                  alt="nft"
                />
              ) : (
                <div className={style.imgTxt}>
                  <p>Choose a file to Upload</p>
                </div>
              )}
              {/* <img src={URL.createObjectURL(imageFile)} alt="nft" /> */}
            </div>
            <button
              className={style.mintBtn}
              //onClick={mintAnNft}
            >
              {isMinting ? "Minting...." : "Mint "}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
