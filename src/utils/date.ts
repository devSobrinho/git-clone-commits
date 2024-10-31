type DateAddInput = "1d" | "1w" | "1m" | "1y" | number;

export class DateUtil {
  constructor(public readonly date = new Date()) {}

  public add(input: DateAddInput) {
    switch (input) {
      case "1d":
        this.date.setDate(this.date.getDate() + 1);
        break;
      case "1w":
        this.date.setDate(this.date.getDate() + 7);
        break;
      case "1m":
        this.date.setMonth(this.date.getMonth() + 1);
        break;
      case "1y":
        this.date.setFullYear(this.date.getFullYear() + 1);
        break;
      default:
        this.date.setDate(this.date.getDate() + input);
    }
    return this;
  }

  public sub(input: DateAddInput) {
    switch (input) {
      case "1d":
        this.date.setDate(this.date.getDate() - 1);
        break;
      case "1w":
        this.date.setDate(this.date.getDate() - 7);
        break;
      case "1m":
        this.date.setMonth(this.date.getMonth() - 1);
        break;
      case "1y":
        this.date.setFullYear(this.date.getFullYear() - 1);
        break;
      default:
        this.date.setDate(this.date.getDate() - input);
    }
    return this;
  }

  public format(mask: string) {
    const year = this.date.getFullYear().toString();
    const month = (this.date.getMonth() + 1).toString().padStart(2, "0");
    const day = this.date.getDate().toString().padStart(2, "0");
    const hour = this.date.getHours().toString().padStart(2, "0");
    const minute = this.date.getMinutes().toString().padStart(2, "0");
    const second = this.date.getSeconds().toString().padStart(2, "0");
    return mask
      .replace("YYYY", year)
      .replace("yyyy", year)
      .replace("MM", month)
      .replace("mm", month)
      .replace("DD", day)
      .replace("dd", day)
      .replace("HH", hour)
      .replace("hh", hour)
      .replace("MI", minute)
      .replace("mm", minute)
      .replace("SS", second)
      .replace("ss", second);
  }
}
