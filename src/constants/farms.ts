import { ChainId } from "../sdk"

export type TokenInfo = {
    id: string
    name: string
    symbol: string
    decimals?: number
}

type PairInfo = {
    id: number
    token0: TokenInfo
    token1?: TokenInfo
    name?: string
    symbol?: string 
}

type AddressMap = {
    [chainId: number]: {
        [address: string]: PairInfo
    }
}


export const POOLS: AddressMap = {
    [ChainId.HYPERSPACE]: {}
}
