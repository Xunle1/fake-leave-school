import { STATUS } from "../constants";
import { List } from "../types";
import { getApplyTime, getDate } from "./date";

export const getInitList = (): List => {
  const applyTime = getApplyTime();
  const date = getDate();
  return [
    {
      applyTime,
      updateTime: applyTime,
      status: STATUS.INITIAL,
      date,
      id: 1,
      leaveInfo: {
        time: "",
        location: "",
      },
      backInfo: {
        time: "",
        location: "",
      },
    },
  ];
};
