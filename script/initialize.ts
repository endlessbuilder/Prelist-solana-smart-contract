import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { owner, platformKeypair, program } from "./setup";

const feeInBps = new anchor.BN(100); // 1%
const totalSupply = new anchor.BN(100e9);
const virtualSol = new anchor.BN(100e9);
const targetPoolBalance = new anchor.BN(150e9);
const feeWallet = new PublicKey("28N6ikf1wVNvrJZdzMQY8bgnu8uha9NnUttawk42DzA3");

const initialize = async () => {

    const platformParams = {
        owner: owner.publicKey,
        feeInBps,
        totalSupply,
        virtualSol,
        targetPoolBalance,
        feeWallet
    };

    await program.methods.initialize(platformParams).accounts({}).signers([owner]).rpc();

    const account = await program.account.platform.fetch(platformKeypair.toBase58());

    console.log(">>> platform account : ", account.feeWallet.toBase58());

}

initialize();
