const BASEURL = '';
//    200成功，400失败，405余额不足, 300未登录，301未绑定手机号
const STATUSOBJ = {
  ok: 200,
  error: 400,
  noMoney: 405,
  noLogin: 300,
  noPhone: 301
};
export default {
  BASEURL,
  STATUSOBJ
}