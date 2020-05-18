const rootPath = "http://192.168.0.2:8899";
const apiObject = {
  query: `${rootPath}/api/street/query`,
  queryById: `${rootPath}/api/street/queryById`,
  upload: `${rootPath}/api/common/upload`,
  addPic: `${rootPath}/api/street/add/pic`,
  addDesc: `${rootPath}/api/street/add/desc`
};
export default apiObject;
