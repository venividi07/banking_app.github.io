// Bankist APP


// Part 1 - Data

/* Create 4 accounts with the next data points : owner; movements; interestRate; pin */

const account1 = {
 owner: 'Radahn Starscourge',
 movements: [370, 133, 633, -233, 286, 1723, -453],
 interestRate: 2.6,
 pin: 1111,
};
const account2 = {
    owner: 'Fortissax Ancient',
    movements: [422, 64, 332, -832, 554, 3122, -999],
    interestRate: 1.9,
    pin: 2222,
};
const account3 = {
    owner: 'Gowery Pest',
    movements: [234, 63, 563, -312, 442, 2567, -787],
    interestRate: 3.1,
    pin: 3333,
};
const account4 = {
    owner: 'Tiche Black',
    movements: [615, -33, 267, -345, 553, 3000, -1232],
    interestRate: 1.3,
    pin: 4444,
};

// Create an array to mimic a data base for the accounts
const accounts = [account1,account2, account3, account4];
console.log(accounts);

//Targeting all the relevant DOM elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer'); 
const btnLoan = document.querySelector('.form__btn--loan'); 
const btnClose = document.querySelector('.form__btn--close'); 
const btnSort = document.querySelector('.btn--sort'); 

const inputLoginUsername = document.querySelector('.login__input--user'); 
const inputLoginPin = document.querySelector('.login__input--pin'); 
const inputTransferTo = document.querySelector('.form__input--to'); 
const inputTransferAmount = document.querySelector('.form__input--amount'); 
const inputLoanAmount = document.querySelector('.form__input--loan-amount'); 
const inputCloseUsername = document.querySelector('.form__input--user'); 
const inputClosePin = document.querySelector('.form__input--pin'); 


// Display current date

let currentDate = new Date();
console.log(currentDate);
const formattedDate = currentDate.toLocaleString('en-US', {
     weekday: 'long',
     month : 'long',
     day: 'numeric',
     year: 'numeric',
     hour: 'numeric',
     minute: 'numeric',
});
console.log(formattedDate);

//Display the current date in the UI

labelDate.textContent= formattedDate;


// Displaying the transactions

const displayMovements = function (transactions) {
    // Emptying out the content of the movements container
    containerMovements.innerHTML = '';

    // Copying the movements array
    const copyOfMovements = transactions.map((a) => a);
    //console.log(copyOfMovements);
    // Formula to sort a - b = mare =>mic b-a = mic =>mare
    const copyOfMovements2 = sort ? copyOfMovements.sort((a, b) => a - b) : transactions
    
    copyOfMovements2.forEach((mov, i) => { // iterating through the new array of transactions
        // determining the transaction type
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        // creating the HTML boilerplate for each transaction
        const movementsHTML = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;

        // inserting the new HTML into the movements container
        containerMovements.insertAdjacentHTML('afterbegin', movementsHTML);
    });
    
};

//displayMovements(account4.movements);

// Calculating and displaying account balance

const calcDisplayBalance = function (acc){
    // Calculate account balance using reduce function 
    const accBalance = acc.movements.reduce((arr, mov) => 
        arr + mov, 0);
//  Creating new property for the acccount objects
    acc.balance = accBalance;
    // Display the account balance in the UI
    labelBalance.textContent = `${accBalance}€`;
};
//calcDisplayBalance(account4);

//Creating the usersnames

const createUserName = function (allAccounts){
    allAccounts.forEach(acc => {
        acc.userName = acc.owner.toLowerCase()
        .split(' ')
        .map(elem => elem[0])
        .join('');
        console.log(acc.userName);
    })
};

createUserName(accounts);
console.log(accounts);

// Calculate and display a summary of the transactions (in/out/interest)
const calcDisplaySummary = function(acc){
    //Calc Value in
    const incoming = acc.movements
    .filter (mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
    console.log(incoming);
    labelSumIn.textContent = `${incoming}`;

    // Calc value out
    const outgoing = acc.movements
    .filter (mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
    console.log(outgoing);
    labelSumOut.textContent = `${Math.abs(outgoing)}`;

    // Calc interest rate
    const interest = incoming * acc.interestRate / 100;
    labelSumInterest.textContent = `${interest.toFixed(2)}`;
}
//calcDisplaySummary(account4);

// Updating the UI

function updatingUI (acc){
    // Displaying all movements in the acc 
    displayMovements(acc.movements);
    //Display Balance
    calcDisplayBalance(acc);
    //Display Summary of all transactions
    calcDisplaySummary(acc); 
}
//updatingUI(account4);

// Login form
let currentAccount;
btnLogin.addEventListener('click',(event)=>{
    // Prevent reloading the page on click
    event.preventDefault();
    //Find account by username
    currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
    console.log(currentAccount);
    //Validating the Pin
    if (currentAccount?.pin === Number(inputLoginPin.value)){
        //console.log('success');
        // Welcome back message displaying first name only by using splice
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`
        containerApp.style.opacity = 1;
        // Updating the UI
        updatingUI(currentAccount);

        // Empty credential fields
        inputLoginUsername.value = inputLoginPin.value ='';
        inputLoginPin.blur();
    }  else {
        // Unsuccesful login attempt
        alert('Invalid password');
    };
});

// Transfer funds to another account

btnTransfer.addEventListener('click',(e) => {
    // Prevenitng the page from relaoding
    e.preventDefault();

    // Capture amount to transfer data
    const amount = Number(inputTransferAmount.value);

    // Capture the username we want to transfer money to
    const recieverInput = inputTransferTo.value;

    //console.log(amount);
    // console.log(recieverInput);
    //Setting the reciever account
    const recieverAccount = accounts.find(acc => acc.userName === recieverInput);
    //console.log(recieverAccount);
    // Empty out the fields
    inputTransferAmount.value = inputTransferTo.value = '';

    // Data Validation
    if (amount > 0 && amount <= currentAccount.balance && recieverAccount){
        // Current account movements update 
        currentAccount.movements.push(-amount);
        // Receiver account movements update
        recieverAccount.movements.push(amount);

    } else {
        alert('Insufficient funds to continue the operation');
    }

    updatingUI(currentAccount);
});


// Requesting a loan

btnLoan.addEventListener('click',(e) => {
    // Prevent reloading the page
    e.preventDefault();

    // Capture loan input 
    const amount = Number(inputLoanAmount.value);
    //console.log(amount);
    
    // Empty the imput field
    inputLoanAmount.value = ''; 
    // Updating the currnet account movements
    currentAccount.movements.push(amount);

    // Updating the UI
    updatingUI(currentAccount);
});

// Closing the account

btnClose.addEventListener('click', (e) => {
    // Prevent reloading the page
    e.preventDefault();

    //Extracticng the user name 
    const userToDelete = inputCloseUsername.value;

    //Extracticng the user pin 
    const pinToDelete = Number(inputClosePin.value);

    // Validating entered data
    if (userToDelete === currentAccount.userName && pinToDelete === currentAccount.pin){
        inputCloseUsername.value = inputClosePin.value = ''; 
        // Finding tje current account index
        const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
        console.log(index);
        alert('Are you sure you want to delete your data?')

        // Delete account from array
        accounts.splice(index,1);
        console.log(accounts);
        containerApp.style.opacity = 0;
        labelWelcome.textContent = `Login to get started`;
        inputLoginUsername.value = inputLoginPin.value = '';
        inputCloseUsername.value = inputClosePin.value = ''; 
    } else{
        console.log('Username and pin does not match');
        inputCloseUsername.value = inputClosePin.value = ''; 
    }
});

// Sorting balance timeline

// Setting the sorting option false (by default)
let sort = false;

btnSort.addEventListener('click',(e) => {
    // Prevent reloading the page
    e.preventDefault();
    displayMovements(currentAccount.movements, !sort);
    sort = !sort;

});