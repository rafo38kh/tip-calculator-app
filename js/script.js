const forms = document.querySelectorAll(`.content__form`);
const inputs = document.querySelectorAll(`.input__js`);
const buttons = document.querySelectorAll(`.input__button-js`);
const outputs = document.querySelectorAll(`.content__output-sum`);
const reset = document.querySelector(`.content__reset`);
const errors = document.querySelectorAll(`.content__error`);

const [inputDollar, inputTip, inputHuman] = inputs;
const [errorBill, errorPeople] = errors;
const [sumTip, sumTotal] = outputs;

const regexes = {
  dot: /^\.$/g,
  zero_regex: /^0\d+/g,
  num_regex: /[^0-9\.]+/g,
  people_regex: /[^0-9]+/g,
  letter_regex: /[a-zA-Z,/<>\?;':""[\]\\{}\|`~!@#\$%\^&\*()_=\+]+/g,
};

const checkRegex = (reg, input) => new RegExp(reg).test(input);

const removeActiveClass = () => {
  buttons.forEach((btn) =>
    btn.classList.remove(`content__input-button-active`)
  );
};

const errorState = (elem, message, errorText) => {
  elem.classList.add(`content__input--error`);
  errorText.textContent = message;
};

const successState = (elem, errorText) => {
  elem.classList.remove(`content__input--error`);
  errorText.textContent = ``;
};

let buttonTip = 0;

const sumOfTip = (percentage) => {
  const dollar = inputDollar.value;
  const human = inputHuman.value;

  const tip = ((dollar / 100) * percentage) / human;
  const person = dollar / human + tip;

  if (dollar > 0 && dollar < 999999 && human > 0 && human < 999999) {
    sumTip.textContent = `$${tip.toFixed(2)}`;
    sumTotal.textContent = `$${person.toFixed(2)}`;
  } else if (dollar > 0) {
    sumTotal.textContent = `$${(dollar / 1).toFixed(2)}`;
  } else if (dollar === `` || human === ``) {
    sumTip.textContent = `$0.00`;
    sumTotal.textContent = `$0.00`;
  }
};

buttons.forEach((btn) => {
  btn.addEventListener(`click`, (e) => {
    reset.removeAttribute(`disabled`);
    removeActiveClass();
    inputTip.value = ``;
    inputTip.classList.remove(`content__input--error`);
    e.target.classList.add(`content__input-button-active`);
    buttonTip = e.target.dataset.percentage;
    sumOfTip(buttonTip);
  });
});

inputDollar.addEventListener(`input`, (e) => {
  const val = e.target.value;

  reset.removeAttribute(`disabled`);

  if (val === `0`) errorState(inputDollar, `Can't be zero`, errorBill);
  else if (
    checkRegex(regexes.letter_regex, val) ||
    checkRegex(regexes.num_regex, val)
  )
    errorState(inputDollar, `Positive numbers only`, errorBill);
  else if (val > 999999)
    errorState(inputDollar, `Max amount: '999999'`, errorBill);
  else if (checkRegex(regexes.zero_regex, val))
    errorState(inputDollar, `Can't start with zero`, errorBill);
  else if (val.split(`.`).length > 2)
    errorState(inputDollar, `Can't have two dots`, errorBill);
  else {
    successState(inputDollar, errorBill);
    sumOfTip(buttonTip);
  }
});

inputHuman.addEventListener(`input`, (e) => {
  const val = e.target.value;

  reset.removeAttribute(`disabled`);

  if (val === `0`) errorState(inputHuman, `Can't be zero`, errorPeople);
  else if (
    checkRegex(regexes.letter_regex, val) ||
    checkRegex(regexes.people_regex, val)
  )
    errorState(inputHuman, `Positive numbers only`, errorPeople);
  else if (val > 999) errorState(inputHuman, `Max people: '999'`, errorPeople);
  else if (checkRegex(regexes.zero_regex, val))
    errorState(inputHuman, `Can't start with zero`, errorPeople);
  else {
    successState(inputHuman, errorPeople);
    sumOfTip(buttonTip);
  }
});

inputTip.addEventListener(`input`, (e) => {
  const val = e.target.value;

  reset.removeAttribute(`disabled`);
  if (
    val < 0 ||
    val > 100 ||
    val === `0` ||
    val.split(`.`).length > 2 ||
    checkRegex(regexes.dot, val) ||
    checkRegex(regexes.num_regex, val) ||
    checkRegex(regexes.zero_regex, val)
  )
    e.target.classList.add(`content__input--error`);
  else {
    e.target.classList.remove(`content__input--error`);

    buttonTip = val;
    sumOfTip(buttonTip);
  }

  if (val === ``) {
    e.target.classList.remove(`content__input--error`);
  }

  removeActiveClass();
});

reset.addEventListener(`click`, () => {
  inputs.forEach((input) => {
    input.value = ``;
    input.classList.remove(`content__input--error`);
  });
  errors.forEach((error) => (error.textContent = ``));
  removeActiveClass();
  reset.setAttribute(`disabled`, true);
  outputs.forEach((output) => (output.textContent = `$0.00`));
  buttonTip = 0;
});

window.onload = () => {
  inputs.forEach((el) => (el.value = ``));
  reset.setAttribute(`disabled`, true);
};

(() => reset.setAttribute(`disabled`, true))();
