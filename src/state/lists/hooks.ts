import { AppState } from ".."
import TAU_TOKEN_LIST from "../../constants/token-lists/tau.tokenlist.json"
import { DEPLOYMENTS } from "../../constants"
import { TokenList } from "@uniswap/token-lists"
import { UNSUPPORTED_LIST_URLS } from "../../constants/token-lists"
import { WrappedTokenInfo } from "./wrappedTokenInfo"
import { sortByListPriority } from "../../functions/list"
import { useAppSelector } from "../hooks"
import { useMemo } from "react"


export type TokenAddressMap = Readonly<{
    [chainId: number]: Readonly<{
        [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList }
    }>
}>

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
    typeof WeakMap !== "undefined" ? new WeakMap<TokenList, TokenAddressMap>() : null


export function listToTokenMap(list: TokenList): TokenAddressMap {
    const result = listCache?.get(list)
    if(result) return result

    const map = list.tokens.reduce<TokenAddressMap>((tokenMap, tokenInfo) => {
        const token = new WrappedTokenInfo(tokenInfo, list)
        if(tokenMap[token.chainId]?.[token.address] !== undefined) {
            console.error(new Error(`Duplicate token! ${token.address}`))
            return tokenMap
        }
        return {
            ...tokenMap,
            [token.chainId]: {
                ...tokenMap[token.chainId],
                [token.address]: {
                    token,
                    list,
                },
            },
        }
    }, {})
    listCache?.set(list, map)
    return map
}



const TRANSFORMED_DEFAULT_TOKEN_LIST = listToTokenMap(updateAddresses(TAU_TOKEN_LIST) as any)


function updateAddresses(tokenList: any) {
    tokenList.tokens[0].address = DEPLOYMENTS.tokens.wFIL // wFIL
    tokenList.tokens[1].address = DEPLOYMENTS.tokens.DCT  // DCT
    tokenList.tokens[2].address = DEPLOYMENTS.tokens.WLR  // WLR
    tokenList.tokens[3].address = DEPLOYMENTS.tokens.MAV  // MAV
    tokenList.tokens[4].address = DEPLOYMENTS.tokens.DIB  // DIB
    tokenList.tokens[5].address = DEPLOYMENTS.tokens.TAU  // TAU
    tokenList.tokens[6].address = DEPLOYMENTS.vault.tokens.ibDCT  // ibDCT
    tokenList.tokens[7].address = DEPLOYMENTS.vault.tokens.ibMAV  // ibMAV
    tokenList.tokens[8].address = DEPLOYMENTS.vault.tokens.ibWLR  // ibWLR

    // MATIC
    tokenList.tokens[9].address  = DEPLOYMENTS.tokens.mumbai.wMATIC  // wMATIC
    tokenList.tokens[10].address = DEPLOYMENTS.tokens.mumbai.DCT  // DCT
    tokenList.tokens[11].address = DEPLOYMENTS.tokens.mumbai.WLR  // WLR
    tokenList.tokens[12].address = DEPLOYMENTS.tokens.mumbai.MAV  // MAV
    tokenList.tokens[13].address = DEPLOYMENTS.tokens.mumbai.DIB  // DIB

    return tokenList
}


export function useAllLists(): AppState["lists"]["byUrl"] {
    return useAppSelector((state) => {
        return state.lists.byUrl
    })
}

function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
    return {
        1: { ...map1[1], ...map2[1] }, // mainnet
        51: { ...map1[51], ...map2[51] }, // apothem
        80001: { ...map1[80001], ...map2[80001] }, // matic testnet
    }
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
    const lists = useAllLists() 
    return useMemo(() => {
        if(!urls) return {}
        return (
            urls
                .slice()
                // sort by priority so top priority goes last
                .sort(sortByListPriority)
                .reduce((allTokens, currentUrl) => {
                    const current = lists[currentUrl]?.current
                    if(!current) return allTokens
                    try {
                        return combineMaps(allTokens, listToTokenMap(current))
                    } catch (error) {
                        console.error("Could not show token list due to error", error)
                        return allTokens
                    }
                }, {})
        )
    }, [lists, urls])
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
    return useAppSelector((state) => state.lists.activeListUrls)?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url))
}

export function useInactiveListUrls(): string[] {
    const lists = useAllLists()
    const allActiveListUrls = useActiveListUrls()
    return Object.keys(lists || {}).filter((url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url))
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
    const activeListUrls = useActiveListUrls()
    const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
    return combineMaps(activeTokens, TRANSFORMED_DEFAULT_TOKEN_LIST)
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
    // get any loaded unsupported tokens
    const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(UNSUPPORTED_LIST_URLS)

    // format into one token address map
    return useMemo(
        () => loadedUnsupportedListMap,
        [loadedUnsupportedListMap]
    )
}

export function useIsListActive(url: string): boolean {
    const activeListUrls = useActiveListUrls()
    return Boolean(activeListUrls?.includes(url))
}
