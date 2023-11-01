export class BcaReferenceValidator {
  private static _isBcaReferenceFormatValid(bcaReference: string): boolean {
    return new RegExp(/BCA\w{9}/, "gm").test(bcaReference);
  }

  static isValid(value: string): boolean {
    return this._isBcaReferenceFormatValid(value);
  }
}
