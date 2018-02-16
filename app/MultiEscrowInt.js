//var MockMultiSigWalletWithDailyLimitFactory = artifacts.require('../../../test/mocks/MultiSigWalletWithDailyLimitFactory.sol');
var MultiSigWalletWithDailyLimitFactory;

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

var getEscrowFact = async() => {
  MultiSigWalletWithDailyLimitFactory  = artifacts.require('../../../build/contracts/MultiSigWalletWithDailyLimitFactory.sol');
  return await MultiSigWalletWithDailyLimitFactory.deployed();
}

var getEscrowFactGanache = async() => {
  return await MultiSigWalletWithDailyLimitFactory.deployed();
}


// =================
//  User functions
// =================

var pullEvent = (result, eventType) => {
 for (var i = 0; i < result.logs.length; i++) {
      var log = result.logs[i];
      if (log.event == eventType) return log.args;
    }
}

var createEscrow = async(escrowFact, owners, confirmations, dailyLimit, args) => {
  // For all other cases, testrpc, testnet, mainnet
  if (escrowFact == undefined) throw('Escrow factory undefined');

  const tx = await escrowFact.create(owners, confirmations, dailyLimit, args); //owners, confirmations, dailyLimit
  return await pullEvent(tx, 'ContractInstantiation');
}

// =============
// Init function
// =============

var init = async (_escrow) => {
  if (testrpc)
    escrow = await MockMultiSigWalletWithDailyLimit.atAddress(_escrow);
  else
    escrow = await MultiSigWalletWithDailyLimit.atAddress(_escrow);
}

// ================
//  Owner functions
// ================

// Returns an id
var submitTransaction = async(destination, value, data, web3Params) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');
  
  const result = await escrow.submitTransaction(destination, value, data, web3Parmas);

  for (var i = 0; i < result.logs.length; i++) {
      var log = result.logs[i];

      if (log.event == "EscrowCreation") {
        // We found the event!
        console.log("Escrow created with id: " + log.args.id);
        return log.args.id;
      }
    }

  return id;
}

var executeTransaction = async (transactionId) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = await escrow.executeTransaction(transactionId, web3Parmas);
}

var confirmTransaction = async (transactionId) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = await escrow.confirmTransaction(transactionId, web3Parmas);
}

var revokeConfirmation = async (transactionId) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = await escrow.revokeConfirmation(transactionId, web3Parmas);
}

// Returns an id
var changeDailyLimit = async(dailyLimit, web3Params) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');
  if (typeof(dailyLimit) == 'number') dailyLimit = new BigNumber(dailyLimit);

  const addr = await escrow.address();
  const data = 'ec534b51' + dailyLimit.toString(16); // pad this
  const tx = await escrow.submitTransaction(addr, new BigNumber(0), data, web3Parmas);

  return id;
}

/*
// Returns an id
var addOwner = async(owner, web3Params) {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = await escrow.(dailyLimit, web3Parmas);

  return id;
}

// Returns an id
var removeOwner = async(owner, web3Params) {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = await escrow.(dailyLimit, web3Parmas);

  return id;
}

// Returns an id
var replaceOwner = async(owner, newOwner, web3Params) {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = await escrow.(dailyLimit, web3Parmas);

  return id;
}

// Returns an id
var changeRequirement = async(required, web3Params) {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = await escrow.(dailyLimit, web3Parmas);

  return id;
}
*/

// ===================
// Read only functions
// ===================
  // public
var calcMaxWithdraw = async () => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = escrow.calcMaxWithdraw();
}

var isConfirmed = async (transactionId) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = escrow.isConfirmed(transactionId);
}

var getConfirmationCount = async (transactionId) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = escrow.getConfirmationCount(transactionId);
}

var getTransactionCount = async (transactionId) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = escrow.getTransactionCount(transactionId);
}

var getOwners = async (transactionId) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = escrow.getOwners(transactionId);
}

var getConfirmations = async (transactionId) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = escrow.getConfirmations(transactionId);
}

var getTransactionIds = async (from, to, pending, exeucted) => {
  if (simulated) return;
  if (escrow == undefined) throw('Escrow factory undefined');

  const tx = escrow.getTransactionIds(from, to, pending, executed);
}

// =================
//       API
// =================

// testing
exports.setBlockTime = setBlockTime;

// init
exports.init = init;

// Owners
exports.executeTransaction = executeTransaction;
exports.confirmTransaction = confirmTransaction;
exports.revokeConfirmation = revokeConfirmation;
exports.submitTransaction  = submitTransaction;

// Read only
exports.calcMaxWithdraw = calcMaxWithdraw;
exports.isConfirmed = isConfirmed;
exports.getConfirmationCount = getConfirmationCount;
exports.getTransactionCount = getTransactionCount;
exports.getOwners = getOwners;
exports.getConfirmations = getConfirmations;
exports.getTransactionIds = getTransactionIds;

module.exports = {
    getEscrowFact,
    createEscrow
};
