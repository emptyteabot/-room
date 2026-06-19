# 专注一隅

AI 沉浸式全屏自习室 MVP，包含全屏场景视频、毛玻璃控制面板、双路环境音混音、番茄钟和会员支付回调骨架。

## 本地开发

```bash
npm run dev
```

打开 [http://localhost:3000/focus-room](http://localhost:3000/focus-room)。

## 构建

```bash
npm run lint
npm run build
```

## 部署

当前应用配置了 `basePath: "/focus-room"` 和 `output: "standalone"`，适合部署到已有服务器的子路径。

生产环境需要设置：

```bash
PAYMENT_WEBHOOK_TOKEN=replace-with-a-long-random-token
```

## 线上地址

http://43.135.51.214/focus-room
