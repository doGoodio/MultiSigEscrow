
const MultisigWalletWithoutDailyLimit = artifacts.require('MultiSigWallet.sol')
const MultisigWalletWithDailyLimit = artifacts.require('MultiSigWalletWithDailyLimit.sol')
const MultiSigWalletWithDailyLimitFactory = artifacts.require('MultiSigWalletWithDailyLimitFactory.sol')

module.exports = deployer => {
  const args = process.argv.slice()
  fixed=false
  required='0'
  accounts=''
  dailylimit='none'

  deployer.deploy(MultiSigWalletWithDailyLimitFactory);
  return;
  
  for (iArg=0; iArg<args.length; iArg++) {
    if (args[iArg].startsWith("--dailylimit")) { dailylimit=args[iArg].substr(13) } // optional
    if (args[iArg].startsWith("--required")) { required=args[iArg].substr(11) } // optional
    if (args[iArg].startsWith("--accounts")) { accounts=args[iArg].substr(11) }
    if (args[iArg].startsWith("--fixed")) { fixed=true } // optional
  }

  //if (fixed == undefined) { fixed=false }
  //if (required == undefined) { required='0' }
  factoryWithLimit = true;
  if (factoryWithLimit){
    deployer.deploy(MultiSigWalletWithDailyLimitFactory)
    console.log("Factory with Daily Limit deployed")
  } else if (!accounts) {
    console.error("Multisig with daily limit requires to pass owner " +
      "list, required confirmations and daily limit. e.g. --account=,--dailylimit=, --required=,--fixed")
  } else if (dailylimit == 'none') {
    deployer.deploy(MultisigWalletWithoutDailyLimit, accounts.split(","), required, fixed)
    console.log("Wallet deployed")
  } else {
    deployer.deploy(MultisigWalletWithDailyLimit, accounts.split(","), required, fixed, dailylimit)
    console.log("Wallet with Daily Limit deployed")
  }
}
