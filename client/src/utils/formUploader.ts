import { GITEE_DOWNLOAD_URL, GITEE_TOKEN, GITEE_URL } from "@/common/constant";
import { cloudReg, httpTemp, wxfileTemp } from "@/common/reg";
import { IFormInstanceAPI } from "@antmjs/vantui/types/form";
import Taro from "@tarojs/taro";

type fileBackType = {
  size: number;
  thumb: string;
  type: "image";
  url: string;
};

// 商品form表单-上传图片
export function formUploadFile(event, formName, instance) {
  const { file } = event.detail as { file: fileBackType };
  // 异步更新
  return new Promise((resolve) => {
    giteeUploadFile("spu_info", file?.url).then((res) => {
      let fileList = instance.getFieldValue(formName) || [];
      fileList = fileList.concat({ url: res?.fileID });
      resolve(fileList);
    });
  });
}

// 商品form表单-删除图片
export function formDeleteFile(event, formIt: IFormInstanceAPI, field: string) {
  const { index, fileList } = event.detail;
  // cdn 删除
  const filePath = fileList[index]?.url;
  giteeDeleteFile("spu_info", filePath);
  fileList.splice(index, 1);

  formIt?.setFieldsValue(field, fileList);
}

type CloudPathType = "user_info" | "icon_info" | "spu_info" | "order_info";

// 上传文件服务器，返回fileID
export async function cloundUploadFile(
  cloudPath: CloudPathType,
  filePath: string
): Promise<{
  fileID: string;
}> {
  try {
    if (cloudReg.test(filePath)) {
      return { fileID: filePath };
    } else {
      return Taro.cloud.uploadFile({
        cloudPath: `${cloudPath}/${new Date().getTime()}${Math.ceil(
          Math.random() * 10
        )}.jpg`,
        filePath,
      });
    }
  } catch (err) {
    return err;
  }
}

// 上传文件到gitee，返回fileID
export async function giteeUploadFile(
  cloudPath: CloudPathType,
  filePath: string
): Promise<{
  fileID: string;
}> {
  try {
    // 获取文件名
    const contentPath = filePath.replace(httpTemp, "").replace(wxfileTemp, "");
    return new Promise((resolve, reject) => {
      Taro.getFileSystemManager().readFile({
        filePath: filePath, //选择图片返回的相对路径
        encoding: "base64", //编码格式
        success: (res) => {
          //成功的回调
          Taro.uploadFile({
            url: `${GITEE_URL}/${cloudPath}/${contentPath}`, //仅为示例，非真实的接口地址
            filePath: filePath,
            name: "file",
            formData: {
              access_token: GITEE_TOKEN,
              branch: "master",
              message: `上传${contentPath}文件`,
              content: res.data,
            },
            success(res1) {
              resolve({
                fileID: JSON.parse(res1.data)?.content?.download_url,
              });
            },
            fail(err) {
              reject(err);
            },
          });
        },
      });
    });
  } catch (err) {
    return err;
  }
}

// 删除gitee，图片
export async function giteeDeleteFile(
  cloudPath: CloudPathType,
  filePath: string
) {
  // 获取文件名
  const contentPath = filePath.replace(
    `${GITEE_DOWNLOAD_URL}/${cloudPath}/`,
    ""
  );
  const url = `${GITEE_URL}/${cloudPath}/${contentPath}`;
  // 获取文件信息
  Taro.request({
    url,
    method: "GET",
    data: {
      access_token: GITEE_TOKEN,
    },
  }).then((res: any) => {
    const {
      data: { sha },
    } = res;
    // 删除文件
    if (sha) {
      Taro.request({
        url,
        method: "DELETE",
        data: {
          access_token: GITEE_TOKEN,
          sha,
          message: `删除${contentPath}`,
        },
      });
    }
  });
}
