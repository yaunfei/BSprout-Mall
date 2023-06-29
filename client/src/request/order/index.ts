import request from "../index";

const IcloudFunName = "BSprout-Mall";

export function insertOrder(data: ORDER.Insert.Request): Promise<any> {
  return request(IcloudFunName, {
    type: "insert_order",
    ...data,
  });
}

export function getOrderList(
  data: PAGING.Request & {
    manageSate?: number;
  }
): Promise<any> {
  return request(IcloudFunName, {
    type: "order_info",
    ...data,
  });
}

// 更新订单状态
export function updateOrderState(data: {
  state: number;
  orderid: string | undefined;
  expressageid?: string;
}): Promise<any> {
  return request(IcloudFunName, {
    type: "update_order_state",
    ...data,
  });
}
