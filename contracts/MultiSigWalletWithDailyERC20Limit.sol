pragma solidity ^0.4.15;
import "./MultiSigWallet.sol";

import "./EscrowERC20WithdrawDailyLimit.sol";


/// @title Multisignature wallet with daily limit - Allows an owner to withdraw a daily limit without multisig.
/// @author Stefan George - <stefan.george@consensys.net>
contract MultiSigWalletWithDailyLimit is MultiSigWallet, ERC20WithdrawDailyLimit {

  address erc20;

    /*
     * Public functions
     */
    /// @dev Contract constructor sets initial owners, required number of confirmations and daily withdraw limit.
    /// @param _owners List of initial owners.
    /// @param _required Number of required confirmations.
    /// @param _dailyLimit Amount in wei, which can be withdrawn without confirmations on a daily basis.
  function MultiSigWalletWithDailyLimit(address[] _owners, uint _required, bool _fixedOwners, uint _dailyLimit, address _erc20)
        public
        MultiSigWallet(_owners, _required, _fixedOwners)
    {
      _changeDailyLimit(_dailyLimit);
      erc20 = _erc20;
    }


  
  // questions, 
  //   becareful of intenral fns in ERC20WithdrawDailyLimit being called by wallet.. that is a bug


    /// @dev Allows to change the daily limit. Transaction has to be sent by wallet.
    /// @param _dailyLimit Amount in ..
    function changeDailyLimit(uint _dailyLimit) public onlyWallet { _changeDailyLimit(_dailyLimit); }

    function getMaxWithdraw() public view returns (uint) { return _getMaxWithdraw(); }

    function withdrawTokens(address to, uint value) public onlyWallet { _withdrawTokens(erc20, to, value); }

    /// @dev Allows anyone to execute a confirmed transaction or ether withdraws until daily limit is reached.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint transactionId)
        public
        ownerExists(msg.sender)
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
      Transaction storage txn = transactions[transactionId];
      bool _confirmed = isConfirmed(transactionId);

      // this.withdrawTokens(to, value);
      bool _withdrawTokens =            
           txn.destination == address(this)
        && txn.data[0] == 0x06
        && txn.data[1] == 0xb0
        && txn.data[2] == 0x91
        && txn.data[3] == 0xf9;

      if (_confirmed || _withdrawTokens) {
        txn.executed = txn.destination.call.value(txn.value)(txn.data);
        if (txn.executed)  Execution(transactionId);
        else               ExecutionFailure(transactionId);
      }
    }
}
