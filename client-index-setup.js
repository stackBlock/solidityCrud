import Web3 from 'web3';      // import web3
import Crud from '../build/contracts/Crud.json';  // import contract artifact 

let web3;   // web3 instance variable
let crud;   // contract instance variable

const initWeb3 = () => {    // initialize web3
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {    // check if metamask has injected itself into the page
      const web3 = new Web3(window.ethereum);       // initiate web3
      window.ethereum.enable()                      // prompt user to accept our apps
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {        // check if it is an old metamask version
      return resolve(     
        new Web3(window.web3.currentProvider)       // do the same stuff
      );
    }
    resolve(new Web3('http://localhost:9545'));     // use local host with ganache
  });
};

const initContract = () => {                        // initialize contract instance
  const deploymentKey = Object.keys(Crud.networks)[0];  // dynamically get the address
  return new web3.eth.Contract(
    Crud.abi, 
    Crud
      .networks[deploymentKey]
      .address
  );
};

const initApp = () => {
};

document.addEventListener('DOMContentLoaded', () => { // waiting for html page to load
  initWeb3()                                          // initialize web3
    .then(_web3 => {                                  
      web3 = _web3;                                   // save web3 in a global variable
      crud = initContract();                          // initialize the contract to get the instance 
      initApp();                                      // trigger initApp where everything is set up
    })
    .catch(e => console.log(e.message));
});
