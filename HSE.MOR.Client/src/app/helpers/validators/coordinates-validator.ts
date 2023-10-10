export class CoorinatesValidator {
  private static _isCoordinateFormatValid(coordinate: string): boolean {
    return new RegExp(/^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/).test(coordinate);
  }

  static isValid(value: string): boolean {
    return this._isCoordinateFormatValid(value);
  }
}
