package utils

import (
	"bytes"
	"encoding/json"
)

// PrettyJSON 格式化JSON字符串，去除转义斜杠
func PrettyJSON(data interface{}) (string, error) {
	// 将数据序列化为JSON
	jsonBytes, err := json.Marshal(data)
	if err != nil {
		return "", err
	}

	// 格式化JSON
	var prettyJSON bytes.Buffer
	err = json.Indent(&prettyJSON, jsonBytes, "", "  ")
	if err != nil {
		return "", err
	}

	return prettyJSON.String(), nil
}

// PrettyJSONBytes 格式化JSON字节数组
func PrettyJSONBytes(jsonBytes []byte) (string, error) {
	var prettyJSON bytes.Buffer
	err := json.Indent(&prettyJSON, jsonBytes, "", "  ")
	if err != nil {
		return "", err
	}

	return prettyJSON.String(), nil
}

// CompactJSON 压缩JSON字符串，去除不必要的空白
func CompactJSON(data interface{}) (string, error) {
	jsonBytes, err := json.Marshal(data)
	if err != nil {
		return "", err
	}

	var compactJSON bytes.Buffer
	err = json.Compact(&compactJSON, jsonBytes)
	if err != nil {
		return "", err
	}

	return compactJSON.String(), nil
}
