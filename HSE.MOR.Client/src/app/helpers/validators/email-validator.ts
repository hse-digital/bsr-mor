export class EmailValidator {
  private static _isEmailFormatValid(email: string): boolean {
    return new RegExp(/.+@.+\...+/, "gm").test(email);
  }
  
  static isValid(value: string): boolean {
    return this._isEmailFormatValid(value);
  }
}
