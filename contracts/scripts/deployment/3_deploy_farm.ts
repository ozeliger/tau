import fs from 'fs'
import hre, { ethers } from 'hardhat'
import { bn, getDeployments, saveDeployments } from '../utils'
import { BigNumber, BigNumberish } from 'ethers'


async function main() {
    // ==== Read Configuration ====
    const [deployer] = await hre.ethers.getSigners()

    let deployments = getDeployments()
    let tauDistributor
    let tauDistributorv2
    let tauVault

    const TauDistributor = await ethers.getContractFactory("TauDistributor")
    tauDistributor = await TauDistributor.deploy(
        deployments.tokens.TAU,
        "150"
    )
    deployments.farms["TauDistributor"] = tauDistributor.address
    saveDeployments(deployments)

    await wait()

    const TauDistributorV2 = await ethers.getContractFactory("TauDistributorV2")
    let tauDistributorv2 = await TauDistributorV2.deploy(
        deployments.tokens.TAU,
        "100",
        deployer.address,
        deployer.address,
        deployer.address,
        "200",
        "100",
        "100",
    )
    deployments.farms["TauDistributorV2"] = tauDistributorv2.address
    saveDeployments(deployments)
 
    await wait()

    const TauVault = await ethers.getContractFactory("TauVault")
    let tauVault = await TauVault.deploy(
        deployments.tokens.TAU,
        "150"
    )
    deployments.farms["TauVault"] = tauVault.address
    saveDeployments(deployments)

    // 
    // Add Pairs
    // 
    const allocPoints = [20, 10, 5, 1]
    tauDistributor = await ethers.getContractAt("TauDistributor", deployments.farms.TauDistributor)

    const pairs = deployments.pairs
    let pairAddresses: string[] = []
    for(const pair in pairs) {
        pairAddresses.push(pairs[pair].pairAddress)
    }

    pairAddresses = pairAddresses.filter((item, idx) => pairAddresses.indexOf(item) === idx)

    console.debug("Pair addresses:", pairAddresses, pairAddresses.length)

    for(const pairAddress of pairAddresses) {
        await tauDistributor.add(
            allocPoints[Math.floor((Math.random() * allocPoints.length))].toString(),
            pairAddress,
            "10",
            "7",
            false
        )
        await wait()
    }

    const poolLength = await tauDistributor.poolLength()
    console.debug("Pool length:", poolLength)
}

let count = 1
async function wait() {
    console.debug(`>>> [${count}] Waiting...`)
    count += 1
    return new Promise(resolve => setTimeout(resolve, 4500))
}


function format(x: number, decimals: number = 18) {
    return bn(`${x}e${decimals}`).toString()
}


main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})