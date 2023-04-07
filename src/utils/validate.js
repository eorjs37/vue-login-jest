const required = val => {
  if (!val) {
    return false;
  }
  return true;
};

const emailValidate = val => {
  const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
  return regex.test(val);
};

const passwordValidate = val => {
  const regex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
  return regex.test(val);
};

export { required, emailValidate, passwordValidate };
