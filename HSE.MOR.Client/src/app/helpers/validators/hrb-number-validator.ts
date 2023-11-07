export class HrbNumberValidator {
  private static _isHrbNumberFormatValid(hrbNumber: string): boolean {
    return new RegExp(/HRB\w{9}/, "gm").test(hrbNumber);
  }

  static isValid(value: string): boolean {
    return this._isHrbNumberFormatValid(value);
  }
}
