FROM node:20

# 设置工作目录
WORKDIR /app

# 安装serve工具用于提供静态文件服务
RUN npm install -g serve

# 只复制构建好的文件，而不是整个项目
COPY web_client/sapmall-admin/build ./build

# 设置环境变量
ENV PORT=3001
ENV HOST=0.0.0.0

# 暴露端口
EXPOSE 3001

# 启动应用，使用serve提供静态文件服务
CMD ["serve", "-s", "build", "-l", "3001"]
