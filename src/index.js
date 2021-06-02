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


import { encrypt } from 'eth-sig-util'
import MetaMaskOnboarding from '@metamask/onboarding'

const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
  ? 'http://localhost:9010'
  : undefined

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
    onboarding = new MetaMaskOnboarding({ forwarderOrigin })
  } catch (error) {
    console.error(error)
  }

  const isMetaMaskConnected = () => accounts && accounts.length > 0

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

  const mint = () => {
    console.log('yay');
  }

  const onClickInstall = () => {
    redeemButton.innerText = '...'
    redeemButton.disabled = true
    onboarding.startOnboarding()
  }

  function toggleClass(elem, c) {
    elem.className = "";
    elem.classList.add(c);
  }

  const updateButtons = () => {
    if (!isMetaMaskInstalled()) {
      console.log('metamask is not installed');
      redeemButton.innerText = 'Click here to install MetaMask!'
      toggleClass(redeemButton, 'connect'); // or have a separate 'install' state
      redeemButton.onclick = onClickInstall
      redeemButton.disabled = false
    } else if (isMetaMaskConnected()) {
      console.log('metamask is installed and connected!');
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
