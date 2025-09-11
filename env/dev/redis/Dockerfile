FROM redis:7.2-alpine

# 设置时区
ENV TZ=Asia/Shanghai

# 创建数据目录
RUN mkdir -p /data && chown redis:redis /data

# 设置工作目录
WORKDIR /data

# 暴露端口
EXPOSE 6379

# 设置默认配置
ENV REDIS_PASSWORD=""
ENV REDIS_DATABASES=16
ENV REDIS_MAXMEMORY=256mb
ENV REDIS_MAXMEMORY_POLICY=allkeys-lru

# 复制自定义配置文件（如果需要）
# COPY redis.conf /usr/local/etc/redis/redis.conf

# 启动命令
CMD ["redis-server", "--appendonly", "yes"]
