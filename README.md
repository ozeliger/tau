# Tau

# Demo

* [Website](https://tau-fvm.vercel.app/)


# What is Tau?

Tau introduces a next-gen decentralized exchange providing liquidity, an auto-farming stablecoin, and enabling peer-to-peer transactions on the Filecoin Hyperspace network. 
Tau allows users on the [Hyperspace Network](https://fvm.filecoin.io/) to trade directly from their wallets rather than through a 3rd-party -- your tokens never leave your custody, and are 100% owned by you. Further, low trading fees and high liquidity makes Tau an attractive platform to trade with, and also helps provide a broad range of support to various facets of the Filecoin community -- to continuously adapt to the changing markets by continuing to provide value to both token holders and the community. Tau provides the following features:

1. High-efficiency swapping (fork of Uniswap; made more gas-efficient)
2. Yield Farming
3. Capital-efficient Lending & Borrowing Protocol
4. Auto-farming Stablecoin (`taUSD`)
5. Secure Cross-chain Bridge


# 1. Swapping Crypto

Quickly swap crypto tokens on Filecoin. Tau's implementation is a more gas-optimized version of [Uniswap v2](https://uniswap.org/blog/uniswap-v2). You can also add liquidity to the various pools supported to further strengthen the protocol. 


[Try swapping crypto on Hyperspace](https://tau-fvm.vercel.app/en/exchange/swap).



# 2. Yield Farming

With the liquidity pool tokens you receive when you supply liquidity, you can choose to farm these tokens in our high-yield farm vaults. In return, you receive an amount (scaled by demand) of `TAU` tokens, which are governance tokens on Tau. The longer you stake your liquidity pool tokens, the more amount of `TAU` you will receive.


[Try yield farming on Hyperspace](https://tau-fvm.vercel.app/farm).



# 3. Lending & Borrowing

Tau introduces an institution-grade DeFi borrowing and lending protocol featuring ***permissionless*** liquidity pools, allowing anyone to lend and borrow assets at high APYs. The source code for Tau's Lending & Borrowing protocol is [*massive* and *rigorously-tested*. Have a glance; I won't disappoint ;)](https://github.com/ozeliger/tau/blob/dev/contracts/contracts/vaults/TauVault.sol).


### Some points

1. Lenders receive an amount of interest-bearing tokens (`ibTokens`) which continously earn interest through their exchange rate. In addition, lenders may choose to mint the `taUSD` stablecoin by depositing `ibTokens` (more on this later).
1. Borrowers pay 0.1% of the borrowed amount as an "origination" fee, which is added to the total borrow amount in its respective RToken.
2. Liquidations carry a 10% fee paid directly to the liquidator.
3. All transactions occur on the [Hyperspace Network](https://fvm.filecoin.io/).


[Try lending/borrowing on Filecoin](https://tau-fvm.vercel.app/lend).


# 4. Stablecoin (`taUSD`)

`taUSD` is an *overcollateralized*, *auto-farming* stablecoin reinforced with **multi-layered pegging mechanisms** to maintain its peg at $1. Lenders on Tau collateralize their `ibTokens` to borrow `taUSD` (issued 1:1). Thus, lenders are able to continue earning high lending APR, while also borrowing `taUSD` to use as they see fit. This, we believe, unlocks even higher profit potential and greatly increases the flexibility of user's capital. 

`taUSD` is a mini-fork of the battle-tested MakerDAO, with the following improvements:

1. **Farmable Collateral**: For most lending protocols, users have to decide between staking their assets to earn yield, or staking their assets as collateral to borrow against. With Tau, users don't need to make this tradeoff -- users can deposit their assets as collateral to borrow `taUSD`, while also continuing to earn juicy lending APY. Also, because the lending APY for most vaults are much higher than the stability fee for `taUSD` (2.5%), these loans are effectively better than interest-free: they are yield-bearing, auto-farming loans!

2. **Efficient Pegging**: Just being overcollateralized is not enough to maintain a stable peg. The protocol takes inspiration from MakerDAO, and automatically adjusts borrowing interest up/down to decrease/increase selling pressure depending on which side of $1 the collateral value falls to.

3. **Gentle Liquidation**: `taUSD` has gentle liquidation, meaning that when a `taUSD` borrowing position faces liquidation, only a *small* portion of the position is liquidated until it is brought back to health. This model results in lower associated costs and liquidation risk for `taUSD` borrowers.

[Try minting `taUSD` on Filecoin](https://tau-fvm.vercel.app/stablecoin).


# 5. Cross-Chain Bridge

Tau has a cross-chain bridge to facilitate interoperability between Filecoin and other chains (such as Polygon). Currently, Tau supports Hyperspace <=> Polygon Mumbai, with more chains being supported very soon.

[Try bridging assets from Filecoin to Polygon Mumbai](https://tau-fvm.vercel.app/bridge).