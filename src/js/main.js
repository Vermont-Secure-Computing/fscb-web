import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import Toastify from 'toastify-js'


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
let fifthTab = document.getElementById('fifth')

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

/**
  Export screen
**/
let exportBtn = document.getElementById("export-btn")
let browseBtn = document.getElementById("export-browse-btn")
let inputFileBrowser = document.getElementById("select-dir")


// console.log(getListClick)
// const accountList = document.getElementById('accounts-list');

const sigNumber = document.getElementById('releaseCoins');
const currency = document.getElementById('coin-currency')
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

      const contractCheckResult = await readdir('data.json');

      if (contractCheckResult) {
        const accounts = await Filesystem.readFile({
            path: 'data/data.json',
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
          });
        // console.log("accounts: ", accounts)
        // win.webContents.send("list:file", accounts)
        listfile(accounts.data)
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
            getBankerData()
            // getUserData()
        }
        if (tabName === "#second") {
            accountBankerData()
            // getUserData()
        }
        let tabContents = document.querySelector("#tab-contents");

        for (let i = 0; i < tabContents.children.length-1; i++) {
          tabTogglers[i].parentElement.classList.remove("bg-gradient-to-l", "from-gray-500");
          tabContents.children[i].classList.remove("hidden");
          if ("#" + tabContents.children[i].id === tabName) {
              continue;
          }
          tabContents.children[i].classList.add("hidden");

        }
        e.target.parentElement.classList.add("bg-gradient-to-l", "from-gray-500");
    });
});

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
    //console.log(e)
    const convertToJson = evt
    // console.log(convertToJson)
    // let text = ""
    // const container = document.getElementById('data-container')
    // text+='<tr>'
    // for(let x in convertToJson) {
    //     if(convertToJson.hasOwnProperty(x)){
    //         // console.log(convertToJson[x].email)
    //         text+="<td>" + convertToJson[x].email + "</td>"
    //     }
    // }
    // text+="</tr>"
    // // console.log(text)
    // // const stuff = convertToJson.map((item) => `<p>${item.firstname}<p>`)
    // container.innerHTML = text
    const accountBody = document.getElementById('accounts-list-body')
    // let accountTr = document.createElement('tr')
    // accountTr.setAttribute('class', 'border-b dark:border-neutral-500')
    // let accountTd = document.createElement('td')
    // accountTd.setAttribute('class', 'whitespace-nowrap px-6 py-4')
    // let accountTd1 = document.createElement('td')
    // accountTd1.setAttribute('class', 'whitespace-nowrap px-6 py-4')
    // let accountTd2 = document.createElement('td')
    // accountTd2.setAttribute('class', 'whitespace-nowrap px-6 py-4')
    // let respub;
    accountBody.innerHTML = ""
    for(let x in convertToJson) {
        if(convertToJson.hasOwnProperty(x)){
            // console.log("convert to json", convertToJson[x])
            // ipcRenderer.send("get:balance", {"pubkey": convertToJson[x].address})
            let row = accountBody.insertRow();
            let name = row.insertCell(0);
            name.setAttribute('class', 'pl-6')
            name.innerHTML = convertToJson[x].contract_name
            let address = row.insertCell(1);
            address.innerHTML = convertToJson[x].address
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
            // ipcRenderer.on('response:balance', function(e, arg) {
            //     console.log(e)
            //     if (e.error) {
            //         balance.innerHTML = 0
            //     } else {
            //         balance.innerHTML = e
            //     }
            //     // ipcRenderer.removeAllListeners('get:balance');
            //     // ipcRenderer.removeAllListeners('response:balance');
            //     // ipcRenderer.removeAllListeners('list:file');
            // })

            // if(convertToJson.hasOwnProperty(x)){
            //     console.log(convertToJson[x].contract_name)
            //     // text+="<td>" + convertToJson[x].email + "</td>"
            // }
            // ipcRenderer.removeAllListeners('get:balance');
            // ipcRenderer.removeAllListeners('response:balance');
            // ipcRenderer.removeAllListeners('list:file');
        }
    }
    // accountTr.appendChild(accountTd)
    // accountTr.appendChild(accountTd1)
    // accountTr.appendChild(accountTd2)
    // accountBody.appendChild(accountTr)

}


/* add banker function */
async function addBanker(e) {
    e.preventDefault()
    // const mainBankerDiv = document.getElementById('addbanker')
    const nameInput = document.getElementById('banker-name-add')
    const emailInput = document.getElementById('banker-email-add')
    const addBankerSubmit = document.getElementById('banker-submit-button')
    addBankerSubmit.disabled = true
    addBankerSubmit.classList.add('opacity-20')

    // Get value of selected currency
    const selectElement = document.querySelector('#coin-currency');
    const bankerCurrency = selectElement.value;

    const bankerName = nameInput.value
    const bankerEmail = emailInput.value
    console.log("banker name: ", bankerName)
    console.log("banker email: ", bankerEmail)

    /**
      Add banker form validation
    **/
    if (bankerName == "" || bankerEmail == "") {
      console.log("User name and email is required.")
      alertError("User name and email is required.")
      return
    }
    if (bankerEmail) {
      let validEmail = isEmailValid(bankerEmail)
      if (!validEmail) {
        // console.log("Please enter a valid email")
        alertError("Please enter a valid email")
        return
      }
    }
    /**
      Check the banker to be add is already in the bankers,json
    **/
    // if (BANKERS) {
    //   for(let x in BANKERS) {
    //       if(BANKERS.hasOwnProperty(x)){
    //           if (BANKERS[x].banker_name == bankerName && BANKERS[x].banker_email == bankerEmail && BANKERS[x].currency == bankerCurrency) {
    //             alertError("You are trying to add a banker that is already in the list.")
    //             return
    //           }
    //       }
    //   }
    // }

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

    div.appendChild(p)
    div.appendChild(br)
    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    div.appendChild(p4)
    div.appendChild(p5)

    bankerMessage.appendChild(div)


    let closeButton = document.createElement('button')
    closeButton.classList.add("inline-flex", "items-center", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "absolute", "right-5", "mt-5", "text-white", "bg-orange-500", "rounded-lg", "focus:ring-4", "focus:ring-blue-200", "dark:focus:ring-orange-500", "hover:bg-orange-500")
    closeButton.innerHTML = "Close"
    closeButton.addEventListener("click", function() {
      bankerForm.classList.remove('hidden')
      bankersList.classList.remove('hidden')
      bankerMessage.classList.add('hidden')
    }, false);

    console.log("div button: ", buttonDiv)
    buttonDiv.appendChild(closeButton)
    bankerMessage.appendChild(buttonDiv)
}

async function getBankerData() {
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
        //console.log(option)
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

    // newSelect.appendChild(select);
    //select.style.display = "none";
    //1
    //document.querySelectorAll('.selectMultiple ul li').forEach((li) => {
    document.querySelector('.selectMultiple ul').addEventListener('click', (e) => {
        let li = e.target.closest('li');
        if(!li){return;}
        let select = li.closest('.selectMultiple');
        if(!select.classList.contains('clicked')){
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
      win.webContents.send('request:banker-signature', banker)
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

/* request banker pubkey */
async function bankerPukey(message) {
    importArea.classList.add('hidden')
    bankerGeneratePrivkey.classList.remove('hidden')

    coinjs.compressed = true
    const userAddress = await coinjs.newKeys()
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

      coinjs.compressed = true
      const newKeys = await coinjs.newKeysFromHex(updatedHex)

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
    const button = document.createElement('button')
    button.setAttribute('class', 'inline-flex items-center px-10 py-3 text-sm font-medium text-center text-white bg-orange-500 focus:ring-4 focus:ring-orange-500 dark:focus:bg-orange-500 hover:bg-orange absolute mt-5 right-10 rounded-full')
    button.setAttribute('id', "import-again-button")
    button.textContent = "Import Again"
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
    div.appendChild(p)
    div.appendChild(br)
    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    div.appendChild(p4)
    div.appendChild(p5)
    textBody.appendChild(div)
    textBody.appendChild(button)
    const importAgain = document.getElementById('import-again-button')
    importAgain.addEventListener('click', importAgainShow)
};

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
    const keys = bankersMerge;
    const multisig =  coinjs.pubkeys2MultisigAddress(keys, sigSendNumber);
    console.log("multisig ", multisig)
    const pubkeySend = multisig.address;
    const redeemScriptSend = multisig.redeemScript;


    // ipcRenderer.send("message:contractnew", {
    //     contractSendName,
    //     creatorSendName,
    //     creatorSendEmail,
    //     bankersMerge,
    //     sigSendNumber,
    //     coinCurrencySend,
    //     creatorAddressDetail,
    //     pubkeySend,
    //     redeemScriptSend
    // });
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
        "signatures": [],
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

formCreateAccount.addEventListener("submit", saveAndCreateText);
importTextForm.addEventListener('submit', parseTextArea);
// userProfileForm.addEventListener('submit', createUserProfile);
// withdrawalAddBtn.addEventListener('click', () => {addOrDelete('address-keys')});
// //minusButton.addEventListener('click', deleteInput);
formAddBanker.addEventListener('submit', addBanker);
// getbankerClick.addEventListener('click', getBanker)
// getListClick.addEventListener('click', getList)
importTextButton.addEventListener('click', openImportTextTab)
// getbankerClick.addEventListener('click', getBanker);
// getListClick.addEventListener('click', getList);
// formWithdraw.addEventListener('submit', generateClaim);
// donateBtn.addEventListener('click', addDonationAddress);
// exportBtn.addEventListener('click', exportJsonData);