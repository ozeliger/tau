import fs from 'fs'
import hre, { ethers } from 'hardhat'
import { bn, getDeployments, saveDeployments } from '../utils'
import { BigNumber, BigNumberish } from 'ethers'

async function main() {
    // ==== Read Configuration ====
    const [deployer] = await hre.ethers.getSigners()

    let deployments = getDeployments()
    let tauFactory
    let tauRouter02

    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

    console.debug("Formatted:", format(1000))

    const TauFactory = await ethers.getContractFactory("TauFactory")
    tauFactory = await TauFactory.deploy(deployer.address)
    deployments.swap["TauFactory"] = tauFactory.address
    saveDeployments(deployments)

    const TauRouter02 = await ethers.getContractFactory("TauRouter02")
    tauRouter02 = await TauRouter02.deploy(
        deployments.swap.TauFactory,
        deployments.tokens.wFIL
    )
    deployments.swap["TauRouter02"] = tauRouter02.address
    saveDeployments(deployments)

    tauFactory = await ethers.getContractAt("TauFactory", deployments.swap.TauFactory);

    await tauFactory.createPair(
        deployments.tokens.wFIL,
        deployments.tokens.DCT
    )
    await wait()
 
    await tauFactory.createPair(
        deployments.tokens.wFIL,
        deployments.tokens.MAV
    )
    await wait()

    await tauFactory.createPair(
        deployments.tokens.wFIL,
        deployments.tokens.WLR
    )
    await wait()

    await tauFactory.createPair(
        deployments.tokens.DCT,
        deployments.tokens.MAV
    )
    await wait()

    await tauFactory.createPair(
        deployments.tokens.DCT,
        deployments.tokens.DIB
    )

    await wait()

    await tauFactory.createPair(
        deployments.tokens.DCT,
        deployments.tokens.WLR
    )
    await wait()

    await tauFactory.createPair(
        deployments.tokens.MAV,
        deployments.tokens.DIB
    )
    await wait()

    await tauFactory.createPair(
        deployments.tokens.MAV,
        deployments.tokens.WLR
    )
    await wait()

    const allPairsLength = await tauFactory.allPairsLength()
    console.debug("allPairsLength:", allPairsLength.toString())
    let _res: any = {}
    let count = 0
    const tokens = deployments.tokens
    for(const i in tokens) {
        for(const j in tokens) {
            if(i === j)
                continue

            let mixed = ""
            const tokenA = tokens[i]
            const tokenB = tokens[j]
            const pairAddress = await tauFactory.getPair(tokenA, tokenB)
            if(pairAddress === ZERO_ADDRESS)
                continue

            mixed = `${tokenA}-${tokenB}`
            _res[mixed] = { 
                id: count,
                tokenA: i,
                tokenB: j,
                pairAddress
            }

            mixed = `${tokenB}-${tokenA}`
            _res[mixed] = { 
                id: count,
                tokenA: i,
                tokenB: j,
                pairAddress
            }

            count += 1
        }
    }

    console.debug("All pairs:", Object.keys(_res).length)
    deployments.pairs = _res
    saveDeployments(deployments)

    // =============
    // Add Liquidity
    // =============
    tauRouter02 = await ethers.getContractAt("TauRouter02", deployments.swap.TauRouter02)

    const wFIL = await ethers.getContractAt("WETH9", deployments.tokens.wFIL)
    const DCT = await ethers.getContractAt("MockERC20", deployments.tokens.DCT)
    const DIB = await ethers.getContractAt("MockERC20", deployments.tokens.DIB)
    const MAV = await ethers.getContractAt("MockERC20", deployments.tokens.MAV)
    const WLR = await ethers.getContractAt("MockERC20", deployments.tokens.WLR)


    console.debug("Approving...");
    await DCT.approve(tauRouter02.address, format(400000)); await wait()
    await DIB.approve(tauRouter02.address, format(400000)); await wait()
    await MAV.approve(tauRouter02.address, format(400000)); await wait()
    await WLR.approve(tauRouter02.address, format(400000)); await wait()
    console.debug("Done...")

    const pairs: any = deployments.pairs
    for(const pair in pairs) {
        const tokenA = pair.split("-")[0]
        const tokenB = pair.split("-")[1]

        const val1 = pairs[pair].tokenA !== "wFIL" ? format(40000) : format(1500)
        const val2 = pairs[pair].tokenB !== "wFIL" ? format(80000) : format(1500)
        const value = [pairs[pair].tokenA, pairs[pair].tokenB].includes("wFIL") ? format(1500) : "0"

        console.debug("Deets:", {
            tokenA, tokenB, val1, val2, value
        })

        console.debug("Doing:", pair)

        if(value === "0") {
            await tauRouter02.addLiquidity(
                tokenA,
                tokenB,
                val1,
                val2,
                val1,
                val2,
                deployer.address,
                (new Date()).setMinutes((new Date()).getMinutes() + 10)
            )
        } else {
            await tauRouter02.addLiquidityETH(
                tokenA !== "wFIL" ? tokenA : tokenB,
                val1,
                val1,
                val2,
                deployer.address,
                (new Date()).setMinutes((new Date()).getMinutes() + 10),
                {
                    value: value
                }
            )
        }

        await wait();
    }
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