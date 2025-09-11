FROM node:18

# 设置工作目录
WORKDIR /app

# 安装serve工具用于提供静态文件服务
RUN npm install -g serve

# 只复制构建好的文件，而不是整个项目
COPY project/desktop-web/build ./build

# 设置环境变量
ENV PORT=5502
ENV HOST=0.0.0.0

# 暴露端口
EXPOSE 5502

# 启动应用，使用serve提供静态文件服务
CMD ["serve", "-s", "build", "-l", "5502"]
