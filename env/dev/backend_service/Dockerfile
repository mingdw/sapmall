# 使用官方 Go 镜像作为构建环境
FROM golang:1.24.3-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache git ca-certificates tzdata

# 复制 go mod 文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./app/sapmall_start.go

# 使用轻量级的 alpine 镜像作为运行环境
FROM alpine:latest

# 安装 ca-certificates 和 tzdata
RUN apk --no-cache add ca-certificates tzdata

# 设置时区
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone

# 创建非 root 用户
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# 设置工作目录
WORKDIR /app

# 从构建阶段复制二进制文件
COPY --from=builder /app/main .

# 复制配置文件
COPY --from=builder /app/app/etc ./etc

# 复制 Swagger 相关文件
COPY --from=builder /app/app/swagger.json .
COPY --from=builder /app/app/static ./static

# 更改文件所有者
RUN chown -R appuser:appgroup /app

# 切换到非 root 用户
USER appuser

# 暴露端口
EXPOSE 8888

# 设置环境变量
ENV TZ=Asia/Shanghai
ENV GIN_MODE=release

# 创建容器启动脚本
RUN echo '#!/bin/bash' > /app/start_container.sh && \
    echo 'echo "Starting Sapphire Mall Backend Service in container..."' >> /app/start_container.sh && \
    echo 'exec ./main -f etc/sapmall_dev.yaml' >> /app/start_container.sh && \
    chmod +x /app/start_container.sh

# 启动应用
CMD ["./main", "-f", "etc/sapmall_dev.yaml"]
