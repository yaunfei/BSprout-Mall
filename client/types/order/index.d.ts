declare namespace ORDER {
  namespace Insert {
    interface Request {
      spuid: number;
      skuid: number;
      state: number;
      amount: string;
      count_num: number;
      consignee_info: {
        userName: string;
        telNumber: string;
        provinceName: string;
        cityName: string;
        countyName: string;
        detailInfo: string;
      };
    }
  }

  namespace List {
    interface Reponse {
      skuName: string;
      name: string;
      amount: string;
      mainUrl: string;
      create_time: number;
      state: number;
      count_num: number;
      consignee_info: {
        userName: string;
        telNumber: string;
        provinceName: string;
        cityName: string;
        countyName: string;
        detailInfo: string;
      };
      orderid: string;
      expressageid: string;
    }
  }
}
