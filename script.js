'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

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

const displayMovements = function (movements) {

  containerMovements.innerHTML = '';

  movements.forEach((mov, i) => {

    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type} </div>
        <div class="movements__value">${mov} €</div >
      </div >
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html)

  });

}


const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((t, v) => t + v, 0);
  labelBalance.textContent = `${acc.balance} \u20AC`;

}


const displaySummmary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, sum) => acc + sum, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements.filter(sum => sum < 0).reduce((acc, sum) => acc + sum, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`

  const interest = acc.movements.filter(a => a > 0).map(deposit => deposit * acc.interestRate / 100).reduce((acc, int) => int >= 1 ? acc + int : acc, 0)
  labelSumInterest.textContent = `${interest}€`
}


// Prie accoounto prideti nauja key propertie username, kuris yra vardo ir pavardes inicialiai(mazosios raides)
const createUsername = function (accs) {
  accs.forEach(a => a.username = a.owner.toLowerCase().split(' ').map(e => e[0]).join(''))
}

createUsername(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  displayBalance(acc);
  // Display summary
  displaySummmary(acc);
}

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // FORMOJE ESANTIS BTN'as NEREFRESHINS PUSLAPIO KAI JIS BUS PASPAUSTAS, nesubmitins.
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI  and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`
    containerApp.style.opacity = 100

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);

  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferTo.value = inputTransferAmount.value = '';

  if (amount > 0
    && currentAccount.balance >= amount
    && receiverAcc
    && receiverAcc?.username !== currentAccount.username) {

  }
  //Doing the transfer
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);

  //Update UI
  updateUI(currentAccount);

});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username
    && Number(inputClosePin.value) === currentAccount.pin) {

    const index = accounts.findIndex(acc => acc.username === currentAccount.username)

    console.log(index);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';


})
