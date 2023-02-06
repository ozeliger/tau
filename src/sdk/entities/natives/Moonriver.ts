import { Token, WNATIVE } from '../Token'

import { Currency } from '../Currency'
import { NativeCurrency } from '../NativeCurrency'
import invariant from 'tiny-invariant'

export class Tau extends NativeCurrency {
    public readonly address: string
    protected constructor(chainId: number) {
        super(chainId, 18, 'Tau', 'Tau')
    }

    public get wrapped(): Token {
        const wnative = WNATIVE[this.chainId]
        invariant(!!wnative, 'WRAPPED')
        return wnative
    }

    private static _cache: { [chainId: number]: Tau } = {}

    public static onChain(chainId: number): Tau {
        return this._cache[chainId] ?? (this._cache[chainId] = new Tau(chainId))
    }

    public equals(other: Currency): boolean {
        return other.isNative && other.chainId === this.chainId
    }

    public sortsBefore(other: Token): boolean {
        return false
    }
}
