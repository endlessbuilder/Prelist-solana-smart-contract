# Deploying the program

1. Go to https://beta.solpg.io/, connect your wallet and switch to Mainnet.
2. Create a new anchor project.
3. Copy over the files from `./programs/solana_pump_fun/src/` into the solpg editor.
4. Compile and build the program from the build option on the left-hand side panel.
5. Click the deploy button on the left-hand side panel and wait for a few mins for deployment to proceed.
6. Once deployed, you'll see the address of the program displayed in the build section.

# Initializing the program

Add the following script to `client.ts` with any parameter customization you'd like, and run it to initialize the program,

```js
 const initParams = {
  owner: pg.wallet.publicKey,
  feeInBps: new anchor.BN(100),
  totalSupply: new anchor.BN("1000000000000000000"),
  virtualSol: new anchor.BN(15e9),
  targetPoolBalance: new anchor.BN(100e9),
};

const platformKeypair = await anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("platform")],
  pg.program.programId
)[0];

await pg.program.methods.initialize(initParams).rpc();

const platform = await pg.program.account.platform.fetch(
  platformKeypair.toBase58()
);

console.log(platform.owner.toString());
```