import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { connection, mintKeypair, owner, platformKeypair, program, tokenInfoKeypair } from "./setup";
import { token } from "@coral-xyz/anchor/dist/cjs/utils";

const feeInBps = new anchor.BN(100); // 1%
const totalSupply = new anchor.BN(100e9);
const virtualSol = new anchor.BN(100e9);
const targetPoolBalance = new anchor.BN(150e9);
const feeWallet = new PublicKey("28N6ikf1wVNvrJZdzMQY8bgnu8uha9NnUttawk42DzA3");

const liquidityMigration = async () => {

    const solAmount = new anchor.BN(3e8); // 0.3 sol
    const tokenAmount = new anchor.BN(20 * 1e9); // 20 tokens

    try {
        
        let tokenInfo = await program.account.tokenInfo.fetch(
            tokenInfoKeypair.toBase58()
        );
        console.log(">>> token info - solReserve : ", tokenInfo.solReserve.toString());

        const liquidityMigrationParams = {
            solAmount,
            tokenAmount,
        };

        const accounts = {
            mint: mintKeypair,
            tokenInfo: tokenInfoKeypair,
            feeWallet: feeWallet
        };

        const txSignature = await program.methods
            .liquidityMigration(liquidityMigrationParams)
            .accounts(accounts)
            .signers([owner])
            .rpc();

        let latestBlockhash = await connection.getLatestBlockhash("finalized");
        await connection.confirmTransaction({
            signature: txSignature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        console.log(">>> ✅ liquidityMigration txId = ", txSignature);

        tokenInfo = await program.account.tokenInfo.fetch(
            tokenInfoKeypair.toBase58()
        );
        console.log(">>> token info - solReserve : ", tokenInfo.solReserve.toString());

    } catch (error) {
        console.log(">>> error : ", error);
    }

}

liquidityMigration();
