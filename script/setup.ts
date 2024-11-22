import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { SolanaPumpFun } from "../target/types/solana_pump_fun";

export const connection = new Connection(
    "https://devnet.helius-rpc.com/?api-key=bf788362-5f53-41d2-9230-e48586e76a06",
    "confirmed"
);
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const wallet = provider.wallet as anchor.Wallet;
export const owner = wallet.payer;
console.log(">>> owner pubkey : ", owner.publicKey.toBase58());
export const program = anchor.workspace.SolanaPumpFun as Program<SolanaPumpFun>;

const seedStrings = {
    platformSeedString: "platform",
    mintSeedString: "mint",
    tokenInfoSeedString: "token",
    tokenAccountSeedString: "token_account",
    metadataSeedString: "metadata",
};

export const tokenDetails = {
    name: "Mock Token 05",
    symbol: "MOCT05",
    uri: "www.example.com",
};

export const metadataTokenProgramPubkey = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const platformKeypair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seedStrings.platformSeedString)],
    program.programId
)[0];

export const mintKeypair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seedStrings.mintSeedString), Buffer.from(tokenDetails.name)],
    program.programId
)[0];

export const metadataKeypair = anchor.web3.PublicKey.findProgramAddressSync(
    [
        Buffer.from(seedStrings.metadataSeedString),
        metadataTokenProgramPubkey.toBuffer(),
        mintKeypair.toBuffer(),
    ],
    metadataTokenProgramPubkey
)[0];

export const tokenInfoKeypair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seedStrings.tokenInfoSeedString), Buffer.from(tokenDetails.name)],
    program.programId
)[0];

export const escrowTokenAccountKeypair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seedStrings.tokenAccountSeedString), mintKeypair.toBuffer()],
    program.programId
)[0];