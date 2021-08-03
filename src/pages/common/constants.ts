export enum STATUS {
  INITIAL = "待出校",
  LEAVE = "待入校",
  BACK = "结束",
}

export type Location = "崇文门" | "腾飞门";
export type Type = "出校" | "入校";

export enum Storage {
  LIST = "list",
  STU_NUM = "stuNum",
  NAME = "name",
  COLLEGE = "college",
}
