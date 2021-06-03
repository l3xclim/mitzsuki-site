/*global ethereum, MetamaskOnboarding */

/*
The `piggybankContract` is compiled from:

  pragma solidity ^0.4.0;
  contract PiggyBank {

      uint private balance;
      address public owner;

      function PiggyBank() public {
          owner = msg.sender;
          balance = 0;
      }

      function deposit() public payable returns (uint) {
          balance += msg.value;
          return balance;
      }

      function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
          require(msg.sender == owner);
          balance -= withdrawAmount;

          msg.sender.transfer(withdrawAmount);

          return balance;
      }
  }
*/

import Web3 from 'web3';

import { encrypt } from 'eth-sig-util'
import MetaMaskOnboarding from '@metamask/onboarding'

const contractAddress = '0xcBbcB064481C8A787fEa7F5Eb1254d223b69D5dC';
const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
	"indexed": true,
	"internalType": "address",
	"name": "account",
	"type": "address"
      },
      {
	"indexed": true,
	"internalType": "address",
	"name": "operator",
	"type": "address"
      },
      {
	"indexed": false,
	"internalType": "bool",
	"name": "approved",
	"type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "account",
	"type": "address"
      },
      {
	"internalType": "uint256",
	"name": "id",
	"type": "uint256"
      },
      {
	"internalType": "uint256",
	"name": "value",
	"type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "account",
	"type": "address"
      },
      {
	"internalType": "uint256[]",
	"name": "ids",
	"type": "uint256[]"
      },
      {
	"internalType": "uint256[]",
	"name": "values",
	"type": "uint256[]"
      }
    ],
    "name": "burnBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "bytes32",
	"name": "role",
	"type": "bytes32"
      },
      {
	"internalType": "address",
	"name": "account",
	"type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "to",
	"type": "address"
      },
      {
	"internalType": "uint256",
	"name": "id",
	"type": "uint256"
      },
      {
	"internalType": "uint256",
	"name": "amount",
	"type": "uint256"
      },
      {
	"internalType": "bytes",
	"name": "data",
	"type": "bytes"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "to",
	"type": "address"
      },
      {
	"internalType": "uint256[]",
	"name": "ids",
	"type": "uint256[]"
      },
      {
	"internalType": "uint256[]",
	"name": "amounts",
	"type": "uint256[]"
      },
      {
	"internalType": "bytes",
	"name": "data",
	"type": "bytes"
      }
    ],
    "name": "mintBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
	"indexed": true,
	"internalType": "address",
	"name": "previousOwner",
	"type": "address"
      },
      {
	"indexed": true,
	"internalType": "address",
	"name": "newOwner",
	"type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
	"indexed": false,
	"internalType": "address",
	"name": "account",
	"type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "_to",
	"type": "address"
      }
    ],
    "name": "redeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "bytes32",
	"name": "role",
	"type": "bytes32"
      },
      {
	"internalType": "address",
	"name": "account",
	"type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "bytes32",
	"name": "role",
	"type": "bytes32"
      },
      {
	"internalType": "address",
	"name": "account",
	"type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
	"indexed": true,
	"internalType": "bytes32",
	"name": "role",
	"type": "bytes32"
      },
      {
	"indexed": true,
	"internalType": "bytes32",
	"name": "previousAdminRole",
	"type": "bytes32"
      },
      {
	"indexed": true,
	"internalType": "bytes32",
	"name": "newAdminRole",
	"type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
	"indexed": true,
	"internalType": "bytes32",
	"name": "role",
	"type": "bytes32"
      },
      {
	"indexed": true,
	"internalType": "address",
	"name": "account",
	"type": "address"
      },
      {
	"indexed": true,
	"internalType": "address",
	"name": "sender",
	"type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
	"indexed": true,
	"internalType": "bytes32",
	"name": "role",
	"type": "bytes32"
      },
      {
	"indexed": true,
	"internalType": "address",
	"name": "account",
	"type": "address"
      },
      {
	"indexed": true,
	"internalType": "address",
	"name": "sender",
	"type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "from",
	"type": "address"
      },
      {
	"internalType": "address",
	"name": "to",
	"type": "address"
      },
      {
	"internalType": "uint256[]",
	"name": "ids",
	"type": "uint256[]"
      },
      {
	"internalType": "uint256[]",
	"name": "amounts",
	"type": "uint256[]"
      },
      {
	"internalType": "bytes",
	"name": "data",
	"type": "bytes"
      }
    ],
    "name": "safeBatchTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "from",
	"type": "address"
      },
      {
	"internalType": "address",
	"name": "to",
	"type": "address"
      },
      {
	"internalType": "uint256",
	"name": "id",
	"type": "uint256"
      },
      {
	"internalType": "uint256",
	"name": "amount",
	"type": "uint256"
      },
      {
	"internalType": "bytes",
	"name": "data",
	"type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "operator",
	"type": "address"
      },
      {
	"internalType": "bool",
	"name": "approved",
	"type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
	"indexed": true,
	"internalType": "address",
	"name": "operator",
	"type": "address"
      },
      {
	"indexed": true,
	"internalType": "address",
	"name": "from",
	"type": "address"
      },
      {
	"indexed": true,
	"internalType": "address",
	"name": "to",
	"type": "address"
      },
      {
	"indexed": false,
	"internalType": "uint256[]",
	"name": "ids",
	"type": "uint256[]"
      },
      {
	"indexed": false,
	"internalType": "uint256[]",
	"name": "values",
	"type": "uint256[]"
      }
    ],
    "name": "TransferBatch",
    "type": "event"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "newOwner",
	"type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
	"indexed": true,
	"internalType": "address",
	"name": "operator",
	"type": "address"
      },
      {
	"indexed": true,
	"internalType": "address",
	"name": "from",
	"type": "address"
      },
      {
	"indexed": true,
	"internalType": "address",
	"name": "to",
	"type": "address"
      },
      {
	"indexed": false,
	"internalType": "uint256",
	"name": "id",
	"type": "uint256"
      },
      {
	"indexed": false,
	"internalType": "uint256",
	"name": "value",
	"type": "uint256"
      }
    ],
    "name": "TransferSingle",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
	"indexed": false,
	"internalType": "string",
	"name": "value",
	"type": "string"
      },
      {
	"indexed": true,
	"internalType": "uint256",
	"name": "id",
	"type": "uint256"
      }
    ],
    "name": "URI",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
	"indexed": false,
	"internalType": "address",
	"name": "account",
	"type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "_to",
	"type": "address"
      }
    ],
    "name": "available",
    "outputs": [
      {
	"internalType": "uint256",
	"name": "",
	"type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "account",
	"type": "address"
      },
      {
	"internalType": "uint256",
	"name": "id",
	"type": "uint256"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
	"internalType": "uint256",
	"name": "",
	"type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "address[]",
	"name": "accounts",
	"type": "address[]"
      },
      {
	"internalType": "uint256[]",
	"name": "ids",
	"type": "uint256[]"
      }
    ],
    "name": "balanceOfBatch",
    "outputs": [
      {
	"internalType": "uint256[]",
	"name": "",
	"type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
	"internalType": "bytes32",
	"name": "",
	"type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "bytes32",
	"name": "role",
	"type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
	"internalType": "bytes32",
	"name": "",
	"type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "bytes32",
	"name": "role",
	"type": "bytes32"
      },
      {
	"internalType": "uint256",
	"name": "index",
	"type": "uint256"
      }
    ],
    "name": "getRoleMember",
    "outputs": [
      {
	"internalType": "address",
	"name": "",
	"type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "bytes32",
	"name": "role",
	"type": "bytes32"
      }
    ],
    "name": "getRoleMemberCount",
    "outputs": [
      {
	"internalType": "uint256",
	"name": "",
	"type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "bytes32",
	"name": "role",
	"type": "bytes32"
      },
      {
	"internalType": "address",
	"name": "account",
	"type": "address"
      }
    ],
    "name": "hasRole",
    "outputs": [
      {
	"internalType": "bool",
	"name": "",
	"type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "address",
	"name": "account",
	"type": "address"
      },
      {
	"internalType": "address",
	"name": "operator",
	"type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
	"internalType": "bool",
	"name": "",
	"type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MINTER_ROLE",
    "outputs": [
      {
	"internalType": "bytes32",
	"name": "",
	"type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
	"internalType": "address",
	"name": "",
	"type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
	"internalType": "bool",
	"name": "",
	"type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PAUSER_ROLE",
    "outputs": [
      {
	"internalType": "bytes32",
	"name": "",
	"type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "bytes4",
	"name": "interfaceId",
	"type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
	"internalType": "bool",
	"name": "",
	"type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
	"internalType": "uint256",
	"name": "",
	"type": "uint256"
      }
    ],
    "name": "uri",
    "outputs": [
      {
	"internalType": "string",
	"name": "",
	"type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const currentUrl = new URL(window.location.href)

const redeemButton = document.getElementById('redeem-button')

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

const initialize = async () => {

  console.log('hello world');
  
  let onboarding
  let accounts

  try {
    onboarding = new MetaMaskOnboarding();
  } catch (error) {
    console.error(error)
  }

  const isMetaMaskConnected = () => accounts && accounts.length > 0

  async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    }
  }

  async function loadContract() {
    await loadWeb3();
    window.contract = await new window.web3.eth.Contract(abi, contractAddress);
    console.log('Ready!');
  }

  const onClickConnect = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      handleNewAccounts(newAccounts)
    } catch (error) {
      console.error(error)
    }
  }

  const mint = async () => {
    console.log('redeeming!');
    redeemButton.disabled = true
    await contract.methods.redeem(accounts[0]).send({from: accounts[0]});
    toggleClass(redeemButton, 'finished');
    console.log('done!');
  }

  const onClickInstall = () => {
    redeemButton.disabled = true
    onboarding.startOnboarding()
  }

  function toggleClass(elem, c) {
    elem.className = "";
    elem.classList.add(c);
  }

  const updateButtons = () => {
    console.log('update buttons!');
    if (!isMetaMaskInstalled()) {
      console.log('metamask is not installed');
      redeemButton.innerText = 'Click here to install MetaMask!'
      toggleClass(redeemButton, 'connect'); // or have a separate 'install' state
      redeemButton.onclick = onClickInstall
      redeemButton.disabled = false
    } else if (isMetaMaskConnected()) {
      console.log('metamask is installed and connected!');
      loadContract();
      redeemButton.onclick = mint
      toggleClass(redeemButton, 'redeem')
      if (onboarding) {
        onboarding.stopOnboarding()
      }
    } else {
      console.log('metamask is not connected');
      toggleClass(redeemButton, 'connect');
      redeemButton.onclick = onClickConnect
      redeemButton.disabled = false
    }
  }

  function handleNewAccounts (newAccounts) {
    accounts = newAccounts;
    window.accounts = newAccounts;
    console.log('got new accounts!');
    console.log(newAccounts);
    updateButtons()
  }

  updateButtons();

  if (isMetaMaskInstalled()) {
    ethereum.on('accountsChanged', handleNewAccounts)

    try {
      const newAccounts = await ethereum.request({
        method: 'eth_accounts',
      })
      handleNewAccounts(newAccounts)
    } catch (err) {
      console.error('Error on init when getting accounts', err)
    }
  }
}
window.addEventListener('DOMContentLoaded', initialize)
