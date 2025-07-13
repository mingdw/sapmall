package main

import (
	"os"

	"sapphire-mall/cmd/sapctl/commands"
)

func main() {
	app := commands.NewSapctlApp()
	if err := app.Execute(); err != nil {
		os.Exit(1)
	}
}
