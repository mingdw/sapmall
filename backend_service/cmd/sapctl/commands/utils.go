package commands

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"text/template"
)

// parseFields 解析字段定义
func parseFields(fieldDefs []string) ([]Field, error) {
	var fields []Field

	// 添加默认字段
	defaultFields := []Field{
		{Name: "ID", Type: "int64", Tag: "primaryKey", Comment: "主键ID", IsPrimary: true},
		{Name: "CreateAt", Type: "time.Time", Tag: "autoCreateTime", Comment: "创建时间"},
		{Name: "UpdateAt", Type: "time.Time", Tag: "autoUpdateTime", Comment: "更新时间"},
		{Name: "IsDeleted", Type: "bool", Tag: "default:false", Comment: "软删除标记"},
		{Name: "Creator", Type: "string", Tag: "", Comment: "创建人"},
		{Name: "Updator", Type: "string", Tag: "", Comment: "更新人"},
	}

	// 先添加默认字段
	fields = append(fields, defaultFields...)

	// 解析用户自定义字段
	for _, def := range fieldDefs {
		if def == "" {
			continue
		}

		parts := strings.Split(def, ":")
		if len(parts) < 2 {
			return nil, fmt.Errorf("字段定义格式错误: %s", def)
		}

		field := Field{
			Name: parts[0],
			Type: parts[1],
		}

		// 解析标签
		if len(parts) > 2 {
			field.Tag = parts[2]
			switch field.Tag {
			case "required":
				field.IsRequired = true
			case "unique":
				field.IsUnique = true
			case "primary":
				field.IsPrimary = true
			}
		}

		// 生成注释
		field.Comment = fmt.Sprintf("%s 字段", field.Name)

		fields = append(fields, field)
	}

	return fields, nil
}

// generateModel 生成模型文件
func generateModel(data RepositoryData, outputDir string) error {
	modelDir := filepath.Join(outputDir, "model")
	if err := os.MkdirAll(modelDir, 0755); err != nil {
		return err
	}

	modelFile := filepath.Join(modelDir, fmt.Sprintf("%s.go", data.EntityNameLower))

	tmpl := `package model

import (
	"time"
	"gorm.io/gorm"
)

// {{.EntityName}} {{.EntityName}} 模型
type {{.EntityName}} struct {
{{range .Fields}}	{{.Name}} {{.Type}} ` + "`" + `json:"{{.Name | lower}}" gorm:"{{.Tag}}"` + "`" + ` // {{.Comment}}
{{end}}	DeletedAt gorm.DeletedAt ` + "`" + `json:"deleted_at" gorm:"index"` + "`" + `
}

// TableName 指定表名
func ({{.EntityName}}) TableName() string {
	return "{{.TableName}}"
}
`

	t, err := template.New("model").Funcs(template.FuncMap{
		"lower": strings.ToLower,
	}).Parse(tmpl)
	if err != nil {
		return err
	}

	file, err := os.Create(modelFile)
	if err != nil {
		return err
	}
	defer file.Close()

	return t.Execute(file, data)
}

// generateRepositoryFile 生成 repository 实现文件
func generateRepositoryFile(data RepositoryData, outputDir string) error {
	repoDir := filepath.Join(outputDir, "repository")
	if err := os.MkdirAll(repoDir, 0755); err != nil {
		return err
	}

	repoFile := filepath.Join(repoDir, fmt.Sprintf("%s.go", data.EntityNameLower))

	tmpl := `package repository

import (
	"context"
	"{{.ModuleName}}/app/internal/model"
	"gorm.io/gorm"
)

// {{.EntityName}}Repository {{.EntityName}} 数据访问接口
type {{.EntityName}}Repository interface {
	Create(ctx context.Context, {{.EntityNameLower}} *model.{{.EntityName}}) error
	GetByID(ctx context.Context, id int64) (*model.{{.EntityName}}, error)
{{range .Fields}}{{if .IsUnique}}	GetBy{{.Name}}(ctx context.Context, {{.Name | lower}} {{.Type}}) (*model.{{.EntityName}}, error)
{{end}}{{end}}	Update(ctx context.Context, {{.EntityNameLower}} *model.{{.EntityName}}) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, offset, limit int) ([]*model.{{.EntityName}}, int64, error)
}

// {{.EntityNameLower}}Repository {{.EntityName}} 数据访问实现
type {{.EntityNameLower}}Repository struct {
	db *gorm.DB
}

// New{{.EntityName}}Repository 创建 {{.EntityName}} repository
func New{{.EntityName}}Repository(db *gorm.DB) {{.EntityName}}Repository {
	return &{{.EntityNameLower}}Repository{db: db}
}

// Create 创建 {{.EntityName}}
func (r *{{.EntityNameLower}}Repository) Create(ctx context.Context, {{.EntityNameLower}} *model.{{.EntityName}}) error {
	return r.db.WithContext(ctx).Create({{.EntityNameLower}}).Error
}

// GetByID 根据ID获取 {{.EntityName}}
func (r *{{.EntityNameLower}}Repository) GetByID(ctx context.Context, id int64) (*model.{{.EntityName}}, error) {
	var {{.EntityNameLower}} model.{{.EntityName}}
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&{{.EntityNameLower}}).Error
	if err != nil {
		return nil, err
	}
	return &{{.EntityNameLower}}, nil
}

{{range .Fields}}{{if .IsUnique}}// GetBy{{.Name}} 根据{{.Name}}获取 {{.EntityName}}
func (r *{{.EntityNameLower}}Repository) GetBy{{.Name}}(ctx context.Context, {{.Name | lower}} {{.Type}}) (*model.{{.EntityName}}, error) {
	var {{.EntityNameLower}} model.{{.EntityName}}
	err := r.db.WithContext(ctx).Where("{{.Name | lower}} = ?", {{.Name | lower}}).First(&{{.EntityNameLower}}).Error
	if err != nil {
		return nil, err
	}
	return &{{.EntityNameLower}}, nil
}

{{end}}{{end}}// Update 更新 {{.EntityName}}
func (r *{{.EntityNameLower}}Repository) Update(ctx context.Context, {{.EntityNameLower}} *model.{{.EntityName}}) error {
	return r.db.WithContext(ctx).Save({{.EntityNameLower}}).Error
}

// Delete 删除 {{.EntityName}}
func (r *{{.EntityNameLower}}Repository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.{{.EntityName}}{}).Error
}

// List 获取 {{.EntityName}} 列表
func (r *{{.EntityNameLower}}Repository) List(ctx context.Context, offset, limit int) ([]*model.{{.EntityName}}, int64, error) {
	var {{.EntityNameLower}}s []*model.{{.EntityName}}
	var total int64
	
	// 获取总数
	if err := r.db.WithContext(ctx).Model(&model.{{.EntityName}}{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	
	// 获取列表
	if err := r.db.WithContext(ctx).Offset(offset).Limit(limit).Find(&{{.EntityNameLower}}s).Error; err != nil {
		return nil, 0, err
	}
	
	return {{.EntityNameLower}}s, total, nil
}
`

	t, err := template.New("repository").Funcs(template.FuncMap{
		"lower": strings.ToLower,
	}).Parse(tmpl)
	if err != nil {
		return err
	}

	file, err := os.Create(repoFile)
	if err != nil {
		return err
	}
	defer file.Close()

	return t.Execute(file, data)
}

// generateModelOnly 仅生成模型文件
func generateModelOnly(data RepositoryData, outputDir string) error {
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return err
	}

	modelFile := filepath.Join(outputDir, fmt.Sprintf("%s.go", data.EntityNameLower))

	tmpl := `package model

import (
	"time"
	"gorm.io/gorm"
)

// {{.EntityName}} {{.EntityName}} 模型
type {{.EntityName}} struct {
{{range .Fields}}	{{.Name}} {{.Type}} ` + "`" + `json:"{{.Name | lower}}" gorm:"{{.Tag}}"` + "`" + ` // {{.Comment}}
{{end}}	DeletedAt gorm.DeletedAt ` + "`" + `json:"deleted_at" gorm:"index"` + "`" + `
}

// TableName 指定表名
func ({{.EntityName}}) TableName() string {
	return "{{.TableName}}"
}
`

	t, err := template.New("model").Funcs(template.FuncMap{
		"lower": strings.ToLower,
	}).Parse(tmpl)
	if err != nil {
		return err
	}

	file, err := os.Create(modelFile)
	if err != nil {
		return err
	}
	defer file.Close()

	if err := t.Execute(file, data); err != nil {
		return err
	}

	fmt.Printf("✅ 成功生成 %s 模型到 %s\n", data.EntityName, modelFile)
	return nil
}
