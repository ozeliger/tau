import { ChainId } from '../enums/ChainId'
import deployments from "../../constants/deployments.json"

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
    [ChainId.HYPERSPACE]: deployments.swap.TauFactory,
}