package response

import (
	"errors"
	"net/http"
	consts "sapphire-mall/app/internal/const"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// HandleSuccess 处理成功响应
func HandleSuccess(ctx *gin.Context, data interface{}) {
	// 如果data为nil，设置为空对象
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    consts.SUCCESS,
		Message: "success",
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandleError 处理错误响应
func HandleError(ctx *gin.Context, httpCode int, err error, data interface{}) {
	// 如果data为nil，设置为空对象
	if data == nil {
		data = map[string]interface{}{}
	}

	// 获取错误码
	errorCode := getErrorCode(err)
	errorMessage := err.Error()

	// 如果错误码存在，使用预定义的消息
	if errorCode != 0 {
		errorMessage = consts.GetErrorMessage(errorCode)
	}

	resp := Response{
		Code:    errorCode,
		Message: errorMessage,
		Data:    data,
	}
	ctx.JSON(httpCode, resp)
}

// HandleDefaultError 处理默认错误响应
func HandleDefaultError(ctx *gin.Context, err error) {
	HandleError(ctx, http.StatusInternalServerError, err, nil)
}

// HandleParamError 处理参数错误
func HandleParamError(ctx *gin.Context, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(consts.PARAM_ERROR)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    consts.PARAM_ERROR,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandleAuthError 处理认证错误
func HandleAuthError(ctx *gin.Context, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(consts.AUTH_FAILED)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    consts.AUTH_FAILED,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandlePermissionError 处理权限错误
func HandlePermissionError(ctx *gin.Context, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(consts.PERMISSION_DENIED)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    consts.PERMISSION_DENIED,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandleNotFoundError 处理资源不存在错误
func HandleNotFoundError(ctx *gin.Context, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(consts.RESOURCE_NOT_FOUND)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    consts.RESOURCE_NOT_FOUND,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandleSystemError 处理系统错误
func HandleSystemError(ctx *gin.Context, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(consts.SYSTEM_ERROR)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    consts.SYSTEM_ERROR,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandleBusinessError 处理业务逻辑错误
func HandleBusinessError(ctx *gin.Context, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(consts.BUSINESS_LOGIC_ERROR)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    consts.BUSINESS_LOGIC_ERROR,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandleDatabaseError 处理数据库错误
func HandleDatabaseError(ctx *gin.Context, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(consts.DATABASE_ERROR)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    consts.DATABASE_ERROR,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandleUserError 处理用户相关错误
func HandleUserError(ctx *gin.Context, code int, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    code,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandleMailError 处理邮件相关错误
func HandleMailError(ctx *gin.Context, code int, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    code,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandleFileError 处理文件相关错误
func HandleFileError(ctx *gin.Context, code int, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    code,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// HandleDataError 处理数据相关错误
func HandleDataError(ctx *gin.Context, code int, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	if data == nil {
		data = map[string]interface{}{}
	}

	resp := Response{
		Code:    code,
		Message: message,
		Data:    data,
	}
	ctx.JSON(http.StatusOK, resp)
}

// Error 错误结构
type Error struct {
	Code    int
	Message string
}

func (e Error) Error() string {
	return e.Message
}

// 错误码映射表
var errorCodeMap = map[error]int{}

// newError 创建新的错误
func newError(code int, msg string) error {
	err := errors.New(msg)
	errorCodeMap[err] = code
	return err
}

// getErrorCode 获取错误码
func getErrorCode(err error) int {
	if code, exists := errorCodeMap[err]; exists {
		return code
	}
	return consts.SYSTEM_ERROR
}

// 预定义错误
var (
	ErrParamInvalid     = newError(consts.PARAM_ERROR, "参数无效")
	ErrAuthFailed       = newError(consts.AUTH_FAILED, "认证失败")
	ErrPermissionDenied = newError(consts.PERMISSION_DENIED, "权限不足")
	ErrResourceNotFound = newError(consts.RESOURCE_NOT_FOUND, "资源不存在")
	ErrSystemError      = newError(consts.SYSTEM_ERROR, "系统错误")
	ErrDatabaseError    = newError(consts.DATABASE_ERROR, "数据库错误")
	ErrBusinessError    = newError(consts.BUSINESS_LOGIC_ERROR, "业务逻辑错误")
	ErrUserNotFound     = newError(consts.USER_NOT_FOUND, "用户不存在")
	ErrUserExists       = newError(consts.USER_ALREADY_EXISTS, "用户已存在")
	ErrMailSendFailed   = newError(consts.MAIL_SEND_FAILED, "邮件发送失败")
	ErrFileNotFound     = newError(consts.FILE_NOT_FOUND, "文件不存在")
	ErrDataNotFound     = newError(consts.DATA_NOT_FOUND, "数据不存在")
)
