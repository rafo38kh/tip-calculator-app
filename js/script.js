const forms = document.querySelectorAll(".content__form");
const inputs = document.querySelectorAll(".input__js");
const buttons = document.querySelectorAll(".input__button-js");
const outputs = document.querySelectorAll(".content__output-sum");
const reset = document.querySelector(".content__reset");
const errors = document.querySelectorAll(".content__error");

const [inputDollar, inputTip, inputHuman] = inputs;
const [errorBill, errorPeople] = errors;

const ZERO_REGEX = /0\d+/g;
const NUM_REGEX = /[^0-9\.]+/g;
const PEOPLE_REGEX = /[^0-9]+/g;
const LETTER_REGEX = /[a-zA-Z,/<>\?;':""[\]\\{}\|`~!@#\$%\^&\*()_=\+]+/g;

const checkRegex = (reg, input) => new RegExp(reg).test(input);

const errorState = (elem, message, errorText) => {
  elem.style.outline = "2px solid hsl(14, 32%, 57%)";
  elem.style.color = "hsl(14, 32%, 57%)";
  errorText.textContent = message;
  elem.style.caretColor = "hsl(14, 32%, 57%)";
};

const successState = (elem, errorText) => {
  elem.style.outline = "2px solid hsl(172, 67%, 45%)";
  elem.style.color = "hsl(183, 100%, 15%)";
  elem.style.caretColor = "hsl(172, 67%, 45%)";
  errorText.textContent = "";
};

inputDollar.addEventListener("keyup", (e) => {
  const val = e.target.value;

  if (!inputDollar.value || inputDollar.value === "0") {
    errorState(inputDollar, "Can't be zero", errorBill);
  } else if (
    checkRegex(LETTER_REGEX, inputDollar.value) ||
    checkRegex(NUM_REGEX, inputDollar.value)
  ) {
    errorState(inputDollar, "Positive numbers only", errorBill);
  } else if (checkRegex(ZERO_REGEX, inputDollar.value)) {
    errorState(inputDollar, "Can't start with zero", errorBill);
  } else if (inputDollar.value.split(".").length > 2) {
    errorState(inputDollar, "can't have two dots", errorBill);
  } else {
    successState(inputDollar, errorBill);
  }
});

inputHuman.addEventListener("keyup", (e) => {
  const val = e.target.value;

  if (!inputHuman.value || inputHuman.value === "0") {
    errorState(inputHuman, "Can't be zero", errorPeople);
  } else if (
    checkRegex(LETTER_REGEX, inputHuman.value) ||
    checkRegex(PEOPLE_REGEX, inputHuman.value)
  ) {
    errorState(inputHuman, "Positive numbers only", errorPeople);
  } else if (checkRegex(ZERO_REGEX, inputHuman.value)) {
    errorState(inputHuman, "Can't start with zero", errorPeople);
  } else {
    successState(inputHuman, errorPeople);
  }
});
