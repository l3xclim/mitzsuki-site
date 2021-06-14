/*global ethereum, MetamaskOnboarding */

import Web3 from 'web3';

import { encrypt } from 'eth-sig-util'
import MetaMaskOnboarding from '@metamask/onboarding'

const contractAddress = '0x6093A9Ce43E9C8A054E2991a27c242f24B074fD6';

const abi =
      [
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
	  "name": "grantRole",
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
	  "name": "pause",
	  "outputs": [],
	  "stateMutability": "nonpayable",
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
	  "inputs": [],
	  "name": "totalAvailable",
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
	  "inputs": [],
	  "name": "unpause",
	  "outputs": [],
	  "stateMutability": "nonpayable",
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

const currentUrl = new URL(window.location.href);

const redeemButton = document.getElementById('redeem-button');
const message = document.getElementById('message');
const keyCount = document.getElementById('key-count');

const remainingCount = document.getElementById('remaining-count');

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

const initialize = async () => {

  let onboarding;
  let accounts;
  let account;
  let availableToRedeem = 0;
  let totalAvailable;

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
  }

  const onClickConnect = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      handleNewAccounts(newAccounts);
    } catch (error) {
      console.error(error)
    }
  }

  const mint = async () => {
    toggleClass(redeemButton, 'busy')
    await contract.methods.redeem(account).send({from: account});
    toggleClass(redeemButton, 'finished');
    toggleClass(message,'success');
    refreshCounter();
  }

  const onClickInstall = () => {
    toggleClass(redeemButton, 'busy')
    onboarding.startOnboarding()
  }

  function toggleClass(elem, c) {
    elem.className = "";
    elem.classList.add(c);
  }

  const maybePluralize = (count, noun, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

  const refreshCounter = async () => {
    availableToRedeem = await contract.methods.available(account).call();
    totalAvailable = await contract.methods.totalAvailable().call();
    document.getElementById('remaining-count').textContent = totalAvailable;
  }

  const updateButtons = async () => {
    if (!isMetaMaskInstalled()) {
      redeemButton.innerText = 'Click here to install MetaMask!'
      toggleClass(redeemButton, 'connect'); // or have a separate 'install' state
      redeemButton.onclick = onClickInstall
    } else if (isMetaMaskConnected()) {
      await loadContract();
      await refreshCounter();

      if (!availableToRedeem || availableToRedeem == 0) {
        toggleClass(redeemButton, 'cantredeem');
        toggleClass(message,'no-keys');
      } else {
        toggleClass(message,'hazkeys');
        keyCount.textContent = `${availableToRedeem}`;
        redeemButton.onclick = mint
        toggleClass(redeemButton, 'redeem')
      }
      if (onboarding) {
        onboarding.stopOnboarding()
      }
    } else {
      toggleClass(redeemButton, 'connect');
      redeemButton.onclick = onClickConnect
    }
  }

  async function handleNewAccounts (newAccounts) {
    accounts = newAccounts;
    account = accounts[0];
    window.accounts = newAccounts;
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
