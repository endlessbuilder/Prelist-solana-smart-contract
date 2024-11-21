import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { connection, metadataKeypair, mintKeypair, owner, platformKeypair, program, tokenDetails, tokenInfoKeypair } from "./setup";

const feeInBps = new anchor.BN(100); // 1%
const totalSupply = new anchor.BN(100e9);
const virtualSol = new anchor.BN(100e9);
const targetPoolBalance = new anchor.BN(150e9);
const feeWallet = new PublicKey("28N6ikf1wVNvrJZdzMQY8bgnu8uha9NnUttawk42DzA3");

const main = async () => {

    const createToken = async () => {
        try {
            const txSignature = await program.methods
                .createToken(tokenDetails)
                .accounts({
                    metadata: metadataKeypair.toBase58(),
                })
                .signers([owner])
                .rpc();

            let latestBlockhash = await connection.getLatestBlockhash("finalized");
            await connection.confirmTransaction({
                signature: txSignature,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            });

            console.log(">>> ✅ createToken txId = ", txSignature);

            // const tokenInfo = await program.account.mint.fetch(
            //     mintKeypair.toBase58()
            // );
            // console.log(">>> token info : ", tokenInfo.creator.toBase58());

        } catch (error) {
            console.log(">>> error on createToken : ", error);
        }
    }

    const setTokenInfo = async () => {
        try {
            const txSignature = await program.methods
                .setTokenInfo(tokenDetails)
                .accounts({})
                .signers([owner])
                .rpc();

            let latestBlockhash = await connection.getLatestBlockhash("finalized");
            await connection.confirmTransaction({
                signature: txSignature,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            });

            console.log(">>> ✅ setTokenInfo txId = ", txSignature);

            const tokenInfo = await program.account.tokenInfo.fetch(
                tokenInfoKeypair.toBase58()
            );

            console.log(">>> token info : ", tokenInfo.creator.toBase58());

        } catch (error) {
            console.log(">>> error on setTokenInfo : ", error);
        }
    }

    await createToken();
    await setTokenInfo();

}

main();