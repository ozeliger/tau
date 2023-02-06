import { ChainId, Token, ZERO_ADDRESS } from "../sdk"
import deployments from "./deployments.json"
import { HYPERSPACE } from "./tokens"
import TAU_TOKENLIST from "../constants/token-lists/tau.tokenlist.json"

type AddressMap = { [chainId: number]: string }

export const DEPLOYMENTS = deployments
export function getDeployedAddresses() {
    return deployments
}

export const tokenAddressToToken = (tokenAddress: string) => {
    switch(tokenAddress) {
        case DEPLOYMENTS.tokens.wFIL: { return HYPERSPACE.wFIL }
        case DEPLOYMENTS.tokens.DCT: { return HYPERSPACE.DCT }
        case DEPLOYMENTS.tokens.MAV: { return HYPERSPACE.MAV }
        case DEPLOYMENTS.tokens.WLR: { return HYPERSPACE.WLR }
        case DEPLOYMENTS.tokens.DIB: { return HYPERSPACE.DIB }
    }
    
    return new Token(ChainId.HYPERSPACE, ZERO_ADDRESS, 18, "Zero address", "Zero address")
}

export const tokenAddressToLogo = (tokenAddress: string) => {
    switch(tokenAddress) {
        case DEPLOYMENTS.tokens.wFIL: { return TAU_TOKENLIST.tokens[0].logoURI  }
        case DEPLOYMENTS.tokens.DCT: { return TAU_TOKENLIST.tokens[1].logoURI }
        case DEPLOYMENTS.tokens.WLR: { return TAU_TOKENLIST.tokens[2].logoURI }
        case DEPLOYMENTS.tokens.MAV: { return TAU_TOKENLIST.tokens[3].logoURI }
        case DEPLOYMENTS.tokens.DIB: { return TAU_TOKENLIST.tokens[4].logoURI }
        case DEPLOYMENTS.tokens.TAU: { return TAU_TOKENLIST.tokens[5].logoURI }
        case DEPLOYMENTS.vault.tokens.ibDCT: { return TAU_TOKENLIST.tokens[6].logoURI }
        case DEPLOYMENTS.vault.tokens.ibMAV: { return TAU_TOKENLIST.tokens[7].logoURI }
        case DEPLOYMENTS.vault.tokens.ibWLR: { return TAU_TOKENLIST.tokens[8].logoURI }
    }

    return undefined
}

export function tokenAddressToIbToken(asset: string) {
    switch(asset) {
        case DEPLOYMENTS.tokens.DCT: return DEPLOYMENTS.vault.tokens.ibDCT
        case DEPLOYMENTS.tokens.MAV: return DEPLOYMENTS.vault.tokens.ibMAV
        case DEPLOYMENTS.tokens.WLR: return DEPLOYMENTS.vault.tokens.ibWLR
    }

    return undefined 
}


export function tokenNameToAddress(assetName: string, chainId: ChainId) {
    switch(assetName) {
        case "wFIL": return chainId !== ChainId.HYPERSPACE ? DEPLOYMENTS.tokens.mumbai.wMATIC : DEPLOYMENTS.tokens.wFIL
        case "wMATIC": return chainId === ChainId.HYPERSPACE ? DEPLOYMENTS.tokens.wFIL : DEPLOYMENTS.tokens.mumbai.wMATIC
        case "DCT": return chainId === ChainId.HYPERSPACE ? DEPLOYMENTS.tokens.DCT : DEPLOYMENTS.tokens.mumbai.DCT
        case "MAV": return chainId === ChainId.HYPERSPACE ? DEPLOYMENTS.tokens.MAV : DEPLOYMENTS.tokens.mumbai.MAV
        case "WLR": return chainId === ChainId.HYPERSPACE ? DEPLOYMENTS.tokens.WLR : DEPLOYMENTS.tokens.mumbai.WLR
        case "DIB": return chainId === ChainId.HYPERSPACE ? DEPLOYMENTS.tokens.DIB : DEPLOYMENTS.tokens.mumbai.DIB
    }
}

export const TAU_DISTRIBUTOR_ADDRESS: AddressMap = {
    [ChainId.ROPSTEN]: "",
    [ChainId.BSC]: "",
    [ChainId.HYPERSPACE]: DEPLOYMENTS.farms.TauDistributor
}

export const TAU_VAULT_ADDRESS: AddressMap = {
    [ChainId.HYPERSPACE]: DEPLOYMENTS.vault.TauVault
}

export const MULTICALL2_ADDRESS: AddressMap = {
    [ChainId.MAINNET]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
    [ChainId.GÖRLI]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
    [ChainId.KOVAN]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
    [ChainId.ARBITRUM]: "0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB",
    [ChainId.ARBITRUM_TESTNET]: "0xa501c031958F579dB7676fF1CE78AD305794d579",
    [ChainId.CELO]: "0x9aac9048fC8139667D6a2597B902865bfdc225d3",
    [ChainId.FANTOM]: "0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5",
    [ChainId.FANTOM_TESTNET]: "",
    [ChainId.MATIC]: "0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD",
    [ChainId.MATIC_TESTNET]: "",
    [ChainId.HECO_TESTNET]: "",
    [ChainId.HARMONY]: "0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3",
    [ChainId.HARMONY_TESTNET]: "",
    [ChainId.OKEX]: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
    [ChainId.OKEX_TESTNET]: "",
    [ChainId.HYPERSPACE]: DEPLOYMENTS.misc.Multicall2
}

export const WETH9: AddressMap = {
    [ChainId.HYPERSPACE]: DEPLOYMENTS.tokens.wFIL
}

export const WNATIVE: AddressMap = {
    [ChainId.HYPERSPACE]: DEPLOYMENTS.tokens.wFIL,
}