package commands

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"
)

type hardhatArtifact struct {
	ABI      json.RawMessage `json:"abi"`
	Bytecode string          `json:"bytecode"`
}

func newContractGenGoCommand() *cobra.Command {
	var (
		artifactPath string
		outPath      string
		pkgName      string
		typeName     string
		abigenPath   string
		keepTemp     bool
		force        bool
		abiOutPath   string
		binOutPath   string
	)

	cmd := &cobra.Command{
		Use:   "gen-go",
		Short: "从 Hardhat artifact 生成 Go 合约绑定代码",
		Long: `从 Hardhat artifact 生成 Go 合约绑定代码。

示例:
  sapctl contract gen-go --artifact ./app/internal/abi/json/PlatformConfig.json --out ./bin/platform_config.go --pkg platformconfig --type PlatformConfig
  sapctl contract gen-go --artifact ./app/internal/abi/json/PlatformConfig.json --out ./bin/platform_config.go --pkg platformconfig --type PlatformConfig --force --keep-temp`,
		RunE: func(cmd *cobra.Command, args []string) error {
			if strings.TrimSpace(abigenPath) == "" {
				abigenPath = "abigen"
			}
			return runContractGenGo(contractGenGoInput{
				ArtifactPath: artifactPath,
				OutPath:      outPath,
				PkgName:      pkgName,
				TypeName:     typeName,
				AbigenPath:   abigenPath,
				KeepTemp:     keepTemp,
				Force:        force,
				ABIOutPath:   abiOutPath,
				BinOutPath:   binOutPath,
			})
		},
	}

	cmd.Flags().StringVar(&artifactPath, "artifact", "", "Hardhat artifact 文件路径（必填）")
	cmd.Flags().StringVar(&outPath, "out", "", "输出 Go 文件路径（必填）")
	cmd.Flags().StringVar(&pkgName, "pkg", "", "Go package 名（必填）")
	cmd.Flags().StringVar(&typeName, "type", "", "Go 类型名（必填）")
	cmd.Flags().StringVar(&abigenPath, "abigen", "abigen", "abigen 可执行文件路径")
	cmd.Flags().BoolVar(&keepTemp, "keep-temp", false, "保留中间 abi/bin 文件")
	cmd.Flags().BoolVar(&force, "force", false, "覆盖已存在的输出文件")
	cmd.Flags().StringVar(&abiOutPath, "abi-out", "", "导出的 abi 文件路径（可选）")
	cmd.Flags().StringVar(&binOutPath, "bin-out", "", "导出的 bin 文件路径（可选）")

	_ = cmd.MarkFlagRequired("artifact")
	_ = cmd.MarkFlagRequired("out")
	_ = cmd.MarkFlagRequired("pkg")
	_ = cmd.MarkFlagRequired("type")

	return cmd
}

type contractGenGoInput struct {
	ArtifactPath string
	OutPath      string
	PkgName      string
	TypeName     string
	AbigenPath   string
	KeepTemp     bool
	Force        bool
	ABIOutPath   string
	BinOutPath   string
}

func runContractGenGo(input contractGenGoInput) error {
	artifactAbs, err := filepath.Abs(input.ArtifactPath)
	if err != nil {
		return fmt.Errorf("解析 artifact 路径失败: %w", err)
	}
	data, err := os.ReadFile(artifactAbs)
	if err != nil {
		return fmt.Errorf("读取 artifact 失败: %w", err)
	}

	var artifact hardhatArtifact
	if err = json.Unmarshal(data, &artifact); err != nil {
		return fmt.Errorf("解析 artifact json 失败: %w", err)
	}
	if len(artifact.ABI) == 0 || string(artifact.ABI) == "null" {
		return fmt.Errorf("artifact 缺少 abi 字段")
	}
	bytecode := strings.TrimPrefix(strings.TrimSpace(artifact.Bytecode), "0x")
	if bytecode == "" {
		return fmt.Errorf("artifact 缺少 bytecode 字段")
	}

	outAbs, err := filepath.Abs(input.OutPath)
	if err != nil {
		return fmt.Errorf("解析输出路径失败: %w", err)
	}
	if _, err = os.Stat(outAbs); err == nil && !input.Force {
		return fmt.Errorf("输出文件已存在: %s（可使用 --force 覆盖）", outAbs)
	}
	if err = os.MkdirAll(filepath.Dir(outAbs), 0o755); err != nil {
		return fmt.Errorf("创建输出目录失败: %w", err)
	}

	artifactBase := strings.TrimSuffix(filepath.Base(artifactAbs), filepath.Ext(artifactAbs))
	abiPath := input.ABIOutPath
	if strings.TrimSpace(abiPath) == "" {
		abiPath = filepath.Join(filepath.Dir(outAbs), artifactBase+".abi.json")
	}
	binPath := input.BinOutPath
	if strings.TrimSpace(binPath) == "" {
		binPath = filepath.Join(filepath.Dir(outAbs), artifactBase+".bin")
	}

	abiAbs, err := filepath.Abs(abiPath)
	if err != nil {
		return fmt.Errorf("解析 abi 输出路径失败: %w", err)
	}
	binAbs, err := filepath.Abs(binPath)
	if err != nil {
		return fmt.Errorf("解析 bin 输出路径失败: %w", err)
	}
	if err = os.MkdirAll(filepath.Dir(abiAbs), 0o755); err != nil {
		return fmt.Errorf("创建 abi 输出目录失败: %w", err)
	}
	if err = os.MkdirAll(filepath.Dir(binAbs), 0o755); err != nil {
		return fmt.Errorf("创建 bin 输出目录失败: %w", err)
	}

	if err = os.WriteFile(abiAbs, artifact.ABI, 0o644); err != nil {
		return fmt.Errorf("写入 abi 文件失败: %w", err)
	}
	if err = os.WriteFile(binAbs, []byte(bytecode), 0o644); err != nil {
		return fmt.Errorf("写入 bin 文件失败: %w", err)
	}

	cmd := exec.Command(input.AbigenPath,
		"--abi", abiAbs,
		"--bin", binAbs,
		"--pkg", input.PkgName,
		"--type", input.TypeName,
		"--out", outAbs,
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err = cmd.Run(); err != nil {
		return fmt.Errorf("执行 abigen 失败: %w", err)
	}

	if !input.KeepTemp {
		_ = os.Remove(abiAbs)
		_ = os.Remove(binAbs)
	}

	fmt.Printf("✅ 生成成功: %s\n", outAbs)
	return nil
}
