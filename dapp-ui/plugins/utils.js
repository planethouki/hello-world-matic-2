import AirbnbABI from './airbnbABI'
const Web3 = require('web3')

let metamaskWeb3 = new Web3()
let account = null
let airbnbContract
let airbnbContractAddress = '0x5dA1b6318Bc6B696FD328D23550F48E3eeDBf4f9' // Paste Contract address here

export function web3() {
  return metamaskWeb3
}

export const accountAddress = () => {
  return account
}

export async function setProvider() {
  if (window.ethereum)
  {
    metamaskWeb3 = new Web3(ethereum);
    try{
      // Request account access if needed
      await ethereum.enable();
    }
    catch (error){
      // User denied account access...
    }
  }
  else if (window.web3){
    metamaskWeb3 = new Web3(web3.currentProvider);
  }
  account = await metamaskWeb3.eth.getAccounts()
}


function getAirbnbContract() {
  airbnbContract = airbnbContract || new metamaskWeb3.eth.Contract(AirbnbABI.abi, airbnbContractAddress)
  return airbnbContract
}


export async function postProperty(name, description, price) {
  const prop = await getAirbnbContract()
    .methods.rentOutproperty(name, description, price)
    .send({
      from: account[0]
    })
  alert('Property Posted Successfully')
}

export async function bookProperty(spaceId, checkInDate, checkOutDate, totalPrice) {
  const prop = await getAirbnbContract()
    .methods
    .rentProperty(spaceId, checkInDate, checkOutDate)
    .send({
      from: account[0],
      value: totalPrice
    })
  alert('Property Booked Successfully')
}

export async function fetchAllProperties() {
  const propertyId = await getAirbnbContract().methods.propertyId().call()
  // iterate till property Id
  const properties = []
  for (let i = 0; i < propertyId; i++) {
    const p = await airbnbContract.methods.properties(i).call()
    properties.push({
      id: i,
      name: p.name,
      description: p.description,
      price: metamaskWeb3.utils.fromWei(p.price)
    })
  }
  return properties
}
