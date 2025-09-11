FROM eclipse-temurin:17-jre

WORKDIR /app

# 从构建阶段复制编译好的JAR包
COPY project/api-server/build/libs/*.jar app.jar

# 暴露端口
EXPOSE 5302

# 运行应用
CMD ["java", "-jar", "-Dserver.port=5302", "-Dserver.address=0.0.0.0", "app.jar"] 