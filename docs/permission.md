# 权限

权限查找顺序：数据库个人配置 > 数据库用户组配置 > 默认配置 > 鉴权失败

默认权限组：0

---

## 默认权限

`/service/src/utils/permission.ts`

`/service/src/types/permission.ts`

数据库 表 `permission`

### 用户相关

登录权限（关闭则封禁账号，用户一旦退出登录，就无法重新登录） `login` 默认开启

基础功能权限（如退出登录、用户中心等功能） `low` 默认开启

获取 KEY 权限 `getKey` 默认开启

### 管理员相关

