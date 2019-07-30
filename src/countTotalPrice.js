// @flow strict

import type { Item } from "./Shop";

export default function countTotalPrice(
  items: Item[],
  includeDeliveryCost: boolean = false
) {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }

  if (includeDeliveryCost === true) {

    if (total < 4999) {
      total += 500;
    }
    
  }

  if (total >= 10000) {
    
    let pricesArr = [];

    for (const item of items) {
      pricesArr.push(item.price);
    }

    total -= Math.min.apply(null, pricesArr);

  }

  return total;
}
