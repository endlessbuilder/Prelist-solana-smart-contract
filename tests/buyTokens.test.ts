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

    it("Can buy tokens", async () => {
        const solAmount = new anchor.BN(1e9 + 1e7);

        const buyerTokenAccount = await spl.createAssociatedTokenAccount(
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

        const balance = await provider.connection.getTokenAccountBalance(buyerTokenAccount);
        assert(+balance.value.amount > 9e8);
    });
});
