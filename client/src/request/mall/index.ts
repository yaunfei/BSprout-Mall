import request from "../index";

const IcloudFunName = "BSprout-Mall";

// 获取spu
export function getSpuList(
  data: PAGING.Request & { name?: string; manageEntry?: boolean }
): Promise<{ data: MALL.SpuList.Reponse[]; total: number }> {
  return request(IcloudFunName, {
    type: "spu_info",
    ...data,
  });
}

// 新增spu
export function insertSpuInfo(data: any): Promise<any> {
  return request(IcloudFunName, {
    type: "insert_spu",
    ...data,
  });
}

// 上下架spu
export function hiddenSpuInfo(data: any): Promise<any> {
  return request(IcloudFunName, {
    type: "hidden_spu",
    ...data,
  });
}

// 根据_id 获取商品详情
export function spuDetail(data: any): Promise<any> {
  return request(IcloudFunName, {
    type: "spu_detail",
    ...data,
  });
}
