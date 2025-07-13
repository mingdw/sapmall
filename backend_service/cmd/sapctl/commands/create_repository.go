package commands

import (
	"fmt"
	"os"
	"strings"

	"github.com/spf13/cobra"
)

// newCreateRepositoryCommand 创建 repository 命令
func newCreateRepositoryCommand() *cobra.Command {
	var (
		tableName string
		fields    []string
		outputDir string
	)

	cmd := &cobra.Command{
		Use:   "repository [entity-name]",
		Short: "创建 repository 代码",
		Long: `创建完整的 repository 代码，包括：
- 数据模型定义
- Repository 接口和实现
- 基础的 CRUD 操作

示例:
  sapctl create repository user --table users --fields "id:int64:primary,username:string:required,email:string:unique"
  sapctl create repository product --table products --fields "id:int64:primary,name:string:required,price:float64,status:int"
  sapctl create repository category --table categories`,
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			entityName := args[0]

			// 解析字段
			parsedFields, err := parseFields(fields)
			if err != nil {
				return fmt.Errorf("解析字段失败: %v", err)
			}

			data := RepositoryData{
				ModuleName:      "sapphire-mall",
				EntityName:      strings.Title(entityName),
				EntityNameLower: strings.ToLower(entityName),
				TableName:       tableName,
				Fields:          parsedFields,
			}

			return generateRepository(data, outputDir)
		},
	}

	// 添加标志
	cmd.Flags().StringVarP(&tableName, "table", "t", "", "数据库表名")
	cmd.Flags().StringSliceVarP(&fields, "fields", "f", []string{}, "字段定义 (格式: name:type:tag，可选)")
	cmd.Flags().StringVarP(&outputDir, "output", "o", "app/internal", "输出目录")

	// 设置必需标志
	cmd.MarkFlagRequired("table")
	// 移除 fields 的必需标记

	return cmd
}

// generateRepository 生成 repository 代码
func generateRepository(data RepositoryData, outputDir string) error {
	// 确保输出目录存在
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("创建输出目录失败: %v", err)
	}

	// 生成模型文件
	if err := generateModel(data, outputDir); err != nil {
		return fmt.Errorf("生成模型失败: %v", err)
	}

	// 生成 repository 文件
	if err := generateRepositoryFile(data, outputDir); err != nil {
		return fmt.Errorf("生成 repository 失败: %v", err)
	}

	fmt.Printf("✅ 成功生成 %s repository 代码到 %s\n", data.EntityName, outputDir)
	return nil
}
