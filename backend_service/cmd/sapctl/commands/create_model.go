package commands

import (
	"fmt"
	"strings"

	"github.com/spf13/cobra"
)

// newCreateModelCommand 创建 model 命令
func newCreateModelCommand() *cobra.Command {
	var (
		tableName string
		fields    []string
		outputDir string
	)

	cmd := &cobra.Command{
		Use:   "model [model-name]",
		Short: "创建数据模型",
		Long: `创建 GORM 数据模型，包括：
- 结构体定义
- 表名映射
- 字段标签
- 时间戳字段

示例:
  sapctl create model user --table users --fields "id:int64:primary,username:string:required,email:string:unique"
  sapctl create model product --table products --fields "id:int64:primary,name:string:required,price:float64,status:int"`,
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			modelName := args[0]

			parsedFields, err := parseFields(fields)
			if err != nil {
				return fmt.Errorf("解析字段失败: %v", err)
			}

			data := RepositoryData{
				ModuleName:      "sapphire-mall",
				EntityName:      strings.Title(modelName),
				EntityNameLower: strings.ToLower(modelName),
				TableName:       tableName,
				Fields:          parsedFields,
			}

			return generateModelOnly(data, outputDir)
		},
	}

	cmd.Flags().StringVarP(&tableName, "table", "t", "", "数据库表名")
	cmd.Flags().StringSliceVarP(&fields, "fields", "f", []string{}, "字段定义 (可选)")
	cmd.Flags().StringVarP(&outputDir, "output", "o", "app/internal/model", "输出目录")

	cmd.MarkFlagRequired("table")

	return cmd
}
