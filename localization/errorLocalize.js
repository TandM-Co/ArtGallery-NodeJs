const Localize  = require('localize');

const ERROR_LOCALIZE = new Localize({
  '"login" is not allowed to be empty': {
    ru: '"логин" не может быть пустым',
  },
  '"login" length must be at least 3 characters long': {
    ru: 'длина "логина" должна быть не менее 3 символов',
  },
  '"password" length must be at least 6 characters long': {
    ru: 'длина "пароля" должна быть не менее 6 символов',
  },
  '"email" must be a valid email': {
    ru: '"электронная почта" должна быть действительной электронной почтой',
  },
  '"login" already exist': {
    ru: '"логин" уже занят',
  },
  '"login" not found': {
    ru: '"логин" не найден'
  },
  '"password" incorect': {
    ru: 'неверный "пароль"'
  }
});

module.exports = ERROR_LOCALIZE;
