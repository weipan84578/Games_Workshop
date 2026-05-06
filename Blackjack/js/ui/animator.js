import { delay } from "../utils/random.js";

export async function pace(ms = 260) {
  await delay(ms);
}
