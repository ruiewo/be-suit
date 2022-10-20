export const isClientSide = () => typeof window !== 'undefined';

export const isNullOrWhiteSpace = (input: string | null | undefined) => {
  if (typeof input === 'undefined' || input == null) {
    return true;
  }
  return input.toString().replace(/\s/g, '').length < 1;
};

export const isDate = (v: string | number) => !isNaN(new Date(v).getTime());

export class DateEx extends Date {
  override toDateString() {
    const y = this.getFullYear();
    const m = ('00' + (this.getMonth() + 1)).slice(-2);
    const d = ('00' + this.getDate()).slice(-2);
    const dateString = `${y}-${m}-${d}`;

    return dateString;
  }

  toDateTimeString() {
    // returns 'yyyy-mm-dd hh:mm:ss'
    const offset = this.getTimezoneOffset() * 60 * 1000;
    const localDatetime = new Date(this.getTime() - offset);
    let datetimeString = localDatetime.toISOString();
    datetimeString = datetimeString.slice(0, 19);
    datetimeString = datetimeString.replace('T', ' ');
    return datetimeString;
  }

  toTimeString() {
    // returns 'hh:mm'
    const offset = this.getTimezoneOffset() * 60 * 1000;
    const localDatetime = new Date(this.getTime() - offset);
    let datetimeString = localDatetime.toISOString();
    datetimeString = datetimeString.slice(11, 16);
    datetimeString = datetimeString.replace('T', ' ');
    return datetimeString;
  }

  addMonths(months: number) {
    this.setMonth(this.getMonth() + months);
    return this;
  }

  addDays(days: number) {
    this.setDate(this.getDate() + days);
    return this;
  }

  addHours(hours: number, mins: number, seconds: number) {
    if (seconds) {
      this.setHours(this.getHours() + hours, this.getMinutes() + mins, this.getSeconds() + seconds);
    } else if (mins) {
      this.setHours(this.getHours() + hours, this.getMinutes() + mins);
    } else {
      this.setHours(this.getHours() + hours);
    }
    return this;
  }

  toLocalISOString() {
    const offset = this.getTimezoneOffset() * 60 * 1000;
    const localDatetime = new Date(this.getTime() - offset);
    let datetimeString = localDatetime.toISOString();
    datetimeString = datetimeString.replace('Z', '');
    const sign = this.getTimezoneOffset() < 0 ? '-' : '+';
    const absOffset = Math.abs(this.getTimezoneOffset());
    const offsetHH = (absOffset / 60).toString().padStart(2, '0');
    const offsetMM = (absOffset % 60).toString().padStart(2, '0');
    datetimeString += sign + offsetHH + ':' + offsetMM;
    return datetimeString;
  }
}
