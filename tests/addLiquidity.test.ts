import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import { program, tokenDetails, keypairs, seedStrings } from "./utils/constants";
import * as spl from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

describe("Solana pump fun", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const owner = (provider.wallet as anchor.Wallet).payer;
    const feeInBps = new anchor.BN(100); // 1%
    const totalSupply = new anchor.BN(100e9);
    const virtualSol = new anchor.BN(100e9);
    const targetPoolBalance = new anchor.BN(150e9);
    let buyerTokenAccount: anchor.web3.PublicKey;
    const feeWallet = new PublicKey("28N6ikf1wVNvrJZdzMQY8bgnu8uha9NnUttawk42DzA3");

    before(async () => {
        const platformParams = {
            owner: owner.publicKey,
            feeInBps,
            totalSupply,
            virtualSol,
            targetPoolBalance,
            feeWallet
        };

        await program.methods.initialize(platformParams).accounts({}).signers([owner]).rpc();

        await program.methods
            .createToken(tokenDetails)
            .accounts({
                metadata: keypairs.metadataKeypair.toBase58(),
            })
            .signers([owner])
            .rpc();
    });

    it("Can buy tokens and launch", async () => {
        const solAmount = new anchor.BN(50e9 + 5e8);

        buyerTokenAccount = await spl.createAssociatedTokenAccount(
            provider.connection,
            owner,
            keypairs.mintKeypair,
            owner.publicKey
        );

        await program.methods
            .buyTokens(solAmount)
            .accounts({
                mint: keypairs.mintKeypair.toBase58(),
                tokenInfo: keypairs.tokenInfoKeypair.toBase58(),
            })
            .signers([owner])
            .rpc();

        const tokenLaunchInfo = await program.account.tokenInfo.fetch(keypairs.tokenInfoKeypair);
        assert(tokenLaunchInfo.launched);

        await program.methods
            .addLiquidity(tokenDetails.name)
            .accounts({
                mint: keypairs.mintKeypair.toBase58(),
            })
            .signers([owner])
            .rpc();
    });
});
