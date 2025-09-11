FROM node:20

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PORT=3004
ENV HOST=0.0.0.0

# 复制项目文件
COPY web_client/sapmall-admin/ ./

# 安装依赖
RUN npm install

# 暴露端口
EXPOSE 3004

# 启动应用
CMD ["npm", "start"]
