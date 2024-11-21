import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { owner, platformKeypair, program } from "./setup";

const feeInBps = new anchor.BN(100); // 1%
const totalSupply = new anchor.BN(100e9);
const virtualSol = new anchor.BN(2e8);
const targetPoolBalance = new anchor.BN(5e8);
const feeWallet = new PublicKey("28N6ikf1wVNvrJZdzMQY8bgnu8uha9NnUttawk42DzA3");

const changeTotalSupply = async () => {
    const newTotalSupply = new anchor.BN(10e9);
    try {

        await program.methods.changeTotalSupply(newTotalSupply).accounts({}).signers([owner]).rpc();

        const account = await program.account.platform.fetch(platformKeypair.toBase58());

        console.log(">>> platform totalSupply : ", account.totalSupply.toString());

    } catch (error) {
        console.log(">>> error : ", error);
    }

}

changeTotalSupply();
