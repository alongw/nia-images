# 使用文档

## 关于 Nia - Images

这是一个 [nia - api](https://github.com/alongw/nia-api) 的拓展项目或模块，由于其体积较大功能与主进程相比比主进程多得多，逻辑也大不相同，因此将其分开为独立的项目。当然，不止如此，他的使用性质上也不相同。

## KEY 和 TOKEN

在 Nia - Images 中，存在 key 与 token 两种鉴权方式，用于在调用 api 时鉴权身份

### KEY

key 是用户身份的标识符，泄露 key 意味着他人可以随意使用您的身份来调用接口，如果 key 一旦泄露，请立即前往用户中心申请重置，重置后，原有 KEY 将会永久失效。

key 主要用于后端场景，由后端通过 key 获取到数据，随后将数据传递给客户端，客户端渲染数据。为了您的安全，请不要将 key 及获取数据逻辑直接放在客户端，这非常危险。

### TOKEN

token 可以用于前端场景，由用户自行调用获取，以便在不方便连接后端的情况下。

用户可以创建多个 token ，每个 token 对应不同的服务，用户可以对不同的服务进行管理。用户不仅可以自己在托管控制台上创建，也可以自己使用 key 创建，并且设定有效期和防盗链。

对于 token 最大的亮点，他与 key 不同的是，可以将创建逻辑托管在 Vercel 等平台，并且可以进行多项目的管理，当您将 token 过期时间设置为 3 秒 ，甚至是 1 秒时，他将几乎不会被滥用。

## 接口说明

### 使用 KEY 获取图片

URL：`/public/img`

method: `GET` / `POST`

query: （仅 GET 时需要）

```typescript
{
	"key": string,
	"type"?: 'lite' | 'json'
}
```

body: （仅 POST 时需要）

```typescript
{
	"key": string,
    "config"?: {
        "iid"?: number,
        "image_age"? : 0 | 1 | 2 | 3 | 4 | 5 , // 默认 0
        "size_type"? : 0 | 1 | 2 ,
        "artist_name?" : string
    },
    "type"?: 'lite' | 'json'
}
```

参数说明

| 参数名             | 参数类型 | 参数说明                                     | 是否必须 |
| ------------------ | -------- | -------------------------------------------- | -------- |
| key                | string   | KEY 秘钥                                     | 是       |
| config             | object   | 图片查询的配置对象                           | 否       |
| config.iid         | number   | 图片编号                                     | 否       |
| config.image_age   | number   | 年龄分类                                     | 否       |
| config.size_type   | number   | 图片压缩                                     | 否       |
| config.artist_name | string   | 画师昵称                                     | 否       |
| type               | string   | 返回方式（传参则为 JSON ，不传直接返回图片） | 否       |

当然，其实在 GET 请求中也支持携带配置对象，但是 query 并不能很好的支持类型的传入，因此请使用 JSON 等方式传递。

关于 年龄分类 和 图片压缩 的更多信息，请在 [此处](https://github.com/alongw/nia-images/blob/main/docs/images.md) 查看，默认仅允许用户调用 `0` 和 `1` 级别

在未来会增加更多的配置类型。



### 使用 TOKEN 获取图片

咕咕咕...
