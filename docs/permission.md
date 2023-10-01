# 权限

权限查找顺序：数据库个人配置 > 数据库用户组配置 > 默认配置 > 鉴权失败

默认权限组：1

未激活用户权限组：-10

---

## 默认权限

`/service/src/utils/permission.ts`

`/service/src/types/permission.ts`

数据库 表 `permission`

### 用户相关

登录权限（关闭则封禁账号，用户一旦退出登录，就无法重新登录） `login` 默认开启

基础功能权限（如退出登录、用户中心等功能） `low` 默认开启

获取 KEY 权限 `getKey` 默认开启

重置 KEY 权限 `resetKey` 默认开启

### 管理员相关



### API 相关

使用 API 权限 `useApi` 默认开启

获取分级图片 `level0` `level1` `level2` `level3` `level4` `level5` 默认只开 0 和 1 ，具体请参考文档

获取压缩图片 `zip0` `zip1` `zip2` 默认只开 0 和 1 ，具体请参考文档