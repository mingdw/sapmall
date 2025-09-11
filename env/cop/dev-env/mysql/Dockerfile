FROM mysql:8.3.0

# 设置时区
ENV TZ=UTC

# 设置字符集
ENV MYSQL_CHARACTER_SET_SERVER=utf8mb4
ENV MYSQL_COLLATION_SERVER=utf8mb4_unicode_ci

# 创建日志目录
RUN mkdir -p /var/log/mysql && chown mysql:mysql /var/log/mysql

# 创建自定义配置文件以启用慢查询日志
RUN echo '[mysqld]' > /etc/mysql/conf.d/slow-query.cnf && \
    echo 'slow_query_log = ON' >> /etc/mysql/conf.d/slow-query.cnf && \
    echo 'long_query_time = 0.1' >> /etc/mysql/conf.d/slow-query.cnf && \
    echo 'slow_query_log_file = /var/log/mysql/slow.log' >> /etc/mysql/conf.d/slow-query.cnf && \
    echo 'log_queries_not_using_indexes = ON' >> /etc/mysql/conf.d/slow-query.cnf && \
    echo 'min_examined_row_limit = 1' >> /etc/mysql/conf.d/slow-query.cnf
