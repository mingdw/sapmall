package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"

	cctprelayer "sapphire-mall/app/internal/cctp"
	"sapphire-mall/app/internal/config"
	"sapphire-mall/app/internal/handler"
	"sapphire-mall/app/internal/listener"
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
	server := rest.MustNewServer(c.RestConf)
	defer server.Stop()

	ctx := svc.NewServiceContext(c)
	handler.RegisterHandlers(server, ctx)

	var cctpRelayer *cctprelayer.Relayer
	// CCTP Relayer???? etc/*.yaml ? Cctp ?
	if c.Cctp.Enabled {
		cctpRelayer = cctprelayer.NewRelayer(ctx.GormDB, c.Cctp)
		cctpRelayer.Start()
	}

	listenerCtx, listenerCancel := context.WithCancel(context.Background())
	defer listenerCancel()
	if c.ChainListener.Enable {
		go listener.RunPlatformConfigListener(listenerCtx, ctx)
		go listener.RunSwapListener(listenerCtx, ctx)
		go listener.RunPaymentListener(listenerCtx, ctx)
	}

	// ?? Swagger ??
	setupSwaggerRoutes(server)

	// ???????????
	sigChan := make(chan os.Signal, 1)
	// Windows ???? os.Interrupt (Ctrl+C)?Unix ???? SIGTERM
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	// ? goroutine ??? HTTP ??
	go func() {
		server.Start()
	}()

	// ??????
	<-sigChan
	log.Println("?????????????...")
	listenerCancel()
	if cctpRelayer != nil {
		cctpRelayer.Stop()
	}
	ctx.Stop()
	server.Stop()
	log.Println("?????")
}

// setupSwaggerRoutes ?? Swagger UI ????
func setupSwaggerRoutes(server *rest.Server) {
	// Swagger JSON ??
	server.AddRoute(rest.Route{
		Method: http.MethodGet,
		Path:   "/swagger.json",
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "swagger.json")
		}),
	})

	// ???????????
	staticHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Static handler called for: %s", r.URL.Path)

		// ??????
		if r.URL.Path == "/swagger-ui/" {
			log.Printf("Serving index.html for root path")
			http.ServeFile(w, r, "static/swagger-ui/index.html")
			return
		}

		// ??????
		if strings.HasPrefix(r.URL.Path, "/swagger-ui/") {
			// ????????????
			path := strings.TrimPrefix(r.URL.Path, "/swagger-ui/")
			log.Printf("Trimmed path: %s", path)

			// ??????????
			fullPath := filepath.Join("static", "swagger-ui", path)
			log.Printf("Full file path: %s", fullPath)

			// ?????????
			if _, err := os.Stat(fullPath); os.IsNotExist(err) {
				log.Printf("File does not exist: %s", fullPath)
				http.NotFound(w, r)
				return
			}

			// ??????
			log.Printf("Serving file: %s", fullPath)
			http.ServeFile(w, r, fullPath)
			return
		}

		http.NotFound(w, r)
	})

	// ????????????
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

	// ????????????
	server.AddRoute(rest.Route{
		Method:  http.MethodGet,
		Path:    "/swagger-ui/*filepath",
		Handler: staticHandler,
	})

	fmt.Println("Swagger UI:    http://localhost:8888/swagger-ui/")
	fmt.Println("Swagger JSON:  http://localhost:8888/swagger.json")
}
