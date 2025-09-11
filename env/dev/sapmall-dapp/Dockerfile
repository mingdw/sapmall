FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PORT=3005
ENV HOST=0.0.0.0
ENV NODE_ENV=production
# 增加 Node.js 内存限制
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 安装系统依赖
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# 复制 package.json 和 package-lock.json
COPY web_client/sapmall-dapp/package*.json ./

# 设置 npm 源并安装依赖（包括开发依赖，构建时需要）
RUN npm config set registry https://registry.npmjs.org/ && \
    npm ci --silent

# 复制项目文件
COPY web_client/sapmall-dapp/ ./

# 构建应用（使用增加的内存限制）
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# 暴露端口
EXPOSE 3005

# 启动应用
CMD ["npm", "start"]
