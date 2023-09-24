# TypeScript 项目模板

基于 [template-ts](https://github.com/ltfei-blog/template-ts) 二次开发

## 功能

-   Prettierrc 格式化代码
-   Eslint 语法检查（目前会警告，因为不支持当前版本的 TypeScript ）
-   Git Commit 语法检查和辅助编写
-   更好的打包

### Prettierrc 格式化代码

使用 prettierrc 进行代码格式化

需在 vscode 插件市场安装 [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 并设置为默认代码格式化插件

### Eslint 语法检查

使用 Eslint 进行语法检查

需在 vscode 插件市场安装 [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

> 由于当前 @typescript-eslint/typescript-estree 仅支持 >=3.3.1 <5.1.0 版本的 Typescript，但是我们使用的是 5.1.3 版本的 Typescript ， 因此在每次检查时都会弹出警告消息

### Git Commit 语法检测和辅助编写

使用 [husky](https://github.com/typicode/husky) + [commitizen](https://github.com/commitizen/cz-cli) + [lint-staged](https://github.com/okonet/lint-staged) 规范化 Git Commit ，代码提交需符合相关规范

使用 `yarn cz` 来调用 git-cz 进行问答式提交

使用 `yarn push` 来调用 git-cz 进行问答式提交并提交至远程仓库

使用 `yarn pushall` 来调用 git-cz 进行问答式提交并将所有修改的文件提交至远程仓库

```bash
git add .
yarn cz
git push
```

### 更好的打包

使用更好的打包方案（自动化）

当运行 `yarn build` 时会自动执行以下操作

-   检查是否有相关文件夹 `/dist` 、 `/dist/code` 、 `/dist/tsc` 、 `/dist/file` ，如果有则清空 `/dist/code` 及 `/dist/tsc` ，如果没有则创建
-   将 `/src` 下所有文件打包至 `/dist/tsc`
-   将项目根目录下 `/public` 以及 src 目录下 `/src/public` 文件夹完整复制到 `/dist/code`
-   将刚刚打包好 `/dist/tsc` 目录下所有文件复制到 `/dist/code`
-   将项目根目录下 `/template` 目录复制到 `/dist/code/template`
-   将 `/dist/file` 目录下所有文件复制到 `/dist/code` （如果有）
-   将根目录下 `package.json` 及 `yarn.lock` 还有 `LICENSE` 复制到 `/dist/code` 目录下

打包后的最终代码将在 `/dist/code` 文件夹中

### 其他打包命令

使用 `yarn build:nolint` 来绕过 Eslint 语法检查直接打包

使用 `yarn build:tsc` 来仅编译 `src` 目录下的文件

使用 `yarn build:lint` 以方便在没有安装全局环境时打包

### 自动部署

配置 Github Actions 进行自动部署

生效分支：main 主分支

配置环境：Ubuntu-latest

Node 版本：18

安装依赖命令：yarn install

构建命令：yarn build

### 开源协议

默认采用 GNU Affero General Public License v3.0 （AGPL-3.0） 协议
