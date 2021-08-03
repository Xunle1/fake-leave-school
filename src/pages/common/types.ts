import { ItemProps } from "../../pages/index/components/Item";
import { Location, STATUS } from "./constants";

export type Type = "出校" | "入校";

export interface Info {
  time: string;
  location: Location | "";
}

export type ListItem = ItemProps & {
  applyTime: string;
  leaveInfo: Info;
  backInfo: Info;
};

export type List = ListItem[];

export type status = STATUS;
