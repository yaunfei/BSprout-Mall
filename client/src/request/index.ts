import Taro from "@tarojs/taro";

/**
 * 云函数请求方法
 * @param name 要调用的云函数名称
 * @param data 传递给云函数的event参数
 * @returns
 */
export default function (name, data?): Promise<any> {
  return new Promise((resolve, reject) => {
    Taro.cloud
      .callFunction({
        name,
        data,
      })
      .then((res) => {
        resolve(res.result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
