import request from "../index";

const IcloudFunName = "BSprout-Mall";

export function miniLogin(): Promise<{
  appid: string;
  env: string;
  event: any;
  openid: string;
  unionid: string;
}> {
  return request(IcloudFunName, {
    type: "login",
  });
}

// 获取用户信息
export function getUserInfo(): Promise<any> {
  return request(IcloudFunName, {
    type: "user_info",
  });
}

// 更新用户信息
export function updateUser(data: {
  nickName: string;
  avatarUrl: string;
}): Promise<any> {
  return request(IcloudFunName, {
    type: "update_user",
    ...data,
  });
}

// 判断用户的管理权限
export function manageUser(): Promise<any> {
  return request(IcloudFunName, {
    type: "manage_user",
  });
}
