export class PostCodeValidator {
  private static _isPostCodeFormatValid(postcode: string): boolean {
    return new RegExp(/^[a-zA-Z]{1,2}\d[a-zA-Z\d]?\s*\d[a-zA-Z]{2}$/, "gm").test(postcode);
  }

  static isValid(value: string): boolean {
    return this._isPostCodeFormatValid(value);
  }
}
