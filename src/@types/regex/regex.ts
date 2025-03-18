// export const priceWith2Decimal = /^[1-9]*(\.[0-9]{0,2})?$/;
export const priceWith2Decimal =
  /^(?!(0|0\.0{1,2}|200000|200000\.00))(0*[1-9]\d{0,4}|0*\d{1,5}\.\d{1,2})$/;
//   /^(?:(?:1\d{0,4}|[2-9]\d{0,4}|\d{2,5})(?:\.\d{1,2})?|200000(?:\.00?)?)$/;
export const passwordLowerCaseRegex = /^(?=.*[a-z]).*$/;
export const passwordNumericRegex = /^(?=.*[0-9]).*$/;

export const passwordUpperCaseRegex = /^(?=.*[A-Z]).*$/;
// const checkCharacterRegex = /^([a-zA-Z ]){3,30}$/;
export const checkCharacterRegex = /[!@#$%^&*(),.?":{}|<>~`/\[\]\\\-=_+;'|]/;
export const phoneReg = /^\+?\d{8,17}$/;
// /^\d{8,15}$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
