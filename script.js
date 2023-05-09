'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-05-01T14:11:59.604Z',
    '2023-05-02T10:17:24.185Z',
    '2023-05-07T14:11:59.604Z',
    '2023-05-07T14:11:59.604Z',

  ],
  currency: 'EUR',
  locale: 'lt-LT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////
// Functions

const formatMovementsDate = function (date, locale) {

  const calcDaysPassed = (date1, date2) => Math.round(Math.abs((date2 - date1)) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} day ago`;

  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date.getDate()}`.padStart(2, 0);

  // return `${year}.${month}.${day}`
  return new Intl.DateTimeFormat(locale).format(date);

}

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}

const displayMovements = function (acc, sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency)

    //   new Intl.NumberFormat(acc.locale, {
    //     style: 'currency',
    //     currency: acc.currency,
    //   }).format(mov)

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type} </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div >
      </div >
  `;

    // yrs.mont.day

    containerMovements.insertAdjacentHTML('afterbegin', html)

  });

  // [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
  //   if (!(i % 2)) row.style.backgroundColor = 'lightgray'
  // })

}


const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((t, v) => t + v, 0);

  // new Intl.NumberFormat(acc.locale, {
  //   style: 'currency',
  //   currency: acc.currency,
  // }).format(acc.balance)

  labelBalance.textContent = `${formatCur(acc.balance, acc.locale, acc.currency)}`;

}


const displaySummmary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, sum) => acc + sum, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements.filter(sum => sum < 0).reduce((acc, sum) => acc + sum, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency)

  const interest = acc.movements.filter(a => a > 0).map(deposit => deposit * acc.interestRate / 100).reduce((acc, int) => int >= 1 ? acc + int : acc, 0)
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency)
}


// Prie accoounto prideti nauja key propertie username, kuris yra vardo ir pavardes inicialiai(mazosios raides)
const createUsername = function (accs) {
  accs.forEach(a => a.username = a.owner.toLowerCase().split(' ').map(e => e[0]).join(''))
}

createUsername(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  displayBalance(acc);
  // Display summary
  displaySummmary(acc);
}

// Event handlers
let currentAccount;

// // FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// Experiment with date API



btnLogin.addEventListener('click', function (e) {
  // FORMOJE ESANTIS BTN'as NEREFRESHINS PUSLAPIO KAI JIS BUS PASPAUSTAS, nesubmitins.
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI  and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`
    containerApp.style.opacity = 100

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //add dates to movements

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }

    // const local = navigator.language
    // console.log(local);

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${year}.${month}.${day}, ${hours}:${minutes}`



    // Update UI
    updateUI(currentAccount);

  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
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


  //Transfer Date
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAcc.movementsDates.push(new Date().toISOString());


  //Update UI
  updateUI(currentAccount);

});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = +inputLoanAmount.value;

  if (loanAmount > 0 && currentAccount.movements.some(mov => mov >= loanAmount * 0.1)) {

    // Add movment
    currentAccount.movements.push(loanAmount);

    //Transfer loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update the UI
    updateUI(currentAccount)

  }


  inputLoanAmount.value = ''

})

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username
    && +inputClosePin.value === currentAccount.pin) {

    const index = accounts.findIndex(acc => acc.username === currentAccount.username)

    console.log(index);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';

})

let sorted = false

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;

});




// ////// SOME FOR LEARNING ////////////

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => +el.textContent.replace('€', ''));

//   // console.log(movementsUI);

// });


// /////// ARAY METHODS PRACTICE //////

// /// 1. CALCULATE HOW MUCH TOTAL WAS DEPOSITED IN THE BANK

// const bankDepositSum = accounts.flatMap(acc => acc.movements)
//   .filter(sum => sum > 0)
//   .reduce((acc, sum) => acc + sum, 0);

// console.log(bankDepositSum);

// /// 2. HOW MANY DEPOSITS HAVE BEEN IN THE BANK AT LEAST 1000$$

// const depositsOver1000 = accounts.flatMap(acc => acc.movements)
//   .filter(sum => sum >= 1000).length;

// // const depositsOver1000_reduce = accounts.flatMap(acc => acc.movements)
// //   .reduce((count, cur) => cur >= 1000 ? count + 1 : count, 0)

// const depositsOver1000_reduce = accounts.flatMap(acc => acc.movements)
//   .reduce((count, cur) => cur >= 1000 ? ++count : count, 0)

// console.log(depositsOver1000);
// console.log(depositsOver1000_reduce)

// //Prefixed ++ operator
// let a = 10;
// console.log(++a);
// console.log(a);

// /// 3. CREATE AN OBJECT USING REDUCE WICH CONTAINS THE SUM OF DEPOSITS AND WITDRAWALS
// const { deposit, withdrawals } = accounts.flatMap(sum => sum.movements).reduce((sums, cur) => {
//   // cur > 0 ? sums.deposit += cur : sums.withdrawals += cur;
//   sums[cur > 0 ? 'deposit' : 'withdrawals'] += cur
//   return sums
// }, { deposit: 0, withdrawals: 0 })

// console.log(deposit);
// console.log(withdrawals);

// /// 4. CREATE FUNCTION TO CONVERT ANY STRING  TO A TITLE CASE (this is a nice title ==> This Is a Nice Title)

// const convertTitleCase = function (title) {

//   const capitalize = string => string[0].toUpperCase() + string.slice(1)

//   const exepctions = ['a', 'an', 'the', 'but', 'and', 'or', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => exepctions.includes(word) ? word : capitalize(word))
//     .join(' ');

//   return capitalize(titleCase)

// }

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title, but not too long'));
// console.log(convertTitleCase('and here is anothe title with an EXAMPLE'));


// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (!(i % 2)) row.style.backgroundColor = 'lightgray'
//   });
//   console.log([...document.querySelectorAll('.movements__row')]);
// })

