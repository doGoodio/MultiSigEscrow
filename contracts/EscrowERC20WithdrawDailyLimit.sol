pragma solidity ^0.4.15;

// import 'Ownable.sol';

contract ERC20 {
  function transfer(address _to, uint256 _value) returns (bool success); 
  // function approve(address _spender, uint256 _value) returns (bool success); 
}


contract Interface_EscrowERC20WithdrawDailyLimit {
  // Events
  event DailyLimitChange(uint dailyLimit);
  
  // "erc20.transfer(to, amount)"
  function _withdrawTokens(address erc20, address to, uint amount) internal;

  function getMaxWithdraw() public view returns (uint);

  function _changeDailyLimit(uint _newLim) internal;
}

contract ERC20WithdrawDailyLimit is Interface_EscrowERC20WithdrawDailyLimit {

  struct WithdrawT {
    uint dailyLimit;             // User cap
    uint dayLastSpent;           // Last day withdrew from
    uint cumulativeSpentLastDay; // Cumulative balance from last withdraw date
  }

  WithdrawT private withdraw;

  // ======
  // Public
  // ======

  function dailyLimit() public view returns (uint) { return withdraw.dailyLimit; }

  function _getMaxWithdraw() internal view returns (uint) {
    uint today = now / 24 hours;
    bool haveNotWithdrawnToday = today > withdraw.dayLastSpent;

    // If new day, then they have max dailyLimit
    if (haveNotWithdrawnToday)
      return withdraw.dailyLimit;

    return (withdraw.cumulativeSpentLastDay > withdraw.dailyLimit)
           ? 0                                                       // Happens if decrease dailyLimit on same day
           : withdraw.dailyLimit - withdraw.cumulativeSpentLastDay;  // maxSpending - runningSpending
  }

  function _withdrawTokens(address erc20, address to, uint value) internal {
    ERC20(erc20).transfer(to, value);
  }

  // Clears daily limit for the day.
  function _changeDailyLimit(uint _newLim) internal {
    DailyLimitChange(_newLim);
    withdraw.dailyLimit = _newLim; 
  }

  // =======
  // Private
  // =======

  function deductDailyWithdraw(uint amount) private {
    // Update if latest day
    uint today = now / 24 hours;
    if (today > withdraw.dayLastSpent) {
      withdraw.cumulativeSpentLastDay = 0;
      withdraw.dayLastSpent = now / 24 hours; // today
    }

    // Make sure don't go over
    uint remaining = withdraw.dailyLimit - withdraw.cumulativeSpentLastDay;
    require(remaining >= amount); 

    // Deduct balance
    withdraw.cumulativeSpentLastDay += amount;
  }
}
