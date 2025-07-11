package handler

import (
	"encoding/json"
	"net/http"

	consts "sapphire-mall/app/internal/const"
	"sapphire-mall/app/internal/middleware"
	"sapphire-mall/app/internal/svc"
)

// UnifiedResponseExampleHandler 统一响应示例处理器
type UnifiedResponseExampleHandler struct {
	svcCtx *svc.ServiceContext
}

// NewUnifiedResponseExampleHandler 创建统一响应示例处理器
func NewUnifiedResponseExampleHandler(svcCtx *svc.ServiceContext) *UnifiedResponseExampleHandler {
	return &UnifiedResponseExampleHandler{
		svcCtx: svcCtx,
	}
}

// Handle 处理统一响应示例
func (h *UnifiedResponseExampleHandler) Handle(w http.ResponseWriter, r *http.Request) {
	helper := middleware.NewResponseHelper(w)
	responseType := r.URL.Query().Get("type")

	switch responseType {
	case "success":
		// 成功响应 - 使用ResponseHelper
		helper.Success(map[string]interface{}{
			"user_id":    12345,
			"username":   "test_user",
			"email":      "test@example.com",
			"created_at": "2024-01-01T00:00:00Z",
		})
	case "success_raw":
		// 成功响应 - 直接写入JSON
		successResp := map[string]interface{}{
			"code":    0,
			"message": "success",
			"data": map[string]interface{}{
				"message": "操作成功",
				"data":    "正常数据",
			},
		}
		responseData, _ := json.Marshal(successResp)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseData)
	case "success_text":
		// 成功响应 - 纯文本
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("操作成功"))
	case "success_empty":
		// 成功响应 - 空响应
		w.WriteHeader(http.StatusOK)
	case "error_param":
		// 参数错误 - 使用ResponseHelper
		helper.ParamError("邮箱格式不正确")
	case "error_auth":
		// 认证错误 - 使用ResponseHelper
		helper.AuthError("用户未登录或令牌已过期")
	case "error_permission":
		// 权限错误 - 使用ResponseHelper
		helper.PermissionError("当前用户权限不足")
	case "error_not_found":
		// 资源不存在 - 使用ResponseHelper
		helper.NotFoundError("用户不存在")
	case "error_system":
		// 系统错误 - 使用ResponseHelper
		helper.SystemError("服务器内部错误")
	case "error_business":
		// 业务错误 - 使用ResponseHelper
		helper.BusinessError("用户已存在")
	case "error_custom":
		// 自定义错误 - 使用ResponseHelper
		helper.Error(consts.THIRD_PARTY_ERROR, "第三方服务调用失败", map[string]interface{}{
			"service": "payment_gateway",
			"reason":  "connection_timeout",
		})
	case "error_json":
		// 错误响应 - 直接写入JSON
		errorResp := map[string]interface{}{
			"code":    consts.PARAM_ERROR,
			"message": "参数验证失败",
			"data": map[string]interface{}{
				"field":   "email",
				"message": "邮箱格式不正确",
			},
		}
		responseData, _ := json.Marshal(errorResp)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseData)
	case "error_http_400":
		// HTTP 400错误
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Bad Request"))
	case "error_http_401":
		// HTTP 401错误
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Unauthorized"))
	case "error_http_404":
		// HTTP 404错误
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Not Found"))
	case "error_http_500":
		// HTTP 500错误
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
	case "error_mixed":
		// 混合错误 - HTTP状态码 + JSON错误
		errorResp := map[string]interface{}{
			"code":    consts.PARAM_ERROR,
			"message": "参数验证失败",
			"data":    nil,
		}
		responseData, _ := json.Marshal(errorResp)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(responseData)
	case "user_error":
		// 用户相关错误
		helper.UserError(consts.USER_ALREADY_EXISTS, "用户已存在")
	case "mail_error":
		// 邮件相关错误
		helper.MailError(consts.MAIL_SEND_FAILED, "邮件发送失败")
	case "file_error":
		// 文件相关错误
		helper.FileError(consts.FILE_TOO_LARGE, "文件大小超过限制")
	case "data_error":
		// 数据相关错误
		helper.DataError(consts.DATA_NOT_FOUND, "数据不存在")
	default:
		// 默认成功响应
		helper.Success(map[string]interface{}{
			"message": "默认响应",
			"type":    responseType,
		})
	}
}

// HTTPStatusExampleHandler HTTP状态码示例处理器
type HTTPStatusExampleHandler struct {
	svcCtx *svc.ServiceContext
}

// NewHTTPStatusExampleHandler 创建HTTP状态码示例处理器
func NewHTTPStatusExampleHandler(svcCtx *svc.ServiceContext) *HTTPStatusExampleHandler {
	return &HTTPStatusExampleHandler{
		svcCtx: svcCtx,
	}
}

// Handle 处理HTTP状态码示例
func (h *HTTPStatusExampleHandler) Handle(w http.ResponseWriter, r *http.Request) {
	statusCode := r.URL.Query().Get("code")

	switch statusCode {
	case "200":
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("正常响应"))
	case "400":
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("参数错误"))
	case "401":
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("未授权访问"))
	case "403":
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("权限不足"))
	case "404":
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("资源不存在"))
	case "408":
		w.WriteHeader(http.StatusRequestTimeout)
		w.Write([]byte("请求超时"))
	case "429":
		w.WriteHeader(http.StatusTooManyRequests)
		w.Write([]byte("请求频率超限"))
	case "500":
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("服务器内部错误"))
	case "502":
		w.WriteHeader(http.StatusBadGateway)
		w.Write([]byte("网关错误"))
	case "503":
		w.WriteHeader(http.StatusServiceUnavailable)
		w.Write([]byte("服务不可用"))
	case "504":
		w.WriteHeader(http.StatusGatewayTimeout)
		w.Write([]byte("网关超时"))
	default:
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("正常响应"))
	}
}

// JSONResponseExampleHandler JSON响应示例处理器
type JSONResponseExampleHandler struct {
	svcCtx *svc.ServiceContext
}

// NewJSONResponseExampleHandler 创建JSON响应示例处理器
func NewJSONResponseExampleHandler(svcCtx *svc.ServiceContext) *JSONResponseExampleHandler {
	return &JSONResponseExampleHandler{
		svcCtx: svcCtx,
	}
}

// Handle 处理JSON响应示例
func (h *JSONResponseExampleHandler) Handle(w http.ResponseWriter, r *http.Request) {
	responseType := r.URL.Query().Get("type")

	switch responseType {
	case "success":
		// 成功JSON响应
		successResp := map[string]interface{}{
			"code":    0,
			"message": "success",
			"data": map[string]interface{}{
				"user_id":  12345,
				"username": "test_user",
				"email":    "test@example.com",
			},
		}
		responseData, _ := json.Marshal(successResp)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseData)
	case "error":
		// 错误JSON响应
		errorResp := map[string]interface{}{
			"code":    consts.PARAM_ERROR,
			"message": "参数验证失败",
			"data": map[string]interface{}{
				"field":   "email",
				"message": "邮箱格式不正确",
			},
		}
		responseData, _ := json.Marshal(errorResp)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseData)
	case "business_error":
		// 业务错误JSON响应
		errorResp := map[string]interface{}{
			"code":    consts.BUSINESS_LOGIC_ERROR,
			"message": "业务逻辑错误",
			"data": map[string]interface{}{
				"error_code": "USER_EXISTS",
				"message":    "用户已存在",
			},
		}
		responseData, _ := json.Marshal(errorResp)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseData)
	case "user_error":
		// 用户错误JSON响应
		errorResp := map[string]interface{}{
			"code":    consts.USER_NOT_FOUND,
			"message": "用户不存在",
			"data":    nil,
		}
		responseData, _ := json.Marshal(errorResp)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseData)
	case "mail_error":
		// 邮件错误JSON响应
		errorResp := map[string]interface{}{
			"code":    consts.MAIL_SEND_FAILED,
			"message": "邮件发送失败",
			"data": map[string]interface{}{
				"recipient": "user@example.com",
				"reason":    "SMTP连接失败",
			},
		}
		responseData, _ := json.Marshal(errorResp)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseData)
	default:
		// 默认成功响应
		successResp := map[string]interface{}{
			"code":    0,
			"message": "success",
			"data": map[string]interface{}{
				"message": "默认响应",
				"type":    responseType,
			},
		}
		responseData, _ := json.Marshal(successResp)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseData)
	}
}
