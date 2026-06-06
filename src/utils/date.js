import { isBefore } from "date-fns";

export function isOld(session) {
  return isBefore(new Date(session.inicio), new Date());
}
