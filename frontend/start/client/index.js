import Web3 from "web3"; // import web3
import Crud from "../build/contracts/Crud.json"; // import contract artifact

let web3; // web3 instance variable
let crud; // contract instance variable

const initWeb3 = () => {
  // initialize web3
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum !== "undefined") {
      // check if metamask has injected itself into the page
      const web3 = new Web3(window.ethereum); // initiate web3
      window.ethereum
        .enable() // prompt user to accept our apps
        .then(() => {
          resolve(new Web3(window.ethereum));
        })
        .catch((e) => {
          reject(e);
        });
      return;
    }
    if (typeof window.web3 !== "undefined") {
      // check if it is an old metamask version
      return resolve(
        new Web3(window.web3.currentProvider) // do the same stuff
      );
    }
    resolve(new Web3("http://localhost:9545")); // use local host with ganache
  });
};

const initContract = () => {
  // initialize contract instance
  const deploymentKey = Object.keys(Crud.networks)[0]; // dynamically get the address
  return new web3.eth.Contract(Crud.abi, Crud.networks[deploymentKey].address);
};

const initApp = () => {
  const $create = document.getElementById("create");
  const $createResult = document.getElementById("create-result");
  const $read = document.getElementById("read");
  const $readResult = document.getElementById("read-result");
  const $edit = document.getElementById("edit");
  const $editResult = document.getElementById("edit-result");
  const $delete = document.getElementById("delete");
  const $deleteResult = document.getElementById("delete-result");
  let accounts = [];

  web3.eth.getAccounts().then((_account) => {
    accounts = _accounts;
  });

  $create.addEventListener("submit", (e) => {
    e.preventDefault;
    const name = e.target.elements[0].value;
    crud.methods
      .create(name)
      .send({ from: account[0] })
      .then(() => {
        $createResult.innerHTML = `New user ${name} was successfully created!`;
      })
      .catch(() => {
        $createResult.innerHTML = `oops... there was an error while trying to create a new user...`;
      });
  });

  $read.addEventListener("submit", (e) => {
    e.preventDefault;
    const id = e.target.elements[0].value;
    crud.methods
      .read(id)
      .call()
      .then((result) => {
        $readResult.innerHTML = `The user id ${result[0]} the user name is ${result[1]}`;
      })
      .catch(() => {
        $readResult.innerHTML = `oops... there was an error`;
      });
  });

  $edit.addEventListener("submit", () => {
    e.preventDefault;
    const id = e.target.elements[0].value;
    const name = e.target.elements[1].value;
    crud.methods
      .update(id, name)
      .send({ from: account[0] })
      .then(() => {
        $editResult.innerHTML = `hanged name of user ${id} to ${name}`;
      })
      .catch(() => {
        $editResult.innerHTML = `oops... there was an error while trying to update user id and name`;
      });
  });

  $delete.addEventListener("Submit", () => {
    e.preventDefault;
    const id = e.target.elements[0].value;
    crud.methods
      .destroy(id)
      .send({ from: account[0] })
      .then(() => {
        $deleteResult.innerHTML = `The record with id ${id} has been deleted.`;
      })
      .catch(() => {
        $deleteResult.innerHTML = `oops... there was an error, delete function did not happen.`;
      });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // waiting for html page to load
  initWeb3() // initialize web3
    .then((_web3) => {
      web3 = _web3; // save web3 in a global variable
      crud = initContract(); // initialize the contract to get the instance
      initApp(); // trigger initApp where everything is set up
    })
    .catch((e) => console.log(e.message));
});
