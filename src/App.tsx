import React, { useState, useEffect } from "react";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { Input } from "components/ui/input";
import { motion } from "framer-motion";
import { FaCopy, FaDiscord, FaTelegram, FaChartBar, FaEthereum, FaWallet, FaUpload, FaGift } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { useWallet } from "@solana/wallet-adapter-react";
import gsap from "gsap";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const CONTRACT_ADDRESS = "0xYOURCONTRACTADDRESS";
const DEXSCREENER_URL = "https://dexscreener.com/YOUR-PAIR-URL";
const DISCORD_LINK = "https://discord.gg/YOURSERVER";
const TELEGRAM_LINK = "https://t.me/YOURGROUP";

export default function MarsianHome() {
  const [memeText, setMemeText] = useState("");
  const [memes, setMemes] = useState([]);
  const [ranking, setRanking] = useState("Earthling");
  const [walletConnected, setWalletConnected] = useState(false);
  const { connect, publicKey } = useWallet();

  useEffect(() => {
    gsap.from(".hero-text", { opacity: 0, y: -50, duration: 1.5, ease: "bounce" });
    gsap.from(".hero-cta", { opacity: 0, scale: 0.8, duration: 1.5, ease: "elastic" });

    const fetchMemes = async () => {
      const querySnapshot = await getDocs(collection(db, "memes"));
      setMemes(querySnapshot.docs.map(doc => doc.data().text));
    };
    fetchMemes();
  }, []);

  useEffect(() => {
    if (publicKey) {
      setWalletConnected(true);
      setRanking("Colonizer");
    }
  }, [publicKey]);

  const addMeme = async () => {
    if (memeText.trim()) {
      await addDoc(collection(db, "memes"), { text: memeText });
      setMemes(prevMemes => [...prevMemes, memeText]);
      setMemeText("");
      toast.success("Meme uploaded successfully!");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    toast.success("Contract address copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-700 to-red-500 text-white flex flex-col items-center p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <motion.h1 className="text-6xl font-extrabold mt-6 text-yellow-300 hero-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        👽 Marsian (MRSN)
      </motion.h1>
      <motion.p className="text-xl mt-2 italic text-yellow-300 text-center max-w-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
        "Earth is weak. Mars dominates! Join the invasion and conquer with MRSN!"
      </motion.p>
      <Button onClick={connect} className="mt-6 px-8 py-4 bg-blue-500 text-black text-xl font-bold rounded-xl hover:scale-110 transition hero-cta">
        <FaWallet className="mr-2" /> {walletConnected ? "Wallet Connected" : "Connect Wallet"}
      </Button>

      <Card className="mt-6 w-full max-w-lg p-4 bg-red-800 rounded-2xl shadow-lg flex justify-between items-center">
        <span className="text-lg">{CONTRACT_ADDRESS.substring(0, 6)}...{CONTRACT_ADDRESS.slice(-6)}</span>
        <Button onClick={copyToClipboard} className="bg-yellow-500 text-black p-2 rounded-lg"><FaCopy /></Button>
      </Card>

      {/* Fight Facts Section */}
      <div className="mt-12 text-center">
        <h2 className="text-4xl font-bold text-yellow-300">⚔️ Fight Facts</h2>
        <p className="mt-2 text-lg">Mars has the ultimate liquidity. Earthlings can only dream.</p>
        <p className="mt-1 text-lg">Pump to Mars? No. Mars pumps *you*.</p>
      </div>

      {/* Tokenomics Section */}
      <Card className="mt-12 w-full max-w-xl p-6 bg-red-700 rounded-3xl shadow-xl border-4 border-yellow-400">
        <CardContent className="text-center">
          <h2 className="text-3xl font-bold text-yellow-300">📊 Tokenomics</h2>
          <p className="mt-2 text-lg">- Total Supply: A ridiculous amount</p>
          <p className="text-lg">- No Team Allocation (Marsians work for free!)</p>
          <p className="text-lg">- Fair Launch: No pre-mines, just pure domination.</p>
        </CardContent>
      </Card>


      <p className="mt-2 text-lg">Your Rank: {ranking}</p>
      <div className="mt-12 text-center">
        <h2 className="text-4xl font-bold text-yellow-300">🎁 NFT Rewards</h2>
        <p className="mt-2 text-lg">Top memers and stakers get exclusive Marsian NFTs!</p>
        <Button className="mt-4 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-black font-bold text-lg rounded-xl">
          🚀 Claim NFT
        </Button>
      </div>

      <Card className="mt-10 w-full max-w-xl p-6 bg-red-800 rounded-3xl shadow-2xl border-4 border-yellow-400">
        <CardContent className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-yellow-300">Create & Share Memes</h2>
          <Input
            value={memeText}
            onChange={(e) => setMemeText(e.target.value)}
            placeholder="Type your Marsian meme..."
            className="mt-4 p-3 text-black rounded-lg border-2 border-yellow-400"
          />
          <Button onClick={addMeme} className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-bold text-lg rounded-xl">
            <FaUpload className="mr-2" /> Upload Meme
          </Button>
        </CardContent>
      </Card>

      {/* Community & FAQ Section */}
      <div className="mt-12 text-center">
        <h2 className="text-4xl font-bold text-yellow-300">🌎 Join the Marsian Colony</h2>
        <p className="mt-2 text-lg">Connect with fellow invaders on Discord and Telegram.</p>
        <Button className="mt-4 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg rounded-xl">👾 Join Community</Button>


      </div>

      {/* Display Generated Memes */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {memes.map((meme, index) => (
          <motion.div
            key={index}
            className="p-4 bg-yellow-500 text-black font-bold text-lg rounded-xl shadow-lg border-2 border-yellow-700 transform hover:rotate-3 transition duration-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {meme}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
