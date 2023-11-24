import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import axios from 'axios';
import Toastify from 'toastify-js';
import { Clipboard } from '@capacitor/clipboard';



const importText =   document.getElementById('import-text');
// const bankersClick = document.getElementsByClassName('pubkeyAdd')[0];



const formCreateAccount =   document.getElementById('create-new-form');
const importTextButton = document.getElementById('import-text-button')
const importTextForm = document.getElementById('import-text-form');
const userProfileForm = document.getElementById('user-profile-form')
const formAddBanker = document.getElementById('add-banker-form');
const formWithdraw = document.getElementById('withdraw-submit')
const contractName = document.getElementById("contract-name");
const creatorName = document.getElementById("creator-name");
const creatorEmail = document.getElementById("creator-email");
const creatorAddress = document.getElementById("creator-address");
const minusButton = document.getElementById('address-amount');
//const addMinus = document.getElementsByClassName('pubkeyAdd')[0]
const withdrawalAddBtn = document.getElementById('withdrawal-plus-icon')
const getbankerClick = document.getElementsByClassName('getbankerClick')[0]
const getListClick = document.getElementsByClassName('getlistClick')[0]

/**
  Tabs container ids
**/
let importTextTab = document.getElementById('importText')
let firstTab = document.getElementById('first')
let secondTab = document.getElementById('second')
let addBankerTab = document.getElementById('addbanker')
let thirdTab = document.getElementById('third')
let fourthTab = document.getElementById('fourth')
let fifthTab = document.getElementById('sixth')

// /**
//   Import Text screen
// **/
let importArea = document.getElementById('import-area')
let bankerVerifyWithdrawal = document.getElementById('banker-verify-withdrawal')
let bankerMessageSignTx = document.getElementById('banker-message-signtx-container')
let ownerMessageSignRequest = document.getElementById('owner-message-sign-request-container')
let ownerWithdrawalBroadcast = document.getElementById('owner-withdrawal-broadcast-container')
let bankerGeneratePrivkey = document.getElementById('banker-privkey-generation')

let openTab

let tabsContainer = document.querySelector("#tabs");

let tabTogglers = tabsContainer.querySelectorAll("#tabs a");

/**
  Withdrawal screen
**/
let withdrawalFee = document.getElementById("withdraw-fee")
let donateBtn = document.getElementById("donate-button")
let sendSignatureCloseBtn = document.getElementById("send-signature-close-btn")

/**
  Export screen
**/
let exportBtn = document.getElementById("export-btn")
let browseBtn = document.getElementById("export-browse-btn")
let inputFileBrowser = document.getElementById("select-dir")


// console.log(getListClick)
// const accountList = document.getElementById('accounts-list');

const sigNumber = document.getElementById('releaseCoins');
const currency = document.getElementById('account-coin-currency')
currency.addEventListener('change', setAccountCurrency)
let ACCOUNT_CURRENCY = "woodcoin"
let bankersArray
let selectedAccountDetails = {}
let USER = {}
let BANKERS

/**
  Withdrawal vars
**/
let unspentAmountTotal = 0
let userInputAmountTotal = 0
let TOTAL_AMOUNT_TO_WITHDRAW = 0
let CHANGE_ADDRESS
let CHANGE_AMOUNT
let DONATION_LOG = 'WhAiyvrEhG6Ty9AkTb1hnUwbT3PubdWkAg'
let DONATION_BTC = 'WhAiyvrEhG6Ty9AkTb1hnUwbT3PubdWkAg'
let DONATION_LTC = 'WhAiyvrEhG6Ty9AkTb1hnUwbT3PubdWkAg'
let DONATION_ADDRESS = 'WhAiyvrEhG6Ty9AkTb1hnUwbT3PubdWkAg'
let WITHDRAWAL_FEE = 0.01

window.onload = async function() {
    try {
        let ret = Filesystem.mkdir({
          path: 'data',
          directory: Directory.Documents,
          recursive: false,
        });
        console.log("folder ", ret);
      } catch (e) {
        console.error("Unable to make directory", e);
      }

      const userDataExist = await readdir('user.json')
      //console.log("userDataExist: ", userDataExist)
      if (!userDataExist) {
        //console.log("should show user profile form")
        const userProfile = document.getElementById('user-profile')
        const aside = document.getElementById('aside')
        const tabsContent = document.getElementById('tab-contents')
        userProfile.classList.remove('hidden')
        aside.classList.add('hidden')
        tabsContent.classList.add('hidden')
      } else {
        USER = await getUserData()
        //console.log("USER: ", USER)
      }

      const contractCheckResult = await readdir('data.json');

      if (contractCheckResult) {
        const accounts = await Filesystem.readFile({
            path: 'data/data.json',
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
          });
        console.log("accounts: ", accounts)
        // win.webContents.send("list:file", accounts)
        listfile(accounts)
      }
}

tabTogglers.forEach(function(toggler) {
    toggler.addEventListener("click", function(e) {
        e.preventDefault();
        console.log('click button')
        importTextTab.classList.add('hidden')
        let tabName = this.getAttribute("href");
        openTab = tabName;
        if (tabName === "#first") {
            // ipcRenderer.send("balance:api", {"send": "get"})
            balanceApi()
            let accountList = document.getElementById('accounts-list')
            let accountDetails = document.getElementById('account-details')
            let accountActions = document.getElementById('account-actions')
            let accountWithdrawal = document.getElementById('account-withdrawal')
            let withdrawalRef = document.getElementById('withdraw-reference')
            // Account Withdrawal screen
            let withdrawAddressInput = document.getElementById('withdraw-address')
            let withdrawAmountInput = document.getElementById('withdraw-amount')
            // Withdrawal reference screen
            let listUnspentRef = document.getElementById('banker-verify-inputs-initial')
            let listOutputRef = document.getElementById('banker-verify-outputs-initial')

            accountList.classList.remove("hidden")
            accountDetails.classList.add("hidden")
            accountActions.classList.add("hidden")
            accountWithdrawal.classList.add("hidden")
            withdrawalRef.classList.add("hidden")

            withdrawAddressInput.value = ""
            withdrawAmountInput.value = ""
            withdrawAddressInput.innerHTML = ""
            withdrawAmountInput.innerHTML = ""
        }
        if (tabName === "#addbanker") {
            refreshBankersList()
            // getUserData()
        }
        if (tabName === "#second") {
            accountBankerData()
            // getUserData()
        }
        let tabContents = document.querySelector("#tab-contents");

        for (let i = 0; i < tabContents.children.length-1; i++) {
          let tab = i + 1
          tabTogglers[i].parentElement.classList.remove("bg-gradient-to-l", "from-gray-500");
          tabContents.children[tab].classList.remove("hidden");
          if ("#" + tabContents.children[tab].id === tabName) {
              continue;
          }
          tabContents.children[tab].classList.add("hidden");

        }
        e.target.parentElement.classList.add("bg-gradient-to-l", "from-gray-500");
    });
});

/**
  Refresh button in account list screen
**/
let refreshBtn = document.getElementById("refresh-account-list")
refreshBtn.addEventListener("click", () => {
  balanceApi()
})
/**
  End of Refresh button in account list screen
**/


function setAccountCurrency() {
  const coinCurrencySend = currency.options[currency.selectedIndex].text;
  ACCOUNT_CURRENCY = coinCurrencySend
  // ipcRenderer.send("newaccount:banker:filter", {});
  readBankersFile()
}

async function readBankersFile() {
  // const fileName = "banker.json"
  // const path = "data"
  // if (fs.existsSync(homedir + "/" + path +"/"+ fileName)) {
  //   fs.readFile(homedir + "/" + path +"/"+ fileName, 'utf8', function(err, jdata){
  //     console.log("jdata: ", jdata)
  //     jdata = JSON.parse(jdata);
  //     //Step 3: append contract variable to list
  //     // console.log(jdata);
  //     // const wData = JSON.stringify(jdata, null, 2)
  //     // win.webContents.send('send:bankers', jdata)
  //   })
  // }
  const bankerCheckResult = await readdir('bankers.json');
  if (bankerCheckResult) {
    const contents = await Filesystem.readFile({
      path: 'data/bankers.json',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  }
  return
}

/* get balance from api */
async function balanceApi() {
    // e.preventDefault()
    // console.log(options)
    // let account = {};
    // const fileName = "data.json"
    // const path = "data"
    const contractCheckResult = await readdir('data.json');
    if (contractCheckResult) {
        const accounts = await Filesystem.readFile({
            path: 'data/data.json',
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
          });
      const allaccount = accounts.data
      for(let i in allaccount) {
        if (allaccount[i].currency === 'woodcoin') {
          try {
              const response = await axios(`https://twigchain.com/ext/getAddress/${allaccount[i].address}`, {
                  method: 'get',
                  headers: {
                      'Accept': 'application/json'
                  }
                  });

              const body = response.data;
              console.log("data responce", body)
              if (body.address) {
                  if (allaccount[i].address === body.address) {

                      allaccount[i].balance = body.balance

                      const accounts = await Filesystem.readFile({
                          path: 'data/data.json',
                          directory: Directory.Documents,
                          encoding: Encoding.UTF8,
                        });
                      if (accounts.data) {
                          const jdata = accounts.data
                          jdata[i] = allaccount[i]
                          const writeAccount = await Filesystem.writeFile({
                              path: 'data/data.json',
                              data: jdata,
                              directory: Directory.Documents,
                              encoding: Encoding.UTF8,
                          });
                          if (writeAccount.uri) {
                              const readmore = await Filesystem.readFile({
                                  path: 'data/data.json',
                                  directory: Directory.Documents,
                                  encoding: Encoding.UTF8,
                                });
                              listfile(readmore)
                          }
                      }
                  }
              }

          } catch (e) {
              console.log(e)
          }
        } else if (allaccount[i].currency === 'bitcoin') {
          try {
            const response = await axios(`https://chain.so/api/v3/balance/BTC/${allaccount[i].address}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'API-KEY': import.meta.env.VITE_API_KEY
                }
            });
            if (response.data) {
              allaccount[i].balance = body.data.confirmed
              const accounts = await Filesystem.readFile({
                path: 'data/data.json',
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
              });
              if (accounts.data) {
                const jdata = accounts.data
                jdata[i] = allaccount[i]
                const writeAccount = await Filesystem.writeFile({
                    path: 'data/data.json',
                    data: jdata,
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8,
                });
                if (writeAccount.uri) {
                    const readmore = await Filesystem.readFile({
                        path: 'data/data.json',
                        directory: Directory.Documents,
                        encoding: Encoding.UTF8,
                      });
                    listfile(readmore)
                }
              }
            }
          } catch (e) {
            console.log(e)
          }
        } else if (allaccount[i].currency === 'litecoin') {
          try {
            const response = await axios(`https://chain.so/api/v3/balance/LTC/${allaccount[i].address}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'API-KEY': import.meta.env.VITE_API_KEY
                }
            });
            if (response.data) {
              allaccount[i].balance = body.data.confirmed
              const accounts = await Filesystem.readFile({
                path: 'data/data.json',
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
              });
              if (accounts.data) {
                const jdata = accounts.data
                jdata[i] = allaccount[i]
                const writeAccount = await Filesystem.writeFile({
                    path: 'data/data.json',
                    data: jdata,
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8,
                });
                if (writeAccount.uri) {
                    const readmore = await Filesystem.readFile({
                        path: 'data/data.json',
                        directory: Directory.Documents,
                        encoding: Encoding.UTF8,
                      });
                    listfile(readmore)
                }
              }
            }
          } catch (e) {
            console.log(e)
          }
        } else {
          console.log("Chain not found")
          return
        }
    }
  }
}

function setDonationAddress(currency) {
  if (currency === "woodcoin") {
    DONATION_ADDRESS = DONATION_LOG
  } else if (currency === "bitcoin") {
    DONATION_ADDRESS = DONATION_BTC
  } else if (currency === "litecoin") {
    DONATION_ADDRESS = DONATION_LTC
  } else {
    console.log("invalid currency")
  }
}


/**
  Helper functions
**/
function isEmailValid(email) {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

async function listfile(evt) {
    // console.log(evt)
    const convertToJson = evt.data
    const accountBody = document.getElementById('accounts-list-body')
    let coinInitial;
    accountBody.innerHTML = ""
    for(let x in convertToJson) {
        if(convertToJson.hasOwnProperty(x)){
            // console.log("convert to json", convertToJson[x].contract_name)
            // ipcRenderer.send("get:balance", {"pubkey": convertToJson[x].address})
            if (convertToJson[x].currency === 'woodcoin') {
              coinInitial = 'LOG'
            } else if (convertToJson[x].currency === 'bitcoin') {
              coinInitial = 'BTC'
            } else {
              coinInitial = 'LTC'
            }
            let row = accountBody.insertRow();
            let name = row.insertCell(0);
            name.setAttribute('class', 'pl-6')
            name.innerHTML = convertToJson[x].contract_name
            let address = row.insertCell(1);
            address.innerHTML = coinInitial + ':' + convertToJson[x].address
            let balance = row.insertCell(2);
            balance.setAttribute('class', 'pl-4')
            balance.innerHTML = convertToJson[x].balance
            let veiwall = row.insertCell(3)
            veiwall.setAttribute('class', 'text-center')
            let viewAccountDetailsButton = document.createElement('button')
            viewAccountDetailsButton.setAttribute('class', "px-5 py-0.5 font-small text-white bg-orange-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-orange-500 hover:bg-orange-500 rounded-full")
            viewAccountDetailsButton.innerHTML = "view"
            veiwall.appendChild(viewAccountDetailsButton)
            //viewAccountDetailsButton.addEventListener('click', getAccountDetails)
            let details = convertToJson[x]
            viewAccountDetailsButton.addEventListener("click", function() {getAccountDetails(details);}, false);
        }
    }

}

/* account detail view */
function getAccountDetails(account){
    console.log("get account details: ", account)
    ACCOUNT_CURRENCY = account.currency
    if (account.hasOwnProperty('id')) {
      let accountList = document.getElementById('accounts-list')
      let accountDetails = document.getElementById('account-details')

      accountList.classList.add("hidden")
      accountDetails.classList.remove("hidden")

      //accountDetails.innerHTML = ""
      let accountName = document.getElementById('account-name')
      // let creatorName = document.getElementById('creator-name')
      let accountEmail = document.getElementById('account-email')
      let accountBalance = document.getElementById('account-balance')
      let accountAddress = document.getElementById('account-address')
      let accountRedeemScript = document.getElementById('account-redeem-script')
      let accountCurrency = document.getElementById('account-currency')
      let accountSignatures = document.getElementById('account-signatures')

      accountName.innerHTML = account.contract_name
      // creatorName.innerHTML = account.creator_name
      accountEmail.innerHTML = account.creator_email
      accountBalance.innerHTML = account.balance
      accountAddress.innerHTML = account.address
      accountRedeemScript.innerHTML = account.redeem_script
      accountCurrency.innerHTML = account.currency
      accountSignatures.innerHTML = account.signature_nedded


      let tableBody = document.getElementById('account-bankers-list')
      tableBody.innerHTML = ''
      let bankers = account.bankers
      for(let x in bankers) {
        if(bankers.hasOwnProperty(x)){
          let pubkey = slicePubkey(bankers[x].pubkey)
          let row = tableBody.insertRow();
          let name = row.insertCell(0);
          name.innerHTML = bankers[x].banker_name
          let email = row.insertCell(1);
          email.innerHTML = bankers[x].banker_email
          let publicKey = row.insertCell(2);
          publicKey.innerHTML = pubkey
          // let signature = row.insertCell(3);
          // signature.innerHTML = bankers[x].signature ? bankers[x].signature : 'no signature yet'
        }
      }

      // Generate action and withdrawal buttons
      let buttonContainer = document.getElementById('account-buttons')
      buttonContainer.innerHTML = ''

      let viewActionsButton = document.createElement('button')
      viewActionsButton.classList.add("items-center", "m-2", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "text-white", "bg-orange-500", "rounded-full", "focus:ring-4", "focus:ring-yellow-200", "dark:focus:ring-yellow-900", "hover:bg-yellow-800")
      viewActionsButton.innerHTML = "Actions"
      let actions = account.signatures
      viewActionsButton.addEventListener("click", function() {listAccountActions(actions);}, false);

      /**
        Disable withdrawal button when account balance is zero(0)
      **/
      let withdrawalButton = document.createElement('button')
      withdrawalButton.innerHTML = "Withdrawal"
      if (account.balance > 0) {
        withdrawalButton.classList.add("inline-flex", "items-center", "m-2", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "text-white", "bg-orange-500", "rounded-full", "focus:ring-4", "focus:ring-yellow-200", "dark:focus:ring-yellow-900", "hover:bg-yellow-800")
        withdrawalButton.disabled = false;
      } else {
        withdrawalButton.classList.add("inline-flex", "items-center", "m-2", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "text-white", "bg-orange-500", "rounded-full", "cursor-not-allowed")
        withdrawalButton.disabled = true;
      }
      let address = {
        "address": account.address,
        "redeemscript": account.redeem_script,
        "currency": account.currency
    }
      withdrawalButton.addEventListener("click", function() {
        setDonationAddress(account.currency)
        accountWithdrawalFunc(address);
      }, false);


      buttonContainer.appendChild(viewActionsButton)
      buttonContainer.appendChild(withdrawalButton)

    }
  }

/**
  Owner view - Account withdrawal
**/
async function accountWithdrawalFunc(address){
    console.log("withdrawal: ", address)
    CHANGE_ADDRESS = address.address
    // ipcRenderer.send("unspent:api", address.address)
    let coin_js
    if (address.currency === "woodcoin") {
      coin_js = coinjs
    } else if (address.currency === "bitcoin") {
      coin_js = bitcoinjs
    } else if (address.currency === "litecoin") {
      coin_js = litecoinjs
    } else {
      console.log("invalid currency")
    }
    const responseUnspent = await unspentApi(address)
    const listP = responseUnspent.utxo
    const script = coin_js.script()
    const addressScript = script.decodeRedeemScript(address.redeemscript)
    console.log("redeem script res ", addressScript)

    let accountDetails = document.getElementById('account-details')
    let accountWithdrawal = document.getElementById('account-withdrawal')
    let accountActions = document.getElementById('account-actions')
    let unspentdiv = document.getElementById('list-unspent')

    // Clear unspent list
    unspentdiv.innerHTML = ""
    unspentAmountTotal = 0
    userInputAmountTotal = 0
    TOTAL_AMOUNT_TO_WITHDRAW = 0

    let tx = coinjs.transaction();
    accountDetails.classList.add("hidden")
    accountWithdrawal.classList.remove("hidden")
    accountActions.classList.add("hidden")


    if (unspentAmountTotal == 0) {
        if (listP) {
            for (let i = 0; i < listP.length; i++) {
              let listPAmount;
              let listPTXID;
              let listPvout
              if (address.currency === 'woodcoin') {
                listPAmount = listP[i].amount / 100000000
                listPTXID = listP[i].txid
                listPvout = listP[i].vout
              } else {
                listPAmount = listP[i].value
                listPTXID = listP[i].hash
                listPvout = listP[i].index
              }
              unspentAmountTotal += Number(listPAmount)
                // let row = tableBody.insertRow()
                // let transactionId = row.insertCell(0)
                // transactionId.innerHTML = listP[i].txid.substring(0,30)+"..."
                // let vout = row.insertCell(1)
                // vout.innerHTML = listP[i].vout
                // let script = row.insertCell(2)
                // script.innerHTML = addressScript.redeemscript.substring(0,20)+"..."
                // let amount = row.insertCell(3)
                // amount.innerHTML = listP[i].amount
                // tx.addinput(listP[i].txid, listP[i].vout, addressScript.redeemscript, null)
                // tx.addoutput("WdBb5rTtXjDYGHBZvXHbhxyUar1n7RA1VJ", 1.99)
                // console.log("tx log test: ", tx.serialize())
                let div = document.createElement('div')
                div.setAttribute('id', 'inner-unspent')
                div.setAttribute('class', 'grid md:grid-cols-4 gap-3')
                let input1 = document.createElement('input')
                input1.setAttribute('class', 'col-span-2 txid-withdraw text-black text-base text-normal p-1')
                input1.setAttribute('id', 'txid-withdraw')
                input1.value = listPTXID
                let input2 = document.createElement('input')
                input2.setAttribute('class', 'text-black')
                input2.setAttribute('class', 'hidden')
                input2.setAttribute('id', 'vout-withdraw')
                input2.value = listPvout
                let input3 = document.createElement('input')
                input3.setAttribute('class', 'text-black text-base text-normal')
                input3.setAttribute('class', 'hidden')
                input3.setAttribute('id', 'script-withdraw')
                input3.value = addressScript.redeemscript
                let input4 = document.createElement('input')
                input4.setAttribute('class', 'col-span-1 text-black text-base text-normal p-1')
                input4.setAttribute('id', 'amount-withdraw')
                input4.value = listPAmount
                let input5 = document.createElement('input')
                input5.setAttribute('class', 'hidden')
                input5.value = address.redeemscript
                let check = document.createElement('input')
                check.setAttribute('type', 'checkbox')
                check.setAttribute('checked', '')
                check.addEventListener('change', (e, evt) => {
                  console.log("e testing ", e)
                  console.log("evt testing ", evt)
                  let withdrawAmt = getTotalWithdrawalAmt()

                  if(e.target.defaultChecked) {
                    check.removeAttribute('checked', '')
                    console.log("subtract this amount: ", input4.value)

                    unspentAmountTotal -= parseFloat(input4.value)
                    withdrawalFee.value = (unspentAmountTotal - withdrawAmt).toFixed(8)
                  } else {
                    check.setAttribute('checked', '')
                    console.log("add this amount: ", input4.value)
                    unspentAmountTotal += parseFloat(input4.value)
                    withdrawalFee.value = (unspentAmountTotal - withdrawAmt).toFixed(8)
                  }
                })
                div.appendChild(input1)
                div.appendChild(input2)
                div.appendChild(input3)
                div.appendChild(input4)
                div.appendChild(input5)
                div.appendChild(check)
                unspentdiv.appendChild(div)
            }
        }

    }
    console.log("total unspent: ", unspentAmountTotal)
    withdrawalFee.value = (unspentAmountTotal).toFixed(8)

  }

  function getTotalWithdrawalAmt() {
    const getuserinput = document.querySelectorAll('#address-keys')
    let totalOutput = 0
  
    for (let i = 0; i < getuserinput.length; i++) {
      let amount = getuserinput[i].children[1].value
      totalOutput += Number(amount)
    }
    return totalOutput
  }

async function unspentApi(address) {
    console.log("ipc main address: ", address)
    if (address.currency === 'woodcoin') {
      try {
          const response = await axios(`https://api.logbin.org/api?address=${address.address}`, {
                  method: 'get',
                  headers: {
                      'Accept': 'application/json'
                  }
          });

          console.log(response)
          if (response.status === 200) {
              const data = {
                "utxo": response.data.message.address,
                "currency": address.currency
              }
              return data
          }
      } catch(e) {
          console.log("error : ", e)
      }
    } else if (address.currency === 'bitcoin') {
      try {
        const response = await axios(`https://chain.so/api/v3/unspent_outputs/BTC/${address.address}/1`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json'
                }
        });

        console.log(response)
        if (response.status === 200) {
          const data = {
            "utxo": response.data.outputs,
            "currency": address.currency
          }
          return data
        }
      } catch(e) {
          console.log("error : ", e)
      }
    } else if (address.currency === 'litecoin') {
      try {
        const response = await axios(`https://chain.so/api/v3/unspent_outputs/LTC/${address.address}/1`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json'
                }
        });

        console.log(response)
        if (response.status === 200) {
          const data = {
            "utxo": response.data.outputs,
            "currency": address.currency
          }
          return data
        }
      } catch(e) {
          console.log("error : ", e)
      }
    } else {
      console.log("Chain not found")
      return
    }
}


/**
  Create user profile
**/
async function createUserProfile(e) {
    e.preventDefault()
    const userName = document.getElementById('user-name').value
    const userEmail = document.getElementById('user-email').value

    /**
      Validation
    **/
    if (userName == '' || userEmail == '') {
      alertError("Name and email is required.")
      return
    } else if (userName.length > 50) {
      alertError("Name should not be more than 50 characters")
      return
    } else if (!isEmailValid) {
      alertError("Invalid email address")
      return
    }

    writeUserData(userName, userEmail)
}

async function writeUserData(userName, userEmail) {

    const addProfileSubmit = document.getElementById('add-user-profile-btn')
    const userNameInput = document.getElementById('user-name')
    const userEmailInput = document.getElementById('user-email')

    addProfileSubmit.disabled = true
    addProfileSubmit.classList.add('opacity-20')
    try {

        let userData = {
          "user_name": userName,
          "user_email": userEmail
        }
        await Filesystem.writeFile({
            path: 'data/user.json',
            data: userData,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });
        addProfileSubmit.disabled = false
        addProfileSubmit.classList.remove('opacity-20')
        userNameInput.value = '';
        userEmailInput.value = '';

        USER = userData
        const userProfile = document.getElementById('user-profile')
        const aside = document.getElementById('aside')
        const tabsContent = document.getElementById('tab-contents')
        userProfile.classList.add('hidden')
        aside.classList.remove('hidden')
        tabsContent.classList.remove('hidden')
        alertSuccess("Profile has successfully been created")

    } catch (e) {
        console.log("Writing user data error: ", e)
    }

}

/**
  Enable / Disable the add banker submit button
**/
function addBankerButton(status) {
  const addBankerSubmit = document.getElementById('banker-submit-button')
  if (status === "enable") {
    addBankerSubmit.disabled = false
    addBankerSubmit.classList.remove('opacity-20')
  } else {
    addBankerSubmit.disabled = true
    addBankerSubmit.classList.add('opacity-20')
  }
}


/* add banker function */
async function addBanker(e) {
    e.preventDefault()
    // const mainBankerDiv = document.getElementById('addbanker')
    const nameInput = document.getElementById('banker-name-add')
    const emailInput = document.getElementById('banker-email-add')
    addBankerButton("disable")

    // Get value of selected currency
    const selectElement = document.querySelector('#banker-coin-currency');
    const bankerCurrency = selectElement.options[selectElement.selectedIndex].text;

    const bankerName = nameInput.value
    const bankerEmail = emailInput.value
    console.log("banker name: ", bankerName)
    console.log("banker email: ", bankerEmail)
    console.log("banker currency: ", bankerCurrency)
    /**
      Add banker form validation
    **/
    if (bankerName == "" || bankerEmail == "") {
      console.log("User name and email is required.")
      alertError("User name and email is required.")
      addBankerButton("enable")
      return
    }
    if (bankerEmail) {
      let validEmail = isEmailValid(bankerEmail)
      if (!validEmail) {
        // console.log("Please enter a valid email")
        alertError("Please enter a valid email")
        addBankerButton("enable")
        return
      }
    }
    /**
      Check the banker to be add is already in the bankers,json
    **/
    if (BANKERS) {
      for(let x in BANKERS) {
          if(BANKERS.hasOwnProperty(x)){
              if (BANKERS[x].banker_name == bankerName && BANKERS[x].banker_email == bankerEmail && BANKERS[x].currency == bankerCurrency) {
                alertError("You are trying to add a banker that is already in the list.")
                addBankerButton("enable")
                return
              }
          }
      }
    }

    if (bankerEmail && bankerName) {
        const getBankerIdNumber = await bankerIdNumber()
        console.log("get banker id number ", getBankerIdNumber)
        let data = {
            "id": Math.floor(1000000000 + Math.random() * 9000000000),
            "banker_id": getBankerIdNumber,
            "banker_name": bankerName,
            "banker_email": bankerEmail,
            "currency": bankerCurrency,
            "pubkey": ""
        }
        writeBankerData(data, getBankerIdNumber, nameInput, emailInput)
    }
}

async function writeBankerData(data, idNumber, nameInput, emailInput) {
    const bankerCheckResult = await readdir('bankers.json');
    const addBankerSubmit = document.getElementById('banker-submit-button')
    try {
        if (bankerCheckResult) {
            console.log("if write banker has been called")
            const contents = await Filesystem.readFile({
                path: 'data/bankers.json',
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
              });
            const contentnew = contents.data
            contentnew["banker" + idNumber] = data
            console.log("contents ", contentnew)
            await Filesystem.writeFile({
                path: 'data/bankers.json',
                data: contentnew,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            addBankerSubmit.disabled = false
            addBankerSubmit.classList.remove('opacity-20')
            nameInput.value = '';
            emailInput.value = '';
            showBankerRequestSend(data)
        } else {
            const addBanker = {
                ["banker" + idNumber]: data
              }
            await Filesystem.writeFile({
                path: 'data/bankers.json',
                data: addBanker,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            console.log("add banker else has been called")
            addBankerSubmit.disabled = false
            addBankerSubmit.classList.add('opacity-20')
            nameInput.value = '';
            emailInput.value = '';
            showBankerRequestSend(data)
        }
    } catch (e) {
        console.log(e)
    }

}

function showBankerRequestSend(data) {
    let bankerForm = document.getElementById('add-banker-form')
    let bankersList = document.getElementById('bankers-list')
    let bankerMessage = document.getElementById('banker-message-container')
    let bankerListContainer = document.getElementById('bankers-list-container')

    bankerListContainer.classList.add('hidden')
    bankerForm.classList.add('hidden')
    bankersList.classList.add('hidden')
    bankerMessage.classList.remove('hidden')


    let buttonDiv = document.getElementById('banker-message-close-button')
    const div = document.createElement('div')
    div.setAttribute('class', 'bg-white p-3 rounded-md text-black')
    const p = document.createElement('p')
    const br = document.createElement('br')
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    const p3 = document.createElement('p')
    const p4 = document.createElement('pre')
    const p5 = document.createElement('p')

    console.log('new banker message: ', data)
    let userName = USER.user_name
    let message = {
      "header": "free_state_central_bank",
      "message": "request-pubkey",
      "creator_name": USER.user_name,
      "creator_email": USER.user_email,
      "banker_id": data.banker_id,
      "banker_name": data.banker_name,
      "banker_email": data.banker_email,
      "currency": data.currency
    }


    bankerMessage.innerHTML = ''
    p.innerHTML = "Please copy the line below and send it to " + message.banker_email;
    p1.innerHTML = USER.user_name + " is requesting for you to become a banker.";
    p2.innerHTML = "Please copy the message inside and import in FSCB";
    p3.innerHTML = "-----Begin fscb message-----";
    p4.innerHTML = JSON.stringify(message, undefined, 2);
    p5.innerHTML = "-----End fscb message-----";

    const copyToClipboardText = p1.innerHTML + '\n' + p2.innerHTML + '\n' + p3.innerHTML + '\n' + p4.innerHTML  + '\n' +  p5.innerHTML
    let copyButtonContainer = document.createElement('div')
    copyButtonContainer.setAttribute('class', 'flex justify-end')
    let copyButton = document.createElement('img')
    copyButton.setAttribute('src', './assets/imgs/copy_button.png')
    copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
    copyButton.addEventListener("click", async function() {
      await Clipboard.write({
        string: copyToClipboardText
      });
      alertSuccess("Message successfully copied in clipboard.")
    }, false);

    copyButtonContainer.appendChild(copyButton)
    div.appendChild(copyButtonContainer)
    div.appendChild(p)
    div.appendChild(br)
    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    div.appendChild(p4)
    div.appendChild(p5)

    bankerMessage.appendChild(div)


    let closeButton = document.createElement('button')
    closeButton.classList.add("items-center", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "mt-5", "text-white", "bg-orange-500", "rounded-lg", "focus:ring-4", "focus:ring-blue-200", "dark:focus:ring-orange-500", "hover:bg-orange-500")
    closeButton.innerHTML = "Close"
    closeButton.addEventListener("click", function() {

      addBankerButton("enable")
      refreshBankersList()
      bankerListContainer.classList.remove('hidden')
      bankerForm.classList.remove('hidden')
      bankersList.classList.remove('hidden')
      bankerMessage.classList.add('hidden')
    }, false);

    console.log("div button: ", buttonDiv)
    buttonDiv.appendChild(closeButton)
    bankerMessage.appendChild(buttonDiv)
}


async function getUserData() {
  try {
    const contents = await Filesystem.readFile({
        path: 'data/user.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    console.log("user details ", contents)
    return contents.data
  }catch(e) {
    console.log("Error trying to read user.json")
  }
}


async function getBankers() {
  try {
    const contents = await Filesystem.readFile({
        path: 'data/bankers.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    console.log("contents banker ", contents)
    return contents.data
  }catch(e) {
    console.log("Error trying to read bankers.json")
  }
}

async function refreshBankersList() {
    const contents = await Filesystem.readFile({
        path: 'data/bankers.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    console.log("contents banker ", contents)
    bankersListView(contents.data)
}

async function bankersListView(evt) {
    bankersArray = evt
    BANKERS = evt
    //
    // Start of Banker's table
    //
    const bankersBody = document.getElementById('bankers-list-body')

    bankersBody.innerHTML = ""
    for(let x in bankersArray) {
        if(bankersArray.hasOwnProperty(x)){
            let pubkey = slicePubkey(bankersArray[x].pubkey)
            let row = bankersBody.insertRow();
            let name = row.insertCell(0);
            name.innerHTML = bankersArray[x].banker_name
            let email = row.insertCell(1);
            email.innerHTML = bankersArray[x].banker_email
            let pubKey = row.insertCell(2);
            pubKey.innerHTML = pubkey
            let currency = row.insertCell(3)
            currency.innerHTML = bankersArray[x].currency
        }
    }
}

async function accountBankerData() {
    const contents = await Filesystem.readFile({
        path: 'data/bankers.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    bankersArray = contents.data
    BANKERS = contents.data
    const selectDiv = document.getElementById('banker-select')
    selectDiv.innerHTML = ''


    var select =  document.createElement("select");
    select.classList.add('hidden')
    select.setAttribute('multiple', '');
    select.dataset.placeholder = 'Choose Bankers'

    // Add the select component to the select container
    selectDiv.appendChild(select)

    // Get the selected value for contract currency
    // And filter bankers array with the value
    select.options.length = 0
    for(const key in bankersArray) {
        if(bankersArray[key].pubkey){
        const opt = bankersArray[key].banker_email;
        const pub = bankersArray[key].pubkey;
        const el = document.createElement("option");
        el.textContent = opt;
        el.value = pub;
        el.setAttribute('class', 'hidden')
        select.appendChild(el);
        }
    }

    const selectOptions = select.querySelectorAll('option');
    const newSelect = document.createElement('div');
    newSelect.setAttribute('class', 'selectMultiple bg-white w-60 relative')
    const active = document.createElement('div');
    // active.classList.add('active');
    // active.setAttribute('class', 'relative z-2 pt-8 pb-2 py-12 rounded-lg text-sm min-h-44 shadow-[0_4px_16px_0_rgba(255,165,0,0.12)] transition shadow-[0_4px_16px_0_rgba(255,165,0,0.12)] duration-300 ease-in hover:shadow-[0_4px_24px_-1px_rgba(255,165,0,0.16)]')
    active.setAttribute('class', 'activeClass')
    const optionList = document.createElement('ul');
    optionList.setAttribute('class', 'optionListClass')
    // optionList.setAttribute('class', 'm-0 p-0 list-none text-base z-1 absolute top-full left-0 right-0 invisible opacity-0 rounded-lg translate-x-0 translate-y-20 origin-top-right shadow-[0_12px_20px_rgba(255,165,0,0.8)] transition-all duration-400 ease-in-out ')
    const placeholder = select.dataset.placeholder;

    const span = document.createElement('span');
    span.setAttribute('class', 'spanClass')
    // span.setAttribute('class', 'text-blue-200 block absolute left-12 cursor-pointer top-8 leading-7 transition-all duration-300 ease-in')
    span.innerText = placeholder;
    active.appendChild(span);

    selectOptions.forEach((option) => {
        // console.log(option)
        let text = option.innerText;
        if(option.selected){
            let tag = document.createElement('a');
            tag.setAttribute('class', 'relative pt-0 pr-5 pb-5 pl-0')
            tag.dataset.value = option.value;
            tag.innerHTML = "<em class='emClass'>"+text+"</em><i class='iClass'></i>";
            active.appendChild(tag);
            span.classList.add('opacity-0 invicible -translate-x-4');
        }else{
            let item = document.createElement('li');
            item.setAttribute('class', 'itemClass')
            // item.setAttribute('class', 'text-indigo-950 bg-white px-12 py-16 cursor-pointer overflow-hidden relative litransition [&>*:first-child]:rounded-br-lg [&>*:first-child]:rounded-bl-none [&>*:last-child]:rounded-bl-lg [&>*:last-child]:rounded-br-none')
            item.dataset.value = option.value;
            item.innerHTML = text;
            optionList.appendChild(item);
        }
    });
    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    // arrow.setAttribute('class', 'arrowClass')
    active.appendChild(arrow);

    newSelect.appendChild(active);
    newSelect.appendChild(optionList);

    select.parentElement.append(newSelect);
    span.appendChild(select);
    
    document.querySelector('.selectMultiple ul').addEventListener('click', (e) => {
        let li = e.target.closest('li');
        if(!li){return;}
        let select = li.closest('.selectMultiple');
        // add a checker, banker selected should not exceed to 14 bankers
        let selectedB = document.querySelectorAll('.activeClass a')
        if(!select.classList.contains('clicked') && selectedB.length < 14){
            select.classList.add('clicked');
            if(li.previousElementSibling){
                li.previousElementSibling.classList.add('beforeRemove');
            }
            if(li.nextElementSibling){
                li.nextElementSibling.classList.add('afterRemove');
            }
            li.classList.add('remove');
            let a = document.createElement('a');
            a.setAttribute('class', 'relative pt-0 pr-5 pb-5 pl-0')
            a.dataset.value = li.dataset.value;
            a.innerHTML = "<em class='emClass'>"+li.innerText+"</em><i class='iClass'></i>";
            a.classList.add('notShown');
            // a.style.display = "none";
            select.querySelector('div').appendChild(a); //might have to check later
            let selectEl = select.querySelector('select');
            let opt = selectEl.querySelector('option[value="'+li.dataset.value+'"]');
            opt.setAttribute('selected', 'selected');
            setTimeout(() => {
                a.classList.add('shown');
                select.querySelector('span').classList.add('hide');
                // if(select.querySelector('option').innerText == li.innerText){
                // 	select.querySelector('option').selected
                // }

            }, 300);
            //1st
            setTimeout(() => {
                let styles = window.getComputedStyle(li);
                    let liHeight = styles.height;
                    let liPadding = styles.padding;
                    let removing = li.animate([
                        {
                            height: liHeight,
                            padding: liPadding
                        },
                        {
                            height: '0px',
                            padding: '0px'
                        }
                    ], {
                        duration: 300, easing: 'ease-in-out'
                    });
                    removing.onfinish = () => {
                        if(li.previousElementSibling){
                            li.previousElementSibling.classList.remove('beforeRemove');
                        }
                        if(li.nextElementSibling){
                            li.nextElementSibling.classList.remove('afterRemove');
                        }
                        li.remove();
                        select.classList.remove('clicked');
                    }
    //             setTimeout(() => {
    //                 if(li.previousElementSibling){
    //                     li.previousElementSibling.classList.remove('beforeRemove');
    //                 }
    //                 if(li.nextElementSibling){
    //                     li.nextElementSibling.classList.remove('afterRemove');
    //                 }

    //             }, 200);
            }, 300); //600
                //2nd
        } else {
          alertError("Maximum number of bankers in an account is 14.")
        }
    });
    //2
    //document.querySelectorAll('.selectMultiple > div a').forEach((a) => {
    document.querySelector('.selectMultiple > div').addEventListener('click', (e) => {
        let a = e.target.closest('a');
        let select = e.target.closest('.selectMultiple');
        if(!a){return;}
        a.className = '';
        a.classList.add('remove');
        select.classList.add('open');
        let selectEl = select.querySelector('select');
        let opt = selectEl.querySelector('option[value="'+a.dataset.value+'"]');
        opt.removeAttribute('selected');
        //setTimeout(() => {
            a.classList.add('disappear');
            setTimeout(() => {
                // start animation
                let styles = window.getComputedStyle(a);
                let padding = styles.padding;
                let deltaWidth = styles.width;
                let deltaHeight = styles.height;

                let removeOption = a.animate([
                    {
                        width: deltaWidth,
                        height: deltaHeight,
                        padding: padding
                    },
                    {
                        width: '0px',
                        height: '0px',
                        padding: '0px'
                    }
                ], {
                    duration: 0,
                    easing: 'ease-in-out'
                });

                let li = document.createElement('li');
                // li.setAttribute('class', 'itemClass')
                li.dataset.value = a.dataset.value;
                li.innerText = a.querySelector('em').innerText;
                li.classList.add('show');
                select.querySelector('ul').appendChild(li);
                setTimeout(() => {
                    if(!selectEl.selectedOptions.length){
                        select.querySelector('span').classList.remove('hide');
                    }
                    li.className = 'itemClass';
                }, 350);

                removeOption.onfinish = () => {
                    a.remove();
                }
                //end animation

            }, 300);
        //}, 400);
    });
    //});
    //3
    document.querySelectorAll('.selectMultiple > div .arrow, .selectMultiple > div span').forEach((el) => {
        el.addEventListener('click', (e) => {
            el.closest('.selectMultiple').classList.toggle('open');
        });
    });

}

function slicePubkey(pubkey) {
    if (pubkey) {
      return pubkey.substring(0, 20) + '...'
    } else {
      return "Pending ..."
    }
  }

function openImportTextTab() {
    importTextTab.classList.remove('hidden')
    firstTab.classList.add('hidden')
    secondTab.classList.add('hidden')
    addBankerTab.classList.add('hidden')
    thirdTab.classList.add('hidden')
    fourthTab.classList.add('hidden')
    fifthTab.classList.add('hidden')

    let tabContents = document.querySelector("#tab-contents");
    for (let i = 0; i < tabContents.children.length-1; i++) {
        tabTogglers[i].parentElement.classList.remove("bg-gradient-to-l", "from-gray-500");
    }
}

function alertSuccess(message) {
    Toastify({
        text: message,
        duration: 5000,
        close: false,
        style: {
        background: '#d4edda',
        borderColor: '#c3e6cb',
        color: '#155724',
        textAlign: 'center',
        },
    }).showToast();
}

function alertError(message) {
    Toastify({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: '#f8d7da',
            borderColor: '#f5c6cb',
            color: '#721c24',
            textAlign: 'center',
        },
    }).showToast();
};

function verifyIfExists(ITEM, LIST) {
    let verification = false;
    for (let i = 0; i < LIST.length; i++) {
      if (LIST[i].name === ITEM) {
        verification = true;
        break;
      }
    }
    return verification;
  }

async function readdir(locFile) {
    try {
        let ret = await Filesystem.readdir({
        path: 'data',
        directory: Directory.Documents
        });
        console.log("return files", ret.files)
        if (verifyIfExists(locFile, ret.files)) {
            console.log("true will return")
            return true
        }
        else {
            // Do something else
            console.log("false will return")
            return false
        }
    }
    catch(e) {
        console.log('Unable to read dir: ' + e);
    }
}


/* generate contract id */
async function idNumber() {
    const bankerCheckResult = await readdir('data.json');
    try {
        if (bankerCheckResult) {
            const dataJson = Filesystem.readFile({
                path: 'data/data.json',
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            return dataJson.then(function(result) {
                const jconvert = result.data
                console.log("contract length: ", jconvert[Object.keys(jconvert)[Object.keys(jconvert).length - 1]].contract_id + 1)
                return jconvert[Object.keys(jconvert)[Object.keys(jconvert).length - 1]].contract_id + 1
            })
        } else {
            return 1
        }
    } catch(err) {
        console.error(err)
    }
}

/* generate banker id */
async function bankerIdNumber() {
    const bankerCheckResult = await readdir('bankers.json');
    try {
        if (bankerCheckResult) {
            const dataJson = Filesystem.readFile({
                path: 'data/bankers.json',
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            return dataJson.then(function(result) {
                const jconvert = result.data
                console.log("banker length: ", jconvert[Object.keys(jconvert)[Object.keys(jconvert).length - 1]].banker_id + 1)
                return jconvert[Object.keys(jconvert)[Object.keys(jconvert).length - 1]].banker_id + 1
            })
        } else {
            return 1
        }
    } catch(err) {
        console.error(err)
    }
}

function parseTextArea(e) {
    e.preventDefault();
    const textarea = document.getElementById('import-text');
    console.log(textarea)
    // const resultDiv = document.getElementById('result');
    const jsonString = textarea.value;
    const startIndex = jsonString.indexOf('{');
    const endIndex = jsonString.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
        let jsonStr = jsonString.substring(startIndex, endIndex + 1);
        jsonStr = jsonStr.replace(/\s/g, " ")
        console.log("json str", jsonStr)
        // ipcRenderer.send("banker:addorsig", jsonStr)
        addOrSign(jsonStr)
    }
}

function addOrSign(options) {
    // e.preventDefault()
    // console.log(typeof(options))
    const banker = JSON.parse(options)
    // console.log(banker)
    if (banker.message.includes("request-pubkey")) {
      //bankerPubkeyRequest(banker)
      /**
        Generate new keys for the account
      **/
    //   win.webContents.send('request:banker-pubkey', banker)
        console.log("request pubkey has been called")
        bankerPukey(banker)
    }else if (banker.message.includes("response-pubkey")) {
      // console.log("response pubkey")
      bankerPubkeyResponse(banker)
    }else if (banker.message.includes("request-signature")) {
      console.log("request signature")
      // win.webContents.send('request:banker-signature', banker)
      bankerSignatureRequest(banker)
    } else if (banker.message.includes("response-signature")) {
      console.log("response signature")
      bankerSignatureResponse(banker)
      //win.webContents.send('response:banker-signature', banker)
    } else if (banker.message.includes("import:json-data")) {
      console.log("import backup data")
      importData(banker)
    } else {
      console.log("signature")
    }
  }

/* response banker signature */
async function bankerSignatureResponse(message) {
  console.log("message banker signature ", message)
  const bankerCheckResult = await readdir('data.json');
  if (bankerCheckResult) {
    const dataJson = await Filesystem.readFile({
        path: 'data/data.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
    });
    // console.log(dataJson)
    const accounts = dataJson.data
    console.log(accounts)
    let accountID = message.id
    let bankerID = message.banker_id
    let next_banker

		for (const [key, value] of Object.entries(accounts)) {
      console.log("account value ", value)
      let account = value
      if (account.id == accountID) {
        console.log("account value ", account)
        console.log("account withdrawals ", typeof(account.withdrawals))
				for (const [index, withdrawal] of account.withdrawals.entries()){
					if (withdrawal.id == message.withdrawal_id){
			    	for (const [index, signature] of withdrawal.signatures.entries()) {
              console.log("signature ", signature)
				      if(signature.banker_id == bankerID) {
                console.log("inside signature")
				        signature.transaction_id = message.transaction_id
				        signature.status = "SIGNED"
				        const date_signed = new Date()
				        signature.date_signed = date_signed

				        // const updatedAccounts = JSON.stringify(accounts, null, 2)
				        // fs.writeFile(homedir + "/data/data.json"
				        //   , updatedAccounts, function writeJson(err) {
				        //   if (err)  {
				        //     console.log(err)
				        //   } else {
				        //     console.log("accounts updated")
				        //     // check number of signatures needed
								// 		const signatures = withdrawal.signatures.filter(val => val.transaction_id != "");
								// 		console.log("signatures: ", signatures);
				        //     if (signatures.length == account.signature_nedded) {
				        //       console.log("ready to broadcast")
				        //       win.webContents.send('withdrawal:ready-to-broadcast', message)
				        //     } else {
				        //       console.log("request signature to next banker")
								// 			let data = {
								// 				"account": account,
								// 				"message": message
								// 			}
								// 			win.webContents.send('response:banker-signature', data)

				        //     }
				        //   }
				        // });
                const writeAccount = await Filesystem.writeFile({
                    path: 'data/data.json',
                    data: accounts,
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8,
                });
                console.log("write account ", writeAccount)
                if (writeAccount.uri) {
                  console.log("accounts updated")
                  // check number of signatures needed
                  const signatures = withdrawal.signatures.filter(val => val.transaction_id != "");
                  console.log("signatures: ", signatures);
                  if (signatures.length == account.signature_nedded) {
                    console.log("ready to broadcast")
                    // win.webContents.send('withdrawal:ready-to-broadcast', message)
                    withdrawReadyToBroadcast(message)
                  } else {
                    console.log("request signature to next banker")
                    let data = {
                      "account": account,
                      "message": message
                    }
                    // win.webContents.send('response:banker-signature', data)
                    responseBankerSignture(data)
                  }
                }
				      }
			    	}
					}
				}
			}
		}
  }
}

/* show user transaction ready for broadcast */
async function withdrawReadyToBroadcast(message) {
  ownerWithdrawalBroadcast.classList.remove('hidden')
  importArea.classList.add('hidden')

  let withdrawalTxId = document.getElementById('owner-withdrawal-txid-for-broadcast')
  withdrawalTxId.innerHTML = message.transaction_id

  let broadcastButton = document.getElementById("owner-withdrawal-broadcast-button")
  broadcastButton.addEventListener('click', () => {
    // ipcRenderer.send('withdrawal:api', message)
    withdrawalApi(message)
  })

  let closeButton = document.getElementById("owner-withdrawal-close-button")
  closeButton.addEventListener('click', () => {
    console.log("close button")

    importArea.classList.remove('hidden')
    ownerWithdrawalBroadcast.classList.add('hidden')
    importText.value = ""
    withdrawalTxId.innerHTML = ""

    showImportListScreen()
  })
}

/* broadcast transaction */
async function withdrawalApi(message) {
  const txid = message.transaction_id
	const accountId = message.id
	const withdrawalId = message.withdrawal_id

	if (message.currency === "woodcoin") {
		try {
	    const response = await axios(`https://api.logbin.org/api/broadcast/r?transaction=${txid}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
      });
      const body = response.data
      if (body.message) {
        const dataJson = await Filesystem.readFile({
            path: 'data/data.json',
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });
        const accounts = dataJson.data
        for (const [key, value] of Object.entries(accounts)) {
            let account = value
            console.log("account.id vs accountId: ", account.id, accountId)
            if (account.id == accountId) {
              console.log("inside account: ")
              for (const [index, withdrawal] of account.withdrawals.entries()){
                console.log("withdrawal.id vs withdrawalId: ", withdrawal.id, withdrawalId)
                if (withdrawal.id == withdrawalId){
                  console.log("inside withdrawal id")
                  withdrawal.date_broadcasted = Date.now()
                  withdrawal.txid = body.message.result
                  console.log(withdrawal)
                  // const updatedAccounts = JSON.stringify(accounts, null, 2)
                  const writeAccount = await Filesystem.writeFile({
                    path: 'data/data.json',
                    data: accounts,
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8,
                  });
                  if (writeAccount.uri) {
                    console.log("withdrawal broadcasted. record updated")
                  } else {
                    console.log("updating withdrawal after successful broadcasting error: ", err)
                  }
                }
              }
            }
          }
        withdrawalBroadcastResponse(body)
      }
	  } catch(e) {
      console.log(e)
	    withdrawalBroadcastResponse(e.response)
	  }
	} else if (message.currency === "bitcoin" || message.currency === "litecoin") {
		let chain = message.currency === "bitcoin" ? "BTC" : "LTC";
		try {
			
      const response = await axios(`https://chain.so/api/v3/broadcast_transaction/${chain}`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'API-KEY': import.meta.env.VITE_API_KEY
        },
        data: {
          'tx_hex' : txid
        }
      });
      const resp = response.data
      let body

      if (resp.data) {
        body = {
          message: {
            result: resp.data.hash
          }
        }
      } else {
        body = {
          error : {
            error: {
              message: resp.error
            }
          }
        }
      }
      if (body.message) {
        console.log("body.message: ", body.message)
        const dataJson = await Filesystem.readFile({
            path: 'data/data.json',
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });
        const accounts = dataJson.data
        for (const [key, value] of Object.entries(accounts)) {
          let account = value
          console.log("account.id vs accountId: ", account.id, accountId)
          if (account.id == accountId) {
            console.log("inside account: ")
            for (const [index, withdrawal] of account.withdrawals.entries()){
              console.log("withdrawal.id vs withdrawalId: ", withdrawal.id, withdrawalId)
              if (withdrawal.id == withdrawalId){
                console.log("inside withdrawal id")
                withdrawal.date_broadcasted = Date.now()
                withdrawal.txid = body.data.hash
                console.log(withdrawal)
                // const updatedAccounts = JSON.stringify(accounts, null, 2)
                const writeAccount = await Filesystem.writeFile({
                  path: 'data/data.json',
                  data: accounts,
                  directory: Directory.Documents,
                  encoding: Encoding.UTF8,
                });
                if (writeAccount.uri) {
                  console.log("withdrawal broadcasted. record updated")
                } else {
                  console.log("updating withdrawal after successful broadcasting error: ", err)
                }
              }
            }
          }
        }
        withdrawalBroadcastResponse(body)
      }
	  } catch(e) {
	    console.log("error : ", e)
      withdrawalBroadcastResponse(e.response)
	  }
	} else {
		console.log("invalid currency")
		return
	}
}

/* broadcast response */
function withdrawalBroadcastResponse(res) {
  console.log("withdrawal:broadcast-response: ", res)
  let withdrawalSuccessResponseContainer = document.getElementById('owner-withdrawal-response-success-container')
  let withdrawalErrorResponseContainer = document.getElementById('owner-withdrawal-response-error-container')

  let withdrawalTxIdResponse = document.getElementById('owner-withdrawal-txid-response')
  let withdrawalErrorResponse = document.getElementById('owner-withdrawal-error-response')

  let broadcastButton = document.getElementById("owner-withdrawal-broadcast-button")
  let closeButton = document.getElementById("owner-withdrawal-close-button")
  closeButton.addEventListener('click', () => {
    console.log("close button")
    showImportListScreen()
  })

  if(res.message){
    console.log("res message: ", res.message.result)
    withdrawalSuccessResponseContainer.classList.remove('hidden')
    withdrawalTxIdResponse.innerHTML = res.message.result

    closeButton.classList.remove('hidden')
    broadcastButton.classList.add('hidden')

    /**
      Update the account details with the withdrawal transaction
    */

  } else {
    console.log(res.error.error.message)
    withdrawalErrorResponseContainer.classList.remove('hidden')
    withdrawalErrorResponse.innerHTML = res.error.error.message

    closeButton.classList.remove('hidden')
    broadcastButton.classList.add('hidden')
  }
}

/* response banker signature from import text */
async function responseBankerSignture(data) {
  const account = data.account
  const message = data.message

  console.log("message: ", message)
  console.log("message.withdrawal_id: ", message.withdrawal_id)
  // Loop thru the account withdrawal array And
  // get the list of bankers that already signed
  const bankers = account.bankers
  let acctWithdrawal
  let signedBankers = []

  for (const [index, withdrawal] of account.withdrawals.entries()) {
    console.log("withdrawal.id: ", typeof(withdrawal.id))
    if (withdrawal.id === Number(message.withdrawal_id)) {
      console.log("withdrawal: ", withdrawal)
      let sx = withdrawal.signatures
      for (const [index, signature] of sx.entries()) {
        console.log("signature: ", signature)
        if (signature.status === "SIGNED") {
          signedBankers.push(signature)
        }
      }
    }
  }
  console.log("signedBankers: ", typeof(signedBankers))
  console.log("signedBankers: ", signedBankers)
  const bankersArray = bankers.filter((elem) => !signedBankers.find((banker) => elem.banker_id === banker.banker_id));

  let selectNextBankerScreen = document.getElementById('request-sig-next-banker-select')
  selectNextBankerScreen.classList.remove('hidden')
  importArea.classList.add('hidden')

  //
  // Start of Signed Banker's table
  //
  const bankersBody = document.getElementById('signed-bankers-list-body')

  bankersBody.innerHTML = ""
  for(let x in signedBankers) {
      if(signedBankers.hasOwnProperty(x)){
          let signedTx = slicePubkey(signedBankers[x].transaction_id)
          let row = bankersBody.insertRow();
          let name = row.insertCell(0);
          name.innerHTML = signedBankers[x].banker_name
          let dateSigned = row.insertCell(1);
          let ds = signedBankers[x].date_signed
          dateFormat = ds.toDateString()
          dateSigned.innerHTML = dateFormat
          let signature = row.insertCell(2);
          signature.innerHTML = signedTx
      }
  }
  //
  // End of Banker's table
  //


  let selectBankers = document.getElementById("next-banker-to-sign-container")
  var select =  document.getElementById("select-next-bankers-to-sign");
  select.innerHTML = ''
  select.dataset.placeholder = 'Choose Bankers'

  const el = document.createElement("option");
  el.textContent = "Select a banker";
  el.value = "";
  select.appendChild(el);
  bankersArray.forEach((banker, i) => {
    const opt = banker.banker_email;
    const pub = banker.pubkey;
    const el = document.createElement("option");
    el.textContent = opt;
    el.value = JSON.stringify(banker);
    select.appendChild(el);
  });

  let generateBtn = document.getElementById('generate-next-sign-message')
  generateBtn.addEventListener('click', () => {
    const banker = select.options[select.selectedIndex].value;
    console.log("banker: ", banker)

    if (banker) {
      // let parsedBanker = JSON.parse(banker)
      // ipcRenderer.send("owner:save-next-banker", {account, message, parsedBanker})
      const optiondata = {
        account,
        message,
        banker
      }
      ownerSaveNextBanker(optiondata)
    } else {
      alertError("Please select a banker.")
    }
  })
}

/* owner save data next banker */
async function ownerSaveNextBanker(data) {
  let account = data.account
	let message = data.message
	let next_banker = data.banker

	console.log("data: ", data)
  const bankerCheckResult = await readdir('data.json');
	if (bankerCheckResult) {
    const dataJson = await Filesystem.readFile({
      path: 'data/data.json',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
  });
    const accounts = dataJson.data

		for (const [key, value] of Object.entries(accounts)) {
      let acct = value
      if (acct.id == account.id) {
				for (const [index, withdrawal] of acct.withdrawals.entries()){
					if (withdrawal.id == message.withdrawal_id){

					  let newMessage = {
					    "header": "free_state_central_bank",
					    "message":"request-signature",
					    "id": message.id,
					    "contract_name": message.contract_name,
					    "banker_id": next_banker.banker_id,
					    "creator_name": message.creator_name,
					    "creator_email": message.creator_email,
					    "banker_name": next_banker.banker_name,
					    "banker_email": next_banker.banker_email,
					    "transaction_id_for_signature": message.transaction_id,
					    "currency": message.currency,
							"withdrawal_id": message.withdrawal_id,
					  }
					  console.log("new message: ", newMessage)

					  // Create new signature object in the account signature array
					  const newSignatory = {
					    "banker_id": next_banker.banker_id,
							"banker_name": next_banker.banker_name,
					    "date_requested": Date.now(),
					    "date_signed": null,
					    "status": "PENDING",
					    "transaction_id": "",
							"action": "Request for signature"
					  }
					  withdrawal.signatures.push(newSignatory)

					  // const accountsNewSignatory = JSON.stringify(accounts, null, 2)
					  // fs.writeFile(homedir + "/data/data.json"
					  //   , accountsNewSignatory, function writeJson(err) {
					  //   if (err)  {
					  //     console.log("updating signatures for next banker to sign error: ", err)
					  //   } else {
					  //     console.log("signature updated for next banker to sign: ")
					  //     win.webContents.send('owner:show-banker-signature-message', newMessage)
					  //   }
					  // })
            const writeAccount = await Filesystem.writeFile({
                path: 'data/data.json',
                data: accounts,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            if (writeAccount.uri) {
              ownerShowBankerSignatureMessage(newMessage)
            }

					}
				}
			}
		}
	}
}

/* show user message signature to be send on banker */
async function ownerShowBankerSignatureMessage(message) {
  alertSuccess("Banker signature successfully updated.")

  ownerMessageSignRequest.classList.remove('hidden')
  let selectNextBankerScreen = document.getElementById('request-sig-next-banker-select')
  selectNextBankerScreen.classList.add('hidden')

  let ownerMessageSignRequestBody = document.getElementById('owner-message-sign-request-body')
  let signResponseTitle = document.getElementById('sign-request-title')
  let buttonDiv = document.getElementById('owner-message-sign-request-close-button')
  const div = document.createElement('div')
  div.setAttribute('class', 'bg-white p-3 rounded-md text-black')

  const p1 = document.createElement('p')
  const p2 = document.createElement('p')
  const p3 = document.createElement('p')
  const p4 = document.createElement('pre')
  const p5 = document.createElement('p')

  ownerMessageSignRequestBody.innerHTML = ''

  signResponseTitle.innerHTML = "Please copy the line below and send it to " + message.banker_email;
  p1.innerHTML = USER.user_name + " is requesting for a withdrawal transaction from " + message.contract_name;
  p2.innerHTML = "Please copy the message inside and import in FSCB";
  p3.innerHTML = "-----Begin fscb message-----";
  p4.innerHTML = JSON.stringify(message, undefined, 2);
  p5.innerHTML = "-----End fscb message-----";

  const copyToClipboardText = p1.innerHTML + '\n' + p2.innerHTML + '\n' + p3.innerHTML + '\n' + p4.innerHTML  + '\n' +  p5.innerHTML
  let copyButtonContainer = document.createElement('div')
  copyButtonContainer.setAttribute('class', 'flex justify-end')
  let copyButton = document.createElement('img')
  copyButton.setAttribute('src', './assets/imgs/copy_button.png')
  copyButton.setAttribute('width', '50')
  copyButton.setAttribute('height', '50')
  copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
  copyButton.addEventListener("click", async function() {
    await Clipboard.write({
      string: copyToClipboardText
    });
    alertSuccess("Message successfully copied in clipboard.")
  }, false);

  copyButtonContainer.appendChild(copyButton)
  div.appendChild(copyButtonContainer)

  p1.classList.add('my-1')
  p4.classList.add('whitespace-pre-wrap', 'break-all')
  div.appendChild(p1)
  div.appendChild(p2)
  div.appendChild(p3)
  div.appendChild(p4)
  div.appendChild(p5)

  ownerMessageSignRequestBody.appendChild(div)


  let closeButton = document.createElement('button')
  closeButton.classList.add("inline-flex", "items-center", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "absolute", "right-5", "mt-5", "text-white", "bg-orange-500", "rounded-lg", "focus:ring-4", "focus:ring-blue-200", "dark:focus:ring-orange-500", "hover:bg-orange-500")
  closeButton.innerHTML = "Close"
  closeButton.addEventListener("click", function() {
    // bankerForm.classList.remove('hidden')
    // bankersList.classList.remove('hidden')
    // bankerMessage.classList.add('hidden')
    importArea.classList.remove('hidden')
    ownerMessageSignRequest.classList.add('hidden')
    importText.value = ""

    showImportListScreen()
    console.log("close sign request message")
  }, false);

  buttonDiv.appendChild(closeButton)
}

/* request banker signature */
async function bankerSignatureRequest (message) {
  importArea.classList.add('hidden')
  bankerVerifyWithdrawal.classList.remove('hidden')

  let inputsTable = document.getElementById('banker-verify-inputs')
  let outputsTable = document.getElementById('banker-verify-outputs')

  let coin_js
  if (message.currency === "woodcoin") {
    coin_js = coinjs
  } else if (message.currency === "bitcoin") {
    coin_js = bitcoinjs
  } else if (message.currency === "litecoin") {
    coin_js = litecoinjs
  } else {
    console.log("invalid currency")
  }
  const tx = coin_js.transaction()
  const deserializeTx = tx.deserialize(message.transaction_id_for_signature)
  console.log("deserialize tx: ", deserializeTx)

  let inputs = deserializeTx.ins
  let outputs = deserializeTx.outs

  for (let i = 0; i < inputs.length; i++) {
    var s = deserializeTx.extractScriptKey(i);
    let input = inputs[i]
    console.log("s: ", s.script)
    console.log("N: ", input.outpoint.index)
    console.log(input.outpoint.hash)
    let inputs1 = document.createElement('input')
    inputs1.setAttribute('readonly', true)
    inputs1.setAttribute('class', 'md:flex px-3 bg-gray-300 text-black h-10 left-96 py-2 w-96');
    inputs1.value = input.outpoint.hash
    let row = inputsTable.insertRow();
    let txid = row.insertCell(0);
    // txid.innerHTML = input.outpoint.hash
    txid.appendChild(inputs1)
    txid.setAttribute('width', '45%')
    let inputs2 = document.createElement('input')
    inputs2.setAttribute('readonly', true)
    inputs2.setAttribute('class', 'text-black text-center');
    inputs2.value = input.outpoint.index
    let indexNo = row.insertCell(1);
    indexNo.setAttribute('class', 'text-center bg-white text-black font-semibold')
    indexNo.innerHTML = input.outpoint.index
    // indexNo.appendChild(inputs2)
    indexNo.setAttribute('width', '10%')
    let inputs3 = document.createElement('input')
    inputs3.setAttribute('readonly', true)
    inputs3.setAttribute('class', 'md:flex bg-gray-300 pl-1 h-10 text-black px-3 py-2 w-full');
    inputs3.value = s.script
    let script = row.insertCell(2);
    // script.innerHTML = s.script
    script.appendChild(inputs3)
    script.setAttribute('width', '45%')
  }

  for (let i = 0; i < outputs.length; i++) {

    let output = outputs[i]
      console.log("output: ", output)
    if(output.script.chunks.length==2 && output.script.chunks[0]==106){ // OP_RETURN

      var data = Crypto.util.bytesToHex(output.script.chunks[1]);
      var dataascii = hex2ascii(data);

      if(dataascii.match(/^[\s\d\w]+$/ig)){
        data = dataascii;
      }
      console.log("address: ", data)
      console.log("amount: ", (output.value/100000000).toFixed(8))
      console.log("script: ", Crypto.util.bytesToHex(output.script.buffer))
      let row = outputsTable.insertRow();
      let address = row.insertCell(0);
      address.innerHTML = data
      address.setAttribute('width', '45%')
      let amount = row.insertCell(1);
      amount.innerHTML = (output.value/100000000).toFixed(8)
      amount.setAttribute('width', '10%')
      let script = row.insertCell(2);
      script.innerHTML = Crypto.util.bytesToHex(output.script.buffer)
      script.setAttribute('width', '45%')
    } else {

      var addr = '';
      if(output.script.chunks.length==5){
        addr = coin_js.scripthash2address(Crypto.util.bytesToHex(output.script.chunks[2]));
      } else if((output.script.chunks.length==2) && output.script.chunks[0]==0){
        addr = coin_js.bech32_encode(coin_js.bech32.hrp, [coin_js.bech32.version].concat(coin_js.bech32_convert(output.script.chunks[1], 8, 5, true)));
      } else {
        var pub = coin_js.pub;
        coin_js.pub = coin_js.multisig;
        addr = coin_js.scripthash2address(Crypto.util.bytesToHex(output.script.chunks[1]));
        coinjs.pub = pub;
      }

      console.log("address: ", addr)
      console.log("amount: ", (output.value/100000000).toFixed(8))
      console.log("script: ", Crypto.util.bytesToHex(output.script.buffer))
      let row = outputsTable.insertRow();
      let address = row.insertCell(0);
      address.setAttribute('width', '45%')
      address.innerHTML = addr
      let amount = row.insertCell(1);
      amount.innerHTML = (output.value/100000000).toFixed(8)
      amount.setAttribute('width', '10%')
      let script = row.insertCell(2);
      script.innerHTML = Crypto.util.bytesToHex(output.script.buffer)
      script.setAttribute('width', '45%')
    }
  }

  let signButton = document.getElementById("banker-sign-button")
  signButton.addEventListener('click', () => {

    let pk = document.getElementById('banker-pivkey-for-signature')
    let privkey = pk.value
    // console.log("pk: ", privkey)
    // console.log("is valid: ", isKeyValid(privkey))
    if (privkey) {
        if (isWifKeyValid(privkey)) {
        bankerSignTransaction(message, privkey)
        } else {
          alertError('The text you entered is not a valid private key.')
        }
    } else {
      alertError('Please enter your private key for this account.')
    }

  })
}

function bankerSignTransaction(message, privkey) {
  console.log("sign tx: ", message.transaction_id_for_signature)
  console.log("user privkey: ", privkey)


  let tx
  if (message.currency === "woodcoin") {
    tx = coinjs.transaction()
  } else if (message.currency === "bitcoin") {
    tx = bitcoinjs.transaction()
  }  else if (message.currency === "litecoin") {
    tx = litecoinjs.transaction()
  }

  const scriptToSign = tx.deserialize(message.transaction_id_for_signature)
  const signedTX = scriptToSign.sign(privkey, 1)

  console.log("signed: ", signedTX)

  bankerVerifyWithdrawal.classList.add('hidden')
  bankerMessageSignTx.classList.remove('hidden')

  let bankerMessageSignTxBody = document.getElementById('banker-message-signtx-body')
  let signResponseTitle = document.getElementById('sign-response-title')
  let buttonDiv = document.getElementById('banker-message-signtx-close-button')
  const div = document.createElement('div')
  div.setAttribute('class', 'bg-white p-3 rounded-md text-black')

  const p1 = document.createElement('p')
  const p2 = document.createElement('p')
  const p3 = document.createElement('p')
  const p4 = document.createElement('pre')
  const p5 = document.createElement('p')

  delete message.transaction_id_for_signature
  message.message = "response-signature-" + message.banker_id
  message.transaction_id = signedTX

  bankerMessageSignTxBody.innerHTML = ''

  signResponseTitle.innerHTML = "Please copy the line below and send it to " + message.creator_email;
  p1.innerHTML = USER.user_name + " response for your withdrawal signature request for " + message.contract_name;
  p2.innerHTML = "Please copy the message inside and import in FSCB";
  p3.innerHTML = "-----Begin fscb message-----";
  p4.innerHTML = JSON.stringify(message, undefined, 2);
  p5.innerHTML = "-----End fscb message-----";

  const copyToClipboardText = p1.innerHTML + '\n' + p2.innerHTML + '\n' + p3.innerHTML + '\n' + p4.innerHTML  + '\n' +  p5.innerHTML

  let copyButtonContainer = document.createElement('div')
  copyButtonContainer.setAttribute('class', 'flex justify-end')
  let copyButton = document.createElement('img')
  copyButton.setAttribute('src', './assets/imgs/copy_button.png')
  copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
  copyButton.addEventListener("click", async function() {
    await Clipboard.write({
      string: copyToClipboardText
    });
    alertSuccess("Message successfully copied in clipboard.")
  }, false);

  copyButtonContainer.appendChild(copyButton)
  div.appendChild(copyButtonContainer)

  p1.classList.add('my-1')
  p4.classList.add('whitespace-pre-wrap', 'break-all')
  div.appendChild(p1)
  div.appendChild(p2)
  div.appendChild(p3)
  div.appendChild(p4)
  div.appendChild(p5)

  bankerMessageSignTxBody.appendChild(div)


  let closeButton = document.createElement('button')
  closeButton.classList.add("items-center", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "mt-5", "text-white", "bg-orange-500", "rounded-lg", "focus:ring-4", "focus:ring-blue-200", "dark:focus:ring-orange-500", "hover:bg-orange-500")
  closeButton.innerHTML = "Close"
  closeButton.addEventListener("click", function() {
    console.log("close sign response message")

    importArea.classList.remove('hidden')
    bankerMessageSignTx.classList.add('hidden')
    importText.value = ""
    bankerMessageSignTxBody.innerHTML = ""

    // Clear verify withdrawal inputs
    let inputsTable = document.getElementById('banker-verify-inputs')
    let outputsTable = document.getElementById('banker-verify-outputs')
    let userPrivKey = document.getElementById('banker-pivkey-for-signature')

    inputsTable.innerHTML = ""
    outputsTable.innerHTML = ""
    userPrivKey.value = ""

    showImportListScreen()
  }, false);

  buttonDiv.appendChild(closeButton)
};

/* request banker pubkey */
async function bankerPukey(message) {
    importArea.classList.add('hidden')
    bankerGeneratePrivkey.classList.remove('hidden')
    let coin_js
    if (message.currency === "woodcoin") {
      coin_js = coinjs
    } else if (message.currency === "bitcoin") {
      coin_js = bitcoinjs
    } else if (message.currency === "litecoin") {
      coin_js = litecoinjs
    } else {
      return
    }
    coin_js.compressed = true
    const userAddress = await coin_js.newKeys()
    console.log(userAddress)

    let privkeyHexInput = document.getElementById('pivkey-hex')
    let privkeyWifInput = document.getElementById('pivkey-wif')
    let pubkeyInput = document.getElementById('pubkey-compressed')
    let accountOwner = document.getElementById('account-owner-name')
    let accountOwner2 = document.getElementById('account-owner-name2')

    privkeyHexInput.value = userAddress.privkey
    privkeyWifInput.value = userAddress.wif
    pubkeyInput.value = userAddress.pubkey
    accountOwner.innerHTML = message.creator_name
    accountOwner2.innerHTML = message.creator_name

    let generatePrivkey = document.getElementById('banker-generate-privkey')
    let finalizeKeys = document.getElementById('banker-finalize-keys')

    generatePrivkey.addEventListener('click', async() => {
      let updatedHex = privkeyHexInput.value
      let isValid = isKeyValid(updatedHex)
      if (!isValid) {
        alertError("The text you entered is not a valid private key")
        return
      }

      coin_js.compressed = true
      const newKeys = await coin_js.newKeysFromHex(updatedHex)

      privkeyHexInput.value = newKeys.privkey
      privkeyWifInput.value = newKeys.wif
      pubkeyInput.value = newKeys.pubkey

      return

    })

    finalizeKeys.addEventListener('click', () => {

      let pubkey = pubkeyInput.value
      message.message = "response-pubkey"
      message.pubkey = pubkey

      bankerGeneratePrivkey.classList.add('hidden')
      finalizeNewKeys(message)
    })

    return
}

function finalizeNewKeys(evt){
    // const accountUser = JSON.parse(evt)
    console.log(evt)
    const textBody = document.getElementById('text-show')
    const textId = document.getElementById('import-show')
    const textImport = document.getElementById('import-area')
    const textImportArea = document.getElementById('import-text')
    const div = document.createElement('div')
    div.setAttribute('class', 'bg-white p-3 rounded-md')

    const btnContainer = document.createElement('div')
    btnContainer.setAttribute('class', 'flex justify-end')
    const button = document.createElement('button')
    button.setAttribute('class', 'items-center px-10 py-3 text-sm font-medium text-center text-white bg-orange-500 focus:ring-4 focus:ring-orange-500 dark:focus:bg-orange-500 hover:bg-orange mt-5 rounded-full')
    button.setAttribute('id', "import-again-button")
    button.textContent = "Clear"
    btnContainer.appendChild(button)

    const p = document.createElement('p')
    const br = document.createElement('br')
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    const p3 = document.createElement('p')
    const p4 = document.createElement('pre')
    const p5 = document.createElement('p')
    textId.classList.remove('hidden')
    textImport.classList.add('hidden')
    textImportArea.value = ''
    p.innerHTML = "Please copy the line below and send it to " + evt.creator_name;
    p1.innerHTML = evt.banker_name + " public key response to " + evt.creator_name + " request";
    p2.innerHTML = "Please copy the message inside and import in FSCB";
    p3.innerHTML = "-----Begin fscb message-----";
    p4.innerHTML = JSON.stringify(evt, undefined, 2);
    p5.innerHTML = "-----End fscb message-----";
    // p4.setAttribute("class", "w-10")
    p4.classList.add('whitespace-pre-wrap', 'break-all')

    const copyToClipboardText = p1.innerHTML + '\n' + p2.innerHTML + '\n' + p3.innerHTML + '\n' + p4.innerHTML  + '\n' +  p5.innerHTML
    let copyButtonContainer = document.createElement('div')
    copyButtonContainer.setAttribute('class', 'flex justify-end')
    let copyButton = document.createElement('img')
    copyButton.setAttribute('src', './assets/imgs/copy_button.png')
    copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
    copyButton.addEventListener("click", async function() {
      await Clipboard.write({
        string: copyToClipboardText
      });
      alertSuccess("Message successfully copied in clipboard.")
    }, false);

    copyButtonContainer.appendChild(copyButton)
    div.appendChild(copyButtonContainer)
    div.appendChild(p)
    div.appendChild(br)
    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    div.appendChild(p4)
    div.appendChild(p5)
    textBody.appendChild(div)
    textBody.appendChild(btnContainer)
    const importAgain = document.getElementById('import-again-button')
    importAgain.addEventListener('click', importAgainShow)
};

function importAgainShow(div, button) {
  const textId = document.getElementById('import-show')
  const textImport = document.getElementById('import-area')
  const textBody = document.getElementById('text-show')
  textId.classList.add('hidden')
  textImport.classList.remove('hidden')
  textBody.innerHTML = ''

}

function isKeyValid(hex) {
    var key = hex.toString();
    var isValidFormat = /^[0-9a-fA-F]{64}$/.test(key)
    return isValidFormat
  }

  function isWifKeyValid(hex) {
    var key = hex.toString();
    var isValidFormat = /^[0-9a-zA-Z]{52}$/.test(key)
    return isValidFormat
  }

/* response banker pubkey */

async function bankerPubkeyResponse(evt) {
    console.log(evt)
    const bankerCheckResult = await readdir('bankers.json');
    if (bankerCheckResult) {
      const allbankers = await Filesystem.readFile({
        path: 'data/bankers.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      console.log("got all bankers ", allbankers)

      for (const i in allbankers.data) {
        console.log("i: ", i)
        if (allbankers.data[i].banker_id == evt.banker_id) {
          allbankers.data[i].pubkey = evt.pubkey
        //   const wData = JSON.stringify(allbankers, null, 2)
        //   console.log(allbankers)
        //   fs.writeFile(homedir + "/data/banker.json", wData, (err) => {
        //     if (err) {
        //       console.log(err)
        //     } else {
        //       console.log("successful")
        //       // send
        //       win.webContents.send('addBanker:pubkey', {})
        //     }
        //   })
            await Filesystem.writeFile({
                path: 'data/bankers.json',
                data: allbankers.data,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            importText.value = ''
            alertSuccess("Successfully added banker's publick key.")
        }
      }
    }else {
      console.log("err in adding banker pubkey")
    }
  }

/* Create contract */
async function saveAndCreateText(e) {
    e.preventDefault();
    // console.log(contractName.value, " ", creatorName.value, " ", creatorEmail.value)
    const contractSendName = contractName.value;
    const creatorSendName = USER.user_name;
    const creatorSendEmail = USER.user_email;

    coinjs.compressed = true
    const creatorAddressDetail = await coinjs.newKeys()
    // console.log("New Key ", creatorAddressDetail)
    const sigSendNumber = sigNumber.options[sigNumber.selectedIndex].text;
    const coinCurrencySend = currency.options[currency.selectedIndex].text;
    const innerMultiKey = document.querySelectorAll('.activeClass a')
    console.log(innerMultiKey)

    /**
      New account data validation
    **/
    if (contractSendName == "") return alertError("Contract name is required.")
    if (innerMultiKey.length == 0) return alertError("Please select a banker")

    let bankersMerge = [];
    for (let i = 0; i < innerMultiKey.length; i++) {
        bankersMerge.push(innerMultiKey[i].dataset.value)
    }
    console.log("banker merge ", bankersMerge)

    let coin_js

    if (coinCurrencySend === "woodcoin") {
      coin_js = coinjs
    } else if (coinCurrencySend === "bitcoin") {
      coin_js = bitcoinjs
    } else if (coinCurrencySend === "litecoin") {
      coin_js = litecoinjs
    } else {
      console.log("invalid currency")
    }

    const keys = bankersMerge;
    const multisig =  coinjs.pubkeys2MultisigAddress(keys, sigSendNumber);
    console.log("multisig ", multisig)
    const pubkeySend = multisig.address;
    const redeemScriptSend = multisig.redeemScript;

    let data = {
        contractSendName,
        creatorSendName,
        creatorSendEmail,
        bankersMerge,
        sigSendNumber,
        coinCurrencySend,
        creatorAddressDetail,
        pubkeySend,
        redeemScriptSend
    }
    contractnew(data)
}

async function contractnew (options) {
    // e.preventDefault()
    console.log("rederer send", options)
    const contractCheckResult = await readdir('data.json');
    const getIdNumber = await idNumber()
    // pathMessage = 'message'
    // console.log(options.bankersMerge)
    const mybankers = await Filesystem.readFile({
        path: 'data/bankers.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    // const bankersParse = JSON.parse(mybankers)
    // console.log(typeof(bankersParse))
    let mergeBankers = []
    for (let i = 0; i < options.bankersMerge.length; i++ ) {
      for (let j in mybankers.data) {
        if (options.bankersMerge[i] === mybankers.data[j].pubkey) {
          mergeBankers.push(mybankers.data[j])
        }
      }
    }

    let data = {
        "id": Math.floor(1000000000 + Math.random() * 9000000000),
        "contract_id": getIdNumber,
        // "txt_file_reference": contractTextReference,
        "contract_name": options.contractSendName,
        "creator_name": options.creatorSendName,
        "creator_email": options.creatorSendEmail,
        "bankers": mergeBankers,
        "signature_nedded": options.sigSendNumber,
        "address": options.pubkeySend,
        "redeem_script": options.redeemScriptSend,
        //"signatures": [],
        "withdrawals": [],
        "balance": "0.0",
        "currency": options.coinCurrencySend,
        "claimed": "false"
    }
    try {
        if (contractCheckResult) {
            console.log("if write contract has been called")
            const contents = await Filesystem.readFile({
                path: 'data/data.json',
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
              });
            const contentnew = contents.data
            contentnew["contract" + getIdNumber] = data
            console.log("contents ", contentnew)
            await Filesystem.writeFile({
                path: 'data/data.json',
                data: contentnew,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            alertSuccess("Account successfully created.")
            updateAccountListScreen(contentnew)
            showImportListScreen()
        } else {
            console.log("add contract else has been called")
            const addContract = {
                ["contract" + getIdNumber]: data
              }
            await Filesystem.writeFile({
                path: 'data/data.json',
                data: addContract,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            alertSuccess("Account successfully created.")
            updateAccountListScreen(addContract)
            showImportListScreen()
        }
    } catch (e) {
        console.log(e)
    }
  }

  function showImportListScreen() {
    importTextTab.classList.add('hidden')
    firstTab.classList.remove('hidden')
    secondTab.classList.add('hidden')
    addBankerTab.classList.add('hidden')
    thirdTab.classList.add('hidden')
    fourthTab.classList.add('hidden')
    fifthTab.classList.add('hidden')

    let tabContents = document.querySelector("#tab-contents");
    for (let i = 0; i < tabContents.children.length-1; i++) {
      tabTogglers[i].parentElement.classList.remove("bg-gradient-to-l", "from-gray-500");
    }
    let accountListTab = document.getElementById('account-list-tab')
    accountListTab.classList.add("bg-gradient-to-l", "from-gray-500");
  }

  function updateAccountListScreen(accounts) {
    const accountBody = document.getElementById('accounts-list-body')
    let coinInitial;

    accountBody.innerHTML = ""
    for(let x in accounts) {
        if(accounts.hasOwnProperty(x)){
            if (accounts[x].currency === 'woodcoin') {
              coinInitial = 'LOG'
            } else if (accounts[x].currency === 'bitcoin') {
              coinInitial = 'BTC'
            } else {
              coinInitial = 'LTC'
            }
            let row = accountBody.insertRow();
            let name = row.insertCell(0);
            name.setAttribute('class', 'pl-6')
            name.innerHTML = accounts[x].contract_name
            let address = row.insertCell(1);
            address.innerHTML = coinInitial + ':' + accounts[x].address
            let balance = row.insertCell(2);
            balance.setAttribute('class', 'pl-4')
            balance.innerHTML = accounts[x].balance
            let veiwall = row.insertCell(3)
            veiwall.setAttribute('class', 'text-center')
            let viewAccountDetailsButton = document.createElement('button')
            viewAccountDetailsButton.setAttribute('class', "px-5 py-0.5 font-small text-white bg-orange-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-orange-500 hover:bg-orange-500 rounded-full")
            viewAccountDetailsButton.innerHTML = "view"
            veiwall.appendChild(viewAccountDetailsButton)

            let details = accounts[x]
            viewAccountDetailsButton.addEventListener("click", function() {getAccountDetails(details);}, false);

        }
    }

  }

  function addDonationAddress() {
    const addressInput = document.getElementById('withdraw-address')
    if (addressInput.value) {
      addOrDelete('donation-address')
    } else {
      addressInput.value = DONATION_ADDRESS
    }
  }

  function addOrDelete(id) {
      console.log("click add or delete")
      const mainKey = document.getElementById('address-amount')

      let div = document.createElement('div');
      div.setAttribute("class", "grid md:grid-cols-4 gap-2");
      div.setAttribute('id', 'address-keys')

      let input1 = document.createElement('input')
      input1.setAttribute('class', 'text-base text-black font-normal h-10 col-span-2 mt-2')
      input1.setAttribute('placeholder', 'Enter Address')
      let input2 = document.createElement('input')
      // input2.addEventListener('onchange', ()=> {console.log("amount: ", input2.value)})
      input2.setAttribute('class', 'text-base text-black font-normal h-10 col-span-1 mt-2 user-input-amount')
      input2.setAttribute('placeholder', 'Enter Amount')

      /**
        Add event listener to the amount input
      **/
      input2.addEventListener('input', () => {amountOnInput(input2.value)})
      input2.addEventListener('change', () => {amountOnchange(input2.value)})

      if (id == "donation-address") {
          input1.value = DONATION_ADDRESS
      }

      let anchor = document.createElement('a')
      anchor.setAttribute('class', 'red pubkeyRemove cursor-pointer')
      //let minus = document.createElement('object')
      let minus = document.createElement('img')
      minus.setAttribute('src', './assets/imgs/minus.svg')
      minus.setAttribute('width', '50')
      minus.setAttribute('height', '50')
      minus.setAttribute('class', 'red pubkeyRemove')



      div.appendChild(input1)
      div.appendChild(input2)
      div.appendChild(minus)
      mainKey.appendChild(div)

      minus.addEventListener('click', (e) => {
        console.log('minus click')
        deleteInput(e)
        if (input2.value) amountOnchangeSubtract(input2.value)
      })
  }

  function deleteInput(e) {
      const removeEl = e.target.parentNode;
      const remove = e.target.classList.contains('pubkeyRemove')
      if (!remove) return;

      document.getElementById('address-amount').removeChild(removeEl);
  }

  function amountOnInput(amount) {
    if (!isNaN(amount)) {
      const getuserinput = document.querySelectorAll('#address-keys')
      let totalOutput = 0

      for (let i = 0; i < getuserinput.length; i++) {
        let amount = getuserinput[i].children[1].value
        totalOutput += Number(amount)
      }
      TOTAL_AMOUNT_TO_WITHDRAW = totalOutput
      withdrawalFee.value = (unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW).toFixed(8)
    }
  }

  function amountOnchange(amount) {
    const getuserinput = document.querySelectorAll('#address-keys')
    let totalOutput = 0

    for (let i = 0; i < getuserinput.length; i++) {
      let amount = getuserinput[i].children[1].value
      totalOutput += Number(amount)
    }

    //TOTAL_AMOUNT_TO_WITHDRAW += Number(amount)
    TOTAL_AMOUNT_TO_WITHDRAW = totalOutput
    withdrawalFee.value = (unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW).toFixed(8)
  }

  function amountOnchangeSubtract(amount) {

    TOTAL_AMOUNT_TO_WITHDRAW -= Number(amount)
    withdrawalFee.value = (unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW).toFixed(8)
    console.log("amount to subtract: ", amount)
    console.log("withdrawal fee: ", unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW)
  }

  let withdrawAmountInput = document.getElementById('withdraw-amount')
  withdrawAmountInput.addEventListener('input', () => {amountOnInput(withdrawAmountInput.value)})
  withdrawAmountInput.addEventListener('change', () => {amountOnchange(withdrawAmountInput.value)})

  function checkTxFee(e) {
    e.preventDefault()
    let withdrawFeeInput = document.getElementById("withdraw-fee")
    let userInputtedFee = withdrawFeeInput.value

    let change = (unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW).toFixed(8)
    console.log("change: ", change)

    if (unspentAmountTotal < TOTAL_AMOUNT_TO_WITHDRAW) {
      alertError("Insufficient balance. Please adjust the withdrawal amount.")
      return
    }

    if (userInputtedFee == change) {
      if (change > 0.001) {
        let text = "Current transaction fee is high. If you want to proceed, click Ok";
        if (confirm(text) == true) {
          generateClaim(0)
        } else {
          console.log("The confirmation modal is cancelled.")
        }
      } else {
        generateClaim(0)
      }
    } else if (userInputtedFee > change) {
      alertError("Transaction fee is greater than remaining amount. Please adjust.")
    } else if (userInputtedFee < change) {
      console.log("should generate change address")
      let amountToChangeAddress = unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW - userInputtedFee
      generateClaim(amountToChangeAddress)
    }

  }

  async function generateClaim(changeAmount) {
    console.log("generate claim")
    console.log("account currency: ", ACCOUNT_CURRENCY)
    //e.preventDefault()
    // const txid = document.getElementById('txid-withdraw').value
    // const vout = document.getElementById('vout-withdraw').value
    // const script = document.getElementById('script-withdraw').value
    // const amount = document.getElementById('amount-withdraw').value
    // const address = document.getElementById('withdraw-address').value
    // const amountWithdraw = document.getElementById('withdraw-amount').value
    // console.log("txid ", txid)
    // console.log('address ', address)
    // let tx = coinjs.transaction();
    // let scriptN = coinjs.script()
    // tx.addinput(txid, vout, script, amount, null)
    // tx.addoutput(address, amountWithdraw)
    // const out = await tx.serialize()
    // console.log("tx serialize", out)
    // console.log("decode tx serialize", tx.deserialize(out))
    let coin_js
    if (ACCOUNT_CURRENCY === "woodcoin") {
      coin_js = coinjs
    } else if (ACCOUNT_CURRENCY === "bitcoin") {
      coin_js = bitcoinjs
    } else if (ACCOUNT_CURRENCY === "litecoin") {
      coin_js = litecoinjs
    } else {
      console.log("invalid currency")
      return
    }

    let tx = coin_js.transaction()
    const getunspent = document.querySelectorAll('#inner-unspent')
    const getuserinput = document.querySelectorAll('#address-keys')
    //const changeAddressinput = document.getElementById('change-address')
    let userunspentindex;
    let userinputindex;
    let unspentindexsum = 0;
    let userinputsum = 0 ;
    let txRedeemTransaction;
    let accountSigFilter;
    let inputsTable = document.getElementById('banker-verify-inputs-initial')
    let outputsTable = document.getElementById('banker-verify-outputs-initial')
    console.log("get unspent", getunspent)
    for(let i = 0; i < getunspent.length; i++) {
      if(getunspent[i].children[5].defaultChecked) {
        userunspentindex = i
        console.log(getunspent[i].children[3].value)
        unspentindexsum += Number(getunspent[i].children[3].value)
        tx.addinput(getunspent[i].children[0].value, getunspent[i].children[1].value, getunspent[i].children[2].value, null)
      }
      // if(i === getunspent.length -1) {
      //   tx.addoutput(address, amountWithdraw)
      //   const out = await tx.serialize()
      //   console.log(out)
      // }
    }
    console.log(getuserinput)
    for (let i = 0; i < getuserinput.length; i++) {
      let address = getuserinput[i].children[0].value
      let amount = getuserinput[i].children[1].value

      userinputindex = i
      userinputsum += Number(amount)
      console.log(address, amount)

      let isValidAddress = coinjs.addressDecode(address)
      if (isValidAddress == false) {
        alertError("Address is not valid")
        return
      } else {
        tx.addoutput(address, amount)
      }
    }

    // if (changeAddressinput) {
    //   console.log("changeAddressinput amount: ", changeAddressinput.children[1].value)
    //   console.log("changeAddressinput address: ", changeAddressinput.children[0].value)
    //   userinputsum += changeAddressinput.children[1].value
    //   tx.addoutput(changeAddressinput.children[0].value, changeAddressinput.children[1].value)
    // }

    /**
      Add a change address to the tx.addoutput if change is greater than withdrawal fee
    **/
    console.log("unspentindexsum: ", unspentindexsum)
    console.log("userinputsum: ", userinputsum)

    /**
      Disabled automatic addition of change address
    **/
    // let change = unspentindexsum - userinputsum
    // console.log("change: ", change)
    // let change_amount = change - WITHDRAWAL_FEE
    // console.log("change_amount: ", change_amount)
    if (changeAmount) {
      console.log('add ouput: ', CHANGE_ADDRESS, changeAmount)
      tx.addoutput(CHANGE_ADDRESS, changeAmount)
    }
    /**End of automatically adding change address**/

    if (userunspentindex === getunspent.length -1 && userinputindex === getuserinput.length -1) {
      let accountDetails = document.getElementById('account-details')
      let accountWithdrawal = document.getElementById('account-withdrawal')
      let accountActions = document.getElementById('account-actions')
      let withdrawalReference = document.getElementById('withdraw-reference')
      accountDetails.classList.add('hidden')
      accountWithdrawal.classList.add('hidden')
      accountActions.classList.add('hidden')
      withdrawalReference.classList.remove('hidden')
      txRedeemTransaction = tx.serialize();
      // console.log("redeem script", getunspent[0].children[4].value)
    //   ipcRenderer.send('getredeemscript:redeemscript', {"script": getunspent[0].children[4].value});
      const sigScript = {
        "script": getunspent[0].children[4].value
      }
      accountSigFilter = await getredeemscriptRedeemscript(sigScript)
      const deserializeTx = tx.deserialize(tx.serialize())
      console.log("deserialize tx: ", deserializeTx)
      console.log("txRedeemTransaction: ", txRedeemTransaction)
      console.log("tx size: ", tx.size())
      let inputs = deserializeTx.ins
      let outputs = deserializeTx.outs

      for (let i = 0; i < inputs.length; i++) {
        var s = deserializeTx.extractScriptKey(i);
        let input = inputs[i]
        console.log("s: ", s.script)
        console.log("N: ", input.outpoint.index)
        console.log(input.outpoint.hash)

        // let row = inputsTable.insertRow();
        // let txid = row.insertCell(0);
        // txid.innerHTML = input.outpoint.hash
        // txid.setAttribute('width', '45%')
        // let indexNo = row.insertCell(1);
        // indexNo.innerHTML = input.outpoint.index
        // indexNo.setAttribute('width', '10%')
        // let script = row.insertCell(2);
        // script.innerHTML = s.script
        // script.setAttribute('width', '45%')
        let inputs1 = document.createElement('input')
        inputs1.setAttribute('readonly', true)
        inputs1.setAttribute('class', 'md:flex px-3 bg-gray-300 text-black h-10 left-96 py-2 w-96');
        inputs1.value = input.outpoint.hash
        let row = inputsTable.insertRow();
        let txid = row.insertCell(0);
        // txid.innerHTML = input.outpoint.hash
        txid.appendChild(inputs1)
        txid.setAttribute('width', '45%')
        let inputs2 = document.createElement('input')
        inputs2.setAttribute('readonly', true)
        inputs2.setAttribute('class', 'text-black text-center');
        inputs2.value = input.outpoint.index
        let indexNo = row.insertCell(1);
        indexNo.setAttribute('class', 'text-center bg-white text-black font-semibold')
        indexNo.innerHTML = input.outpoint.index
        // indexNo.appendChild(inputs2)
        indexNo.setAttribute('width', '10%')
        let inputs3 = document.createElement('input')
        inputs3.setAttribute('readonly', true)
        inputs3.setAttribute('class', 'md:flex bg-gray-300 pl-1 h-10 text-black px-3 py-2 w-full');
        inputs3.value = s.script
        let script = row.insertCell(2);
        // script.innerHTML = s.script
        script.appendChild(inputs3)
        script.setAttribute('width', '45%')
      }

      for (let i = 0; i < outputs.length; i++) {

        let output = outputs[i]
          console.log("output: ", output)
        if(output.script.chunks.length==2 && output.script.chunks[0]==106){ // OP_RETURN

          var data = Crypto.util.bytesToHex(output.script.chunks[1]);
          var dataascii = hex2ascii(data);

          if(dataascii.match(/^[\s\d\w]+$/ig)){
            data = dataascii;
          }
          console.log("address: ", data)
          console.log("amount: ", (output.value/100000000).toFixed(8))
          console.log("script: ", Crypto.util.bytesToHex(output.script.buffer))
          let row = outputsTable.insertRow();
          let address = row.insertCell(0);
          address.innerHTML = data
          address.setAttribute('width', '45%')
          let amount = row.insertCell(1);
          amount.innerHTML = (output.value/100000000).toFixed(8)
          amount.setAttribute('width', '10%')
          let script = row.insertCell(2);
          script.innerHTML = Crypto.util.bytesToHex(output.script.buffer)
          script.setAttribute('width', '45%')
        } else {

          var addr = '';
          if(output.script.chunks.length==5){
            addr = coinjs.scripthash2address(Crypto.util.bytesToHex(output.script.chunks[2]));
          } else if((output.script.chunks.length==2) && output.script.chunks[0]==0){
            addr = coinjs.bech32_encode(coinjs.bech32.hrp, [coinjs.bech32.version].concat(coinjs.bech32_convert(output.script.chunks[1], 8, 5, true)));
          } else {
            var pub = coinjs.pub;
            coinjs.pub = coinjs.multisig;
            addr = coinjs.scripthash2address(Crypto.util.bytesToHex(output.script.chunks[1]));
            coinjs.pub = pub;
          }

          console.log("address: ", addr)
          console.log("amount: ", (output.value/100000000).toFixed(8))
          console.log("script: ", Crypto.util.bytesToHex(output.script.buffer))
          let row = outputsTable.insertRow();
          let address = row.insertCell(0);
          address.setAttribute('width', '45%')
          address.innerHTML = addr
          let amount = row.insertCell(1);
          amount.innerHTML = (output.value/100000000).toFixed(8)
          amount.setAttribute('width', '10%')
          let script = row.insertCell(2);
          script.innerHTML = Crypto.util.bytesToHex(output.script.buffer)
          script.setAttribute('width', '45%')
        }
      }
    //   ipcRenderer.on('account:filterSig', (e, evt) => {
    //     console.log(evt)
    //     accountSigFilter = evt
    //   })

      const generateButton = document.getElementById('generate-request-signature-message')
      generateButton.addEventListener('click', function() {
        selectBankerToSign(txRedeemTransaction, accountSigFilter)
      }, false)
    } else {
      console.log("userunspentindex: ", userunspentindex)
      console.log("getunspent.length -1: ", getunspent.length -1)
      console.log("userinputindex: ", userinputindex)
      console.log("getuserinput.length -1: ", getuserinput.length -1)
    }


    // if (userinputsum > unspentindexsum) {
    //   alertError("You are spending more than you have")
    // }

  }

  function selectBankerToSign(tx, account, withdrawalID=null) {

    let accountDetails = document.getElementById('account-details')
    let accountWithdrawal = document.getElementById('account-withdrawal')
    let accountActions = document.getElementById('account-actions')
    let withdrawalReference = document.getElementById('withdraw-reference')
    let reqBankersSelect = document.getElementById('request-sig-banker-select')
    let messageSignature = document.getElementById('request-sig-message')
    messageSignature.innerHTML = ""
    accountDetails.classList.add('hidden')
    accountWithdrawal.classList.add('hidden')
    accountActions.classList.add('hidden')
    withdrawalReference.classList.add('hidden')
    reqBankersSelect.classList.remove('hidden')
  
    const accountParse = account
  
    let selectBankers = document.getElementById("next-banker-to-sign")
    var select =  document.getElementById("select-bankers-to-sign");
    select.innerHTML = ''
    select.dataset.placeholder = 'Choose Bankers'
  
    let bankersArray = accountParse[0].bankers
  
    const el = document.createElement("option");
    el.textContent = "Select a banker";
    el.value = "";
    select.appendChild(el);
    bankersArray.forEach((banker, i) => {
      const opt = banker.banker_email;
      const pub = banker.pubkey;
      const el = document.createElement("option");
      el.textContent = opt;
      el.value = JSON.stringify(banker);
      select.appendChild(el);
    });
  
    let generateBtn = document.getElementById('generate-sign-message')
    generateBtn.addEventListener('click', () => {
      let selectBanker = document.getElementById('select-bankers-to-sign')
      const banker = select.options[select.selectedIndex].value;
      console.log("banker: ", banker)
  
      if (banker) {
        let parsedBanker = JSON.parse(banker)
        requestSignatureWindow(tx, account, parsedBanker)
      } else {
        alertError("Please select a banker.")
      }
    })
  
  }

  async function getredeemscriptRedeemscript(options) {
    console.log("options script: ", options.script)
    const accounts = await Filesystem.readFile({
        path: 'data/data.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    const accountFilter = Object.values(accounts.data).filter(value => {
      console.log(value);
      return value.redeem_script === options.script;
    });
    console.log("account filter: ", accountFilter)
    return accountFilter
    // win.webContents.send('account:filterSig', JSON.stringify(accountFilter))
  };

function closeSendSignatureScreen() {
  let sendSignature = document.getElementById('send-signature')
  let signatureMessage = document.getElementById('request-sig-message')
  let accountListScreen = document.getElementById('accounts-list')

  accountListScreen.classList.remove('hidden')
  sendSignature.classList.add('hidden')
  signatureMessage.innerHTML = ""

  showImportListScreen()
}


  function requestSignatureWindow(tx, account) {
    // Clear withdraw address and amount input
    let withdrawAddrInput = document.getElementById('withdraw-address')
    let withdrawAmtInput = document.getElementById('withdraw-amount')
    let withdrawFeeInput = document.getElementById('withdraw-fee')

    withdrawAddrInput.value = ""
    withdrawAmtInput.value = ""
    withdrawAmtInput.value = 0

    let withdrawalID = Date.now()
    // let accountDetails = document.getElementById('account-details')
    // let accountWithdrawal = document.getElementById('account-withdrawal')
    // let accountActions = document.getElementById('account-actions')
    // let withdrawalReference = document.getElementById('withdraw-reference')
    let sendSignature = document.getElementById('send-signature')
    let messageSignature = document.getElementById('request-sig-message')
    let selectBankerScreen = document.getElementById('request-sig-banker-select')
    messageSignature.innerHTML = ""
    // accountDetails.classList.add('hidden')
    // accountWithdrawal.classList.add('hidden')
    // accountActions.classList.add('hidden')
    // withdrawalReference.classList.add('hidden')
    selectBankerScreen.classList.add('hidden')
    sendSignature.classList.remove('hidden')
    console.log("tx: ", tx)
    console.log("account: ", typeof(account))
    const accountParse = account
    console.log("account parse: ", accountParse)
    const br = document.createElement('br')

    const p1 = document.createElement('p')
    p1.innerHTML = "Please copy the line below and send it to" + " " + accountParse[0].bankers[0].banker_email
    const p2 = document.createElement('p')
    p2.innerHTML = accountParse[0].creator_name + " is requesting for your banker signature at this " + accountParse[0].contract_name
    const p3 = document.createElement('p')
    p3.innerHTML = "Please copy the message inside and import in FSCB"
    const p4 = document.createElement('p')
    p4.innerHTML = "-----Begin fscb message-----"
    const p5 = document.createElement('p')
    p5.innerHTML = "{" + '"header":"free_state_central_bank",'
    const p6 = document.createElement('p')
    p6.innerHTML = '"message": "request-signature",'
    const p7 = document.createElement('p')
    p7.innerHTML = '"id":' + '"' + accountParse[0].id + '",'
    const p8 = document.createElement('p')
    p8.innerHTML = '"banker_id":' + accountParse[0].bankers[0].banker_id + ','
    const p9 = document.createElement('p')
    p9.innerHTML = '"creator_name":' + '"' + accountParse[0].creator_name + '",'
    const p10 = document.createElement('p')
    p10.innerHTML = '"creator_email":' + '"' + accountParse[0].creator_email + '",'
    const p11 = document.createElement('p')
    p11.innerHTML = '"banker_name":' + '"' + accountParse[0].bankers[0].banker_name + '",'
    const p12 = document.createElement('p')
    p12.innerHTML = '"banker_email":' + '"' + accountParse[0].bankers[0].banker_email + '",'
    const p13 = document.createElement('p')
    p13.innerHTML = '"transaction_id_for_signature":' + '"' + tx + '",'
    const p14 = document.createElement('p')
    p14.innerHTML = '"currency":' + '"' + accountParse[0].currency + '",'
    const p15 = document.createElement('p')
    p15.innerHTML = '"contract_name":' + '"' + accountParse[0].contract_name + '",'
    const p16 = document.createElement('p')
    p16.innerHTML = '"withdrawal_id":' + '"' + withdrawalID + '"}'
    const p17 = document.createElement('p')
    p17.innerHTML = "-----End fscb message-----"

    const copyToClipboardText = p2.innerHTML + '\n' + p3.innerHTML + '\n' + p4.innerHTML  + '\n' +  p5.innerHTML + '\n' + p6.innerHTML + '\n' + p7.innerHTML + '\n' + p8.innerHTML + '\n' + p9.innerHTML + '\n' + p10.innerHTML + '\n' + p11.innerHTML + '\n' + p12.innerHTML + '\n' + p13.innerHTML + '\n' + p14.innerHTML + '\n' + p15.innerHTML
    + '\n' + p16.innerHTML + '\n' + p17.innerHTML
    let copyButtonContainer = document.createElement('div')
    copyButtonContainer.setAttribute('class', 'flex justify-end')
    let copyButton = document.createElement('img')
    copyButton.setAttribute('src', './assets/imgs/copy_button.png')
    copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
    copyButton.addEventListener("click", async function() {
      await Clipboard.write({
        string: copyToClipboardText
      });
      alertSuccess("Message successfully copied in clipboard.")
    }, false);

    copyButtonContainer.appendChild(copyButton)
    messageSignature.appendChild(copyButtonContainer)
    messageSignature.appendChild(p1)
    messageSignature.appendChild(br)
    messageSignature.appendChild(br)
    messageSignature.appendChild(p2)
    messageSignature.appendChild(p3)
    messageSignature.appendChild(p4)
    messageSignature.appendChild(p5)
    messageSignature.appendChild(p6)
    messageSignature.appendChild(p7)
    messageSignature.appendChild(p15)
    messageSignature.appendChild(p8)
    messageSignature.appendChild(p9)
    messageSignature.appendChild(p10)
    messageSignature.appendChild(p11)
    messageSignature.appendChild(p12)
    messageSignature.appendChild(p13)
    messageSignature.appendChild(p14)
    messageSignature.appendChild(p16)
    messageSignature.appendChild(p17)
    const data = {
      "banker_id": accountParse[0].bankers[0].banker_id,
      "banker_name": accountParse[0].bankers[0].banker_name,
      "date_requested": Date.now(),
      "date_signed": null,
      "status": "PENDING",
      "transaction_id": "",
      "action": "Request for signature"
    }
    console.log("action data: ", data)
    const newWithdrawal = {
      id: withdrawalID,
      signatures: [
        data
      ]
    }
    accountParse[0].withdrawals.push(newWithdrawal)
    console.log("account parse withdrawals ", accountParse[0])
    const signEncode = {
      "id": accountParse[0].contract_id, 
      "contract": accountParse[0]
    }
    // ipcRenderer.send('signature:encode', {"id": accountParse[0].contract_id, "contract": accountParse[0]})
    // console.log("new account parse", JSON.stringify(accountParse[0]))
    signatureEncode(signEncode)
  }

async function signatureEncode (data) {
  const contents = await Filesystem.readFile({
    path: 'data/data.json',
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });
  const contentnew = contents.data
  contentnew["contract" + data.id] = data.contract
  // console.log("contents ", contentnew)
  const writeAccount = await Filesystem.writeFile({
      path: 'data/data.json',
      data: contentnew,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
  });
  if (writeAccount.uri) {
    const readmore = await Filesystem.readFile({
        path: 'data/data.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    listfile(readmore)
  }
}

formCreateAccount.addEventListener("submit", saveAndCreateText);
importTextForm.addEventListener('submit', parseTextArea);
userProfileForm.addEventListener('submit', createUserProfile);
withdrawalAddBtn.addEventListener('click', () => {addOrDelete('address-keys')});
// //minusButton.addEventListener('click', deleteInput);
formAddBanker.addEventListener('submit', addBanker);
// getbankerClick.addEventListener('click', getBanker)
// getListClick.addEventListener('click', getList)
importTextButton.addEventListener('click', openImportTextTab)
// getbankerClick.addEventListener('click', getBanker);
// getListClick.addEventListener('click', getList);
formWithdraw.addEventListener('submit', checkTxFee);
donateBtn.addEventListener('click', addDonationAddress);
// exportBtn.addEventListener('click', exportJsonData);
sendSignatureCloseBtn.addEventListener('click', closeSendSignatureScreen)
