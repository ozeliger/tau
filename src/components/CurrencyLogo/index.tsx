import { ChainId, Currency, WNATIVE } from '../../sdk'
import React, { FunctionComponent, useMemo } from 'react'
import Logo from '../Logo'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import useHttpLocations from '../../hooks/useHttpLocations'
import { tokenAddressToLogo } from '../../constants'

export const getTokenLogoURL = (address: string, chainId: ChainId) => {
    return `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/${BLOCKCHAIN[chainId]}/assets/${address}/logo.png`
}

const BLOCKCHAIN = {
    [ChainId.MAINNET]: 'ethereum',
    [ChainId.BSC]: 'smartchain',
    [ChainId.CELO]: 'celo',
    [ChainId.FANTOM]: 'fantom',
    [ChainId.HARMONY]: 'harmony',
    [ChainId.MATIC]: 'polygon',
    [ChainId.HYPERSPACE]: "apothem",
    [ChainId.XDAI]: 'xdai',
    [ChainId.MOONRIVER]: 'moonriver',
    // [ChainId.OKEX]: 'okex',
}

function getCurrencySymbol(currency) {
    if(currency.symbol === 'WBTC') {
        return 'btc'
    }
    if(currency.symbol === 'WETH') {
        return 'eth'
    }
    return currency.symbol.toLowerCase()
}

function getCurrencyLogoUrls(currency) {
    const urls = []
    if(currency.chainId in BLOCKCHAIN) {
        urls.push(
            `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${
                currency.address
            }/logo.png`
        )
    }

    return urls
}

const EthereumLogo = 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/info/logo.png'
const MaticLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/polygon.jpg'
const ApothemLogo = 'https://xinfin.org/assets/images/brand-assets/xdc-icon.png'

const logo: { readonly [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: EthereumLogo,
    [ChainId.MATIC]: MaticLogo,
    [ChainId.MATIC_TESTNET]: MaticLogo,
    [ChainId.HYPERSPACE]: ApothemLogo
}

interface CurrencyLogoProps {
    currency?: Currency
    size?: string | number
    style?: React.CSSProperties
    className?: string
    squared?: boolean
}

const unknown = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png'

const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({
    currency,
    size = '24px',
    style,
    className = '',
    ...rest
}) => {
    const uriLocations = useHttpLocations(
        currency instanceof WrappedTokenInfo ? currency.logoURI || currency.tokenInfo.logoURI : undefined
    )

    const tmpLogo = tokenAddressToLogo(currency.isToken && currency.address)
    const httpLogo = useHttpLocations(tmpLogo)

    const srcs = useMemo(() => {
        if(!currency) {
            return [unknown]
        }

        if(currency.isNative || currency.equals(WNATIVE[currency.chainId])) {
            return [logo[currency.chainId], unknown]
        }

        if(currency.isToken) {
            if(tmpLogo)
                return [...httpLogo, unknown]

            const defaultUrls = [...uriLocations, ...getCurrencyLogoUrls(currency)]
            // console.debug("Default urls:", defaultUrls)
            if(currency instanceof WrappedTokenInfo) {
                return [...defaultUrls, unknown]
            }
            return defaultUrls
        }
    }, [currency, uriLocations])

    return <Logo srcs={srcs} width={size} height={size} alt={currency?.symbol} {...rest} />
}

export default CurrencyLogo
