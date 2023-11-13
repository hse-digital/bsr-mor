export class DateValidator {
  static isValid(day: number, month: number, year: number): boolean {
    var d = new Date(year, month, day);
    if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
      return true;
    }
    return false;
  }
  static isInFuture(day: number, month: number, year: number): boolean {
    var today = new Date(Date.now());
    var d = new Date(year, month, day);
    return d > today ? true : false;
  }
}
