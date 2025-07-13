package commands

import (
	"fmt"

	"github.com/spf13/cobra"
)

var (
	// 全局配置
	verbose bool
)

type RepositoryData struct {
	ModuleName      string
	EntityName      string
	EntityNameLower string
	TableName       string
	Fields          []Field
}

type Field struct {
	Name       string
	Type       string
	Tag        string
	Comment    string
	IsRequired bool
	IsUnique   bool
	IsPrimary  bool
}

// NewSapctlApp 创建主应用
func NewSapctlApp() *cobra.Command {
	rootCmd := &cobra.Command{
		Use:   "sapctl",
		Short: "Sapphire Mall 代码生成工具",
		Long: `Sapphire Mall 代码生成工具 (sapctl)
		
一个用于快速生成 Sapphire Mall 项目代码的命令行工具。
支持生成 model 和 repository 层代码。`,
		Version: "1.0.0",
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			if verbose {
				fmt.Println("启用详细模式")
			}
		},
	}

	// 全局标志
	rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "详细输出")

	// 添加子命令
	rootCmd.AddCommand(
		newCreateCommand(),
	)

	return rootCmd
}

// newCreateCommand 创建 create 命令
func newCreateCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create",
		Short: "创建新的代码模块",
		Long: `创建新的代码模块，支持以下类型：
- repository: 创建数据访问层代码
- model: 创建数据模型`,
	}

	cmd.AddCommand(
		newCreateRepositoryCommand(),
		newCreateModelCommand(),
	)

	return cmd
}
