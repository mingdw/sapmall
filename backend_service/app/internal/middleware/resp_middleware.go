package middleware

import (
	"encoding/json"
	"net/http"

	consts "sapphire-mall/app/internal/const"
	"sapphire-mall/app/internal/response"
)

// UnifiedResponseMiddleware 统一响应中间件
type UnifiedResponseMiddleware struct {
}

// NewUnifiedResponseMiddleware 创建统一响应中间件实例
func NewUnifiedResponseMiddleware() *UnifiedResponseMiddleware {
	return &UnifiedResponseMiddleware{}
}

// Handle 处理统一响应中间件逻辑
func (m *UnifiedResponseMiddleware) Handle(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 创建统一响应拦截器
		interceptor := &unifiedResponseInterceptor{
			ResponseWriter: w,
			body:           []byte{},
			statusCode:     0,
			headers:        make(http.Header),

			isError:   false,
			errorCode: 0,
			errorMsg:  "",
		}

		// 调用下一个处理器
		next(interceptor, r)

		// 处理统一响应
		interceptor.processUnifiedResponse()
	}
}

// unifiedResponseInterceptor 统一响应拦截器
type unifiedResponseInterceptor struct {
	http.ResponseWriter
	body       []byte
	statusCode int
	headers    http.Header
	isError    bool
	errorCode  int
	errorMsg   string
}

func (r *unifiedResponseInterceptor) Write(b []byte) (int, error) {
	r.body = append(r.body, b...)
	return len(b), nil
}

func (r *unifiedResponseInterceptor) WriteHeader(statusCode int) {
	r.statusCode = statusCode
	// 检查是否为错误状态码
	if statusCode >= 400 {
		r.isError = true
		r.errorCode = r.getErrorCode()
		r.errorMsg = r.getErrorMessage()
	}
}

func (r *unifiedResponseInterceptor) Header() http.Header {
	if r.headers == nil {
		r.headers = make(http.Header)
	}
	return r.headers
}

// processUnifiedResponse 处理统一响应
func (r *unifiedResponseInterceptor) processUnifiedResponse() {

	// 如果已经设置了错误状态码，直接处理错误
	if r.isError {
		r.handleUnifiedError()
		return
	}

	// 检查响应内容
	if len(r.body) > 0 {
		// 首先尝试解析为原始数据
		var rawData interface{}
		if err := json.Unmarshal(r.body, &rawData); err == nil {
			// 成功解析为JSON，检查是否已经是标准格式
			if rawMap, ok := rawData.(map[string]interface{}); ok {
				// 检查是否包含标准响应字段
				if _, hasCode := rawMap["code"]; hasCode {
					// 尝试解析为标准格式
					var resp response.Response
					if err := json.Unmarshal(r.body, &resp); err == nil {
						if resp.Code != 0 {
							// 业务错误
							r.handleUnifiedError()
							return
						} else {
							// 成功响应，已经是标准格式
							r.writeUnifiedResponse(resp.Code, resp.Message, resp.Data)
							return
						}
					}
				} else {
					// 不包含标准字段，作为原始数据包装
					r.writeUnifiedResponse(consts.SUCCESS, "success", rawData)
					return
				}
			}
		} else {
			// 非JSON响应，作为字符串处理
			r.writeUnifiedResponse(consts.SUCCESS, "success", string(r.body))
			return
		}
	}

	r.writeUnifiedResponse(consts.SUCCESS, "success", nil)
}

// handleUnifiedError 处理统一错误响应
func (r *unifiedResponseInterceptor) handleUnifiedError() {
	// 如果响应体是JSON格式，尝试解析
	if len(r.body) > 0 {
		var resp response.Response
		if err := json.Unmarshal(r.body, &resp); err == nil {
			// 已经是标准格式，直接使用
			r.writeUnifiedResponse(resp.Code, resp.Message, resp.Data)
			return
		}
		// 不是标准json格式，直接将body内容作为msg返回
		msg := string(r.body)
		r.writeUnifiedResponse(consts.SYSTEM_ERROR, msg, map[string]interface{}{})
		return
	}
	// 没有body，返回默认系统错误
	r.writeUnifiedResponse(consts.SYSTEM_ERROR, consts.GetErrorMessage(consts.SYSTEM_ERROR), map[string]interface{}{})
}

// writeUnifiedResponse 写入统一响应格式
func (r *unifiedResponseInterceptor) writeUnifiedResponse(code int, msg string, data interface{}) {
	// 修改：只有当data为nil时才设置为空对象
	if data == nil {
		data = map[string]interface{}{}
	}
	// 确保message不为空
	if msg == "" {
		msg = "success"
	}
	unifiedResp := response.Response{
		Code:    code,
		Message: msg,
		Data:    data,
	}

	responseData, err := json.Marshal(unifiedResp)
	if err != nil {
		return
	}

	r.ResponseWriter.Header().Set("Content-Type", "application/json")
	r.ResponseWriter.WriteHeader(http.StatusOK)
	r.ResponseWriter.Write(responseData)
}

// getErrorCode 根据状态码获取错误码
func (r *unifiedResponseInterceptor) getErrorCode() int {
	switch r.statusCode {
	case 400:
		return consts.PARAM_ERROR
	case 401:
		return consts.AUTH_FAILED
	case 403:
		return consts.PERMISSION_DENIED
	case 404:
		return consts.RESOURCE_NOT_FOUND
	case 408:
		return consts.REQUEST_TIMEOUT
	case 429:
		return consts.RATE_LIMIT_EXCEEDED
	case 500:
		return consts.SYSTEM_ERROR
	case 502:
		return consts.SERVICE_UNAVAILABLE
	case 503:
		return consts.SERVICE_UNAVAILABLE
	case 504:
		return consts.REQUEST_TIMEOUT
	default:
		return consts.SYSTEM_ERROR
	}
}

// getErrorMessage 根据状态码获取错误消息
func (r *unifiedResponseInterceptor) getErrorMessage() string {
	return consts.GetErrorMessage(r.getErrorCode())
}

// ResponseHelper 响应辅助工具
type ResponseHelper struct {
	w http.ResponseWriter
}

// NewResponseHelper 创建响应辅助工具
func NewResponseHelper(w http.ResponseWriter) *ResponseHelper {
	return &ResponseHelper{w: w}
}

// Success 返回成功响应
func (h *ResponseHelper) Success(data interface{}) {
	// 如果data为nil，设置为空对象
	if data == nil {
		data = map[string]interface{}{}
	}

	response := response.Response{
		Code:    consts.SUCCESS,
		Message: "success",
		Data:    data,
	}

	responseData, _ := json.Marshal(response)
	h.w.Header().Set("Content-Type", "application/json")
	h.w.WriteHeader(http.StatusOK)
	h.w.Write(responseData)
}

// Error 返回错误响应
func (h *ResponseHelper) Error(code int, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}

	// 如果data为nil，设置为空对象
	if data == nil {
		data = map[string]interface{}{}
	}

	response := response.Response{
		Code:    code,
		Message: message,
		Data:    data,
	}

	responseData, _ := json.Marshal(response)
	h.w.Header().Set("Content-Type", "application/json")
	h.w.WriteHeader(http.StatusOK)
	h.w.Write(responseData)
}

// ParamError 返回参数错误响应
func (h *ResponseHelper) ParamError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.PARAM_ERROR)
	}
	h.Error(consts.PARAM_ERROR, message, nil)
}

// SystemError 返回系统错误响应
func (h *ResponseHelper) SystemError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.SYSTEM_ERROR)
	}
	h.Error(consts.SYSTEM_ERROR, message, nil)
}

// AuthError 返回认证错误响应
func (h *ResponseHelper) AuthError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.AUTH_FAILED)
	}
	h.Error(consts.AUTH_FAILED, message, nil)
}

// PermissionError 返回权限错误响应
func (h *ResponseHelper) PermissionError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.PERMISSION_DENIED)
	}
	h.Error(consts.PERMISSION_DENIED, message, nil)
}

// NotFoundError 返回资源不存在错误响应
func (h *ResponseHelper) NotFoundError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.RESOURCE_NOT_FOUND)
	}
	h.Error(consts.RESOURCE_NOT_FOUND, message, nil)
}

// DatabaseError 返回数据库错误响应
func (h *ResponseHelper) DatabaseError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.DATABASE_ERROR)
	}
	h.Error(consts.DATABASE_ERROR, message, nil)
}

// BusinessError 返回业务逻辑错误响应
func (h *ResponseHelper) BusinessError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.BUSINESS_LOGIC_ERROR)
	}
	h.Error(consts.BUSINESS_LOGIC_ERROR, message, nil)
}

// UserError 返回用户相关错误响应
func (h *ResponseHelper) UserError(code int, message string) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	h.Error(code, message, nil)
}

// MailError 返回邮件相关错误响应
func (h *ResponseHelper) MailError(code int, message string) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	h.Error(code, message, nil)
}

// FileError 返回文件相关错误响应
func (h *ResponseHelper) FileError(code int, message string) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	h.Error(code, message, nil)
}

// DataError 返回数据相关错误响应
func (h *ResponseHelper) DataError(code int, message string) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	h.Error(code, message, nil)
}

// GoZeroResponseHelper go-zero响应辅助工具
type GoZeroResponseHelper struct {
	w http.ResponseWriter
}

// NewGoZeroResponseHelper 创建go-zero响应辅助工具
func NewGoZeroResponseHelper(w http.ResponseWriter) *GoZeroResponseHelper {
	return &GoZeroResponseHelper{w: w}
}

// Success 返回成功响应
func (h *GoZeroResponseHelper) Success(data interface{}) {
	// 如果data为nil，设置为空对象
	if data == nil {
		data = map[string]interface{}{}
	}

	response := response.Response{
		Code:    consts.SUCCESS,
		Message: "success",
		Data:    data,
	}

	responseData, _ := json.Marshal(response)
	h.w.Header().Set("Content-Type", "application/json")
	h.w.WriteHeader(http.StatusOK)
	h.w.Write(responseData)
}

// Error 返回错误响应
func (h *GoZeroResponseHelper) Error(code int, message string, data interface{}) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}

	// 如果data为nil，设置为空对象
	if data == nil {
		data = map[string]interface{}{}
	}

	response := response.Response{
		Code:    code,
		Message: message,
		Data:    data,
	}

	responseData, _ := json.Marshal(response)
	h.w.Header().Set("Content-Type", "application/json")
	h.w.WriteHeader(http.StatusOK)
	h.w.Write(responseData)
}

// ParamError 返回参数错误响应
func (h *GoZeroResponseHelper) ParamError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.PARAM_ERROR)
	}
	h.Error(consts.PARAM_ERROR, message, nil)
}

// SystemError 返回系统错误响应
func (h *GoZeroResponseHelper) SystemError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.SYSTEM_ERROR)
	}
	h.Error(consts.SYSTEM_ERROR, message, nil)
}

// AuthError 返回认证错误响应
func (h *GoZeroResponseHelper) AuthError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.AUTH_FAILED)
	}
	h.Error(consts.AUTH_FAILED, message, nil)
}

// PermissionError 返回权限错误响应
func (h *GoZeroResponseHelper) PermissionError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.PERMISSION_DENIED)
	}
	h.Error(consts.PERMISSION_DENIED, message, nil)
}

// NotFoundError 返回资源不存在错误响应
func (h *GoZeroResponseHelper) NotFoundError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.RESOURCE_NOT_FOUND)
	}
	h.Error(consts.RESOURCE_NOT_FOUND, message, nil)
}

// DatabaseError 返回数据库错误响应
func (h *GoZeroResponseHelper) DatabaseError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.DATABASE_ERROR)
	}
	h.Error(consts.DATABASE_ERROR, message, nil)
}

// BusinessError 返回业务逻辑错误响应
func (h *GoZeroResponseHelper) BusinessError(message string) {
	if message == "" {
		message = consts.GetErrorMessage(consts.BUSINESS_LOGIC_ERROR)
	}
	h.Error(consts.BUSINESS_LOGIC_ERROR, message, nil)
}

// UserError 返回用户相关错误响应
func (h *GoZeroResponseHelper) UserError(code int, message string) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	h.Error(code, message, nil)
}

// MailError 返回邮件相关错误响应
func (h *GoZeroResponseHelper) MailError(code int, message string) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	h.Error(code, message, nil)
}

// FileError 返回文件相关错误响应
func (h *GoZeroResponseHelper) FileError(code int, message string) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	h.Error(code, message, nil)
}

// DataError 返回数据相关错误响应
func (h *GoZeroResponseHelper) DataError(code int, message string) {
	if message == "" {
		message = consts.GetErrorMessage(code)
	}
	h.Error(code, message, nil)
}
