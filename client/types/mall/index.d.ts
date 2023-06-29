declare namespace MALL {
  namespace SpuList {
    interface Reponse {
      _id: number;
      name: string;
      amount: string;
      mainUrl: string;
      imgurls: string[];
      sku?: any[];
      goodsList?: any[];
      desc?: string;
    }
  }
}
