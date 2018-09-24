const { BN } = web3.utils
const UltimateTicTacToe = artifacts.require("./UltimateTicTacToe.sol")

function ether(n) {
  return new BN(web3.utils.toWei("" + n, "ether"))
}

module.exports = async (
  deployer,
  network,
  [creator, challenger, accepter, spectator, ...accounts]
) => {
  const bet = 0.1
  const royalty = ether(bet / 10)
  await deployer.deploy(UltimateTicTacToe, royalty)
  const ultimate = await UltimateTicTacToe.deployed()
  console.log(`tictactoe address ${ultimate.address}`)
}
