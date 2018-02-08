var MockMultiSigWalletWithDailyLimitFactory = artifacts.require('../../../test/mocks/MultiSigWalletWithDailyLimitFactory.sol');
var MultiSigWalletWithDailyLimitFactory = artifacts.require('../../../build/contracts/MultiSigWalletWithDailyLimitFactory.sol');
var escrowFact = undefined;

var simulated = false;
var testrpc = true;
var failPercentage = 0.01;

// ==============
// Test functions
// ==============

var setBlockTime = async(t, web3Params) => {
  // begin timestamp
  const tx = await escrow.setBlockTime(t, web3Params);
}

// =============
// Init function
// =============

var init = async (web3Params) => {
  if (testrpc)
    escrowFact = await MockMultiSigWalletWithDailyLimitFactory.new(web3Params);
  else
    escrowFact = await MultiSigWalletWithDailyLimitFactory.Deployed();
}

// =================
//  User functions
// =================

var createNewEscrow = async(owners, confirmations, dailyLimit, web3Parmas) => {
  // If simulated allocate fake votes
  if (simulated) return;
  
  // For all other cases, testrpc, testnet, mainnet
  if (escrowFact == undefined) throw('Escrow factory undefined');
  
  const tx = escrowFact.create(owners, confirmations, dailyLimit, web3Parmas);
  escrowFact.ContractInstantiation(address sender, instantiation)
  return instantiation;
}


// =================
//       API
// =================

exports.setBlockTime = setBlockTime;

// init
exports.init = init;

// User
exports.createNewEscrow = createNewEscrow;

