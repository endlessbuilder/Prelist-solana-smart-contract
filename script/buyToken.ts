import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { connection, mintKeypair, owner, platformKeypair, program, tokenInfoKeypair } from "./setup";

const feeInBps = new anchor.BN(100); // 1%
const totalSupply = new anchor.BN(100e9);
const virtualSol = new anchor.BN(100e9);
const targetPoolBalance = new anchor.BN(150e9);
const feeWallet = new PublicKey("28N6ikf1wVNvrJZdzMQY8bgnu8uha9NnUttawk42DzA3");

const buyTokens = async () => {

    const solAmount = new anchor.BN(1e9 + 1e7);
    try {
        const buyerTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            owner,
            mintKeypair,
            owner.publicKey
        );
        console.log(">> buyerTokenAccount : ", buyerTokenAccount.address.toBase58());

        const accounts = {
            mint: mintKeypair,
            tokenInfo: tokenInfoKeypair,
            // userTokenAccount: buyerTokenAccount,
            feeWallet: feeWallet
        };

        const txSignature = await program.methods
            .buyTokens(solAmount)
            .accounts(accounts)
            .signers([owner])
            .rpc();

        let latestBlockhash = await connection.getLatestBlockhash("finalized");
        await connection.confirmTransaction({
            signature: txSignature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        console.log(">>> ✅ buyTokens txId = ", txSignature);


        const balance = await connection.getTokenAccountBalance(buyerTokenAccount.address);

        console.log(">>> balance : ", balance);

    } catch (error) {
        console.log(">>> error : ", error);
    }

}

buyTokens();
