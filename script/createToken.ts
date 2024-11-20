import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { metadataKeypair, owner, platformKeypair, program, tokenDetails, tokenInfoKeypair } from "./setup";

const feeInBps = new anchor.BN(100); // 1%
const totalSupply = new anchor.BN(100e9);
const virtualSol = new anchor.BN(100e9);
const targetPoolBalance = new anchor.BN(150e9);
const feeWallet = new PublicKey("28N6ikf1wVNvrJZdzMQY8bgnu8uha9NnUttawk42DzA3");

const createToken = async () => {
    try {
        await program.methods
            .createToken(tokenDetails)
            .accounts({
                metadata: metadataKeypair.toBase58(),
            })
            .signers([owner])
            .rpc();

        const tokenInfo = await program.account.tokenInfo.fetch(
            tokenInfoKeypair.toBase58()
        );

        console.log(">>> token info : ", tokenInfo.creator.toBase58());

    } catch (error) {
        console.log(">>> error : ", error);
    }
}

createToken();
