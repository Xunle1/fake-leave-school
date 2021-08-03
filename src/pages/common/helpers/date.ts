import dayjs from "dayjs";

export function getDate() {
  return dayjs().format("YYYY-MM-DD");
}

export function getTime() {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
}

export function getApplyTime() {
  return dayjs(+new Date() - 60 * 60 * 1000).format("YYYY-MM-DD HH:mm:ss");
}
