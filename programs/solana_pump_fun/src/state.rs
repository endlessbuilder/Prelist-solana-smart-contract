use anchor_lang::prelude::*;

// Accounts

#[account]
#[derive(InitSpace)]
pub struct Platform {
    pub owner: Pubkey,
    pub fee_in_bps: u64,
    pub accumulated_fees: u64,
    pub total_supply: u64,
    pub virtual_sol: u64,
    pub target_pool_balance: u64,
    pub fee_wallet: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct TokenInfo {
    pub token: Pubkey,
    pub creator: Pubkey,
    pub total_supply: u64,
    pub virtual_sol: u64,
    pub sol_reserve: u64,
    pub token_reserve: u64,
    pub target_pool_balance: u64,
    pub launched: bool,
}

// Params

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct PlatformInitParams {
    pub owner: Pubkey,
    pub fee_in_bps: u64,
    pub total_supply: u64,
    pub virtual_sol: u64,
    pub target_pool_balance: u64,
    pub fee_wallet: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct CreateTokenParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct SetTokenInfoParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct LiquidityMigrationParams {
    pub sol_amount: u64,
    pub token_amount: u64,
}
