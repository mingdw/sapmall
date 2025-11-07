package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"

	"sapphire-mall/app/internal/config"
	"sapphire-mall/app/internal/handler"
	"sapphire-mall/app/internal/svc"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/rest"
)

var configFile = flag.String("f", "./etc/sapmall_dev.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)
	fmt.Printf("Config file: %s\n", *configFile)
	fmt.Printf("DB DataSource: %s\n", c.DB.DataSource)
	server := rest.MustNewServer(c.RestConf)
	defer server.Stop()

	ctx := svc.NewServiceContext(c)
	handler.RegisterHandlers(server, ctx)

	// 设置 Swagger 路由
	setupSwaggerRoutes(server)

	// 设置信号处理，确保调试模式可以正常停止
	sigChan := make(chan os.Signal, 1)
	// Windows 上主要使用 os.Interrupt (Ctrl+C)，Unix 系统上也可以使用 SIGTERM
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	// 在 goroutine 中启动服务器
	go func() {
		server.Start()
	}()

	// 等待中断信号
	<-sigChan
	log.Println("收到停止信号，正在关闭服务器...")
	server.Stop()
	log.Println("服务器已关闭")
}

// setupSwaggerRoutes 设置 Swagger UI 相关路由
func setupSwaggerRoutes(server *rest.Server) {
	// Swagger JSON 路由
	server.AddRoute(rest.Route{
		Method: http.MethodGet,
		Path:   "/swagger.json",
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "swagger.json")
		}),
	})

	// 创建静态文件处理函数
	staticHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Static handler called for: %s", r.URL.Path)

		// 处理根路径
		if r.URL.Path == "/swagger-ui/" {
			log.Printf("Serving index.html for root path")
			http.ServeFile(w, r, "static/swagger-ui/index.html")
			return
		}

		// 处理具体文件
		if strings.HasPrefix(r.URL.Path, "/swagger-ui/") {
			// 移除前缀，获取相对路径
			path := strings.TrimPrefix(r.URL.Path, "/swagger-ui/")
			log.Printf("Trimmed path: %s", path)

			// 构建完整的文件路径
			fullPath := filepath.Join("static", "swagger-ui", path)
			log.Printf("Full file path: %s", fullPath)

			// 检查文件是否存在
			if _, err := os.Stat(fullPath); os.IsNotExist(err) {
				log.Printf("File does not exist: %s", fullPath)
				http.NotFound(w, r)
				return
			}

			// 直接服务文件
			log.Printf("Serving file: %s", fullPath)
			http.ServeFile(w, r, fullPath)
			return
		}

		http.NotFound(w, r)
	})

	// 注册具体的静态文件路由
	staticRoutes := []string{
		"/swagger-ui/",
		"/swagger-ui/swagger-ui.css",
		"/swagger-ui/index.css",
		"/swagger-ui/swagger-ui-bundle.js",
		"/swagger-ui/swagger-ui-standalone-preset.js",
		"/swagger-ui/swagger-initializer.js",
		"/swagger-ui/favicon-32x32.png",
		"/swagger-ui/favicon-16x16.png",
		"/swagger-ui/swagger-ui.css.map",
		"/swagger-ui/swagger-ui-bundle.js.map",
		"/swagger-ui/swagger-ui-standalone-preset.js.map",
	}

	for _, route := range staticRoutes {
		server.AddRoute(rest.Route{
			Method:  http.MethodGet,
			Path:    route,
			Handler: staticHandler,
		})
	}

	// 添加通配符路由作为后备
	server.AddRoute(rest.Route{
		Method:  http.MethodGet,
		Path:    "/swagger-ui/*filepath",
		Handler: staticHandler,
	})

	fmt.Println("Swagger UI:    http://localhost:8888/swagger-ui/")
	fmt.Println("Swagger JSON:  http://localhost:8888/swagger.json")
}
