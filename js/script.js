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

const colors = {
  errorColor: `hsl(14, 32%, 57%)`,
  succsesColor: `hsl(183, 100%, 15%)`,
  succsesOutlineColor: `hsl(172, 67%, 45%)`,
};

const checkRegex = (reg, input) => new RegExp(reg).test(input);

const removeActiveClass = () => {
  buttons.forEach((btn) =>
    btn.classList.remove(`content__input-button-active`)
  );
};

const customError = (elem) => {
  elem.style.outline = `2px solid ${colors.errorColor}`;
  elem.style.color = `${colors.errorColor}`;
  elem.style.caretColor = `${colors.errorColor}`;
};

const customSuccess = (elem) => {
  elem.style.outline = `2px solid ${colors.succsesOutlineColor}`;
  elem.style.color = `${colors.succsesColor}`;
  elem.style.caretColor = `${colors.succsesOutlineColor}`;
};

const errorState = (elem, message, errorText) => {
  customError(elem);
  errorText.textContent = message;
};

const successState = (elem, errorText) => {
  customSuccess(elem);
  errorText.textContent = ``;
};

let buttonTip = 0;

const sumOfTip = (percentage) => {
  const dollar = inputDollar.value;
  const human = inputHuman.value;

  const tip = ((dollar / 100) * percentage) / human;
  const person = dollar / human + tip;

  if (dollar > 0 && human > 0) {
    sumTip.textContent = `$${tip.toFixed(2)}`;
    sumTotal.textContent = `$${person.toFixed(2)}`;
  }
};

buttons.forEach((btn) => {
  btn.addEventListener(`click`, (e) => {
    reset.removeAttribute(`disabled`);
    removeActiveClass();
    inputTip.value = "";
    inputTip.style.outline = "0";
    inputTip.style.color = `${colors.succsesColor}`;
    e.target.classList.add(`content__input-button-active`);

    buttonTip = e.target.dataset.percentage;

    sumOfTip(buttonTip);
  });
});

inputDollar.addEventListener(`input`, (e) => {
  const val = e.target.value;

  reset.removeAttribute(`disabled`);

  if (!val || val === `0`) errorState(inputDollar, `Can't be zero`, errorBill);
  else if (
    checkRegex(regexes.letter_regex, val) ||
    checkRegex(regexes.num_regex, val)
  )
    errorState(inputDollar, `Positive numbers only`, errorBill);
  else if (checkRegex(regexes.zero_regex, val))
    errorState(inputDollar, `Can't start with zero`, errorBill);
  else if (val.split(`.`).length > 2)
    errorState(inputDollar, `can't have two dots`, errorBill);
  else {
    successState(inputDollar, errorBill);
    sumOfTip(buttonTip);
  }
});

inputHuman.addEventListener(`input`, (e) => {
  const val = e.target.value;

  reset.removeAttribute(`disabled`);

  if (!val || val === `0`) errorState(inputHuman, `Can't be zero`, errorPeople);
  else if (
    checkRegex(regexes.letter_regex, val) ||
    checkRegex(regexes.people_regex, val)
  )
    errorState(inputHuman, `Positive numbers only`, errorPeople);
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
    val === `0` ||
    val.split(`.`).length > 2 ||
    checkRegex(regexes.dot, val) ||
    checkRegex(regexes.num_regex, val) ||
    checkRegex(regexes.zero_regex, val)
  )
    customError(inputTip);
  else {
    customSuccess(inputTip);

    buttonTip = val;
    sumOfTip(buttonTip);
  }

  if (val === ``) {
    inputTip.style.outline = `0`;
    inputTip.style.color = `${colors.succsesColor}`;
    inputTip.style.caretColor = `${colors.succsesOutlineColor}`;
  }

  if (inputTip.value !== "") removeActiveClass();
});

reset.addEventListener(`click`, () => {
  inputs.forEach((input) => {
    input.value = ``;
    input.style.outline = `none`;
    input.style.color = `${colors.succsesColor}`;
    input.style.caretColor = `${colors.succsesOutlineColor}`;
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
