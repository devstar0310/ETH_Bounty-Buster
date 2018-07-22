pragma solidity ^0.4.18;

contract BountyBuster {
  struct Task {
    address poster;
    address hunter;
    uint reward;
    string description;
  }

}
