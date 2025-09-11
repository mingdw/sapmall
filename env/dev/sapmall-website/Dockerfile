FROM node:20

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PORT=3006
ENV HOST=0.0.0.0
ENV NODE_ENV=development

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 复制项目文件
COPY web_client/sapmall-website/ ./

# 设置 npm 源并安装依赖
RUN npm config set registry https://registry.npmjs.org/ && \
    npm install --legacy-peer-deps

# 暴露端口
EXPOSE 3006

# 启动应用（开发模式）
CMD ["npm", "start"]
