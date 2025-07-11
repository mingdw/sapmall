package consts

// 基础错误码定义
const (
	// 成功
	SUCCESS = 0

	// 系统错误 (10000-10099)
	SYSTEM_ERROR          = 10000
	PARAM_ERROR           = 10001
	AUTH_FAILED           = 10002
	PERMISSION_DENIED     = 10003
	RESOURCE_NOT_FOUND    = 10004
	REQUEST_TIMEOUT       = 10005
	SERVICE_UNAVAILABLE   = 10006
	DATABASE_ERROR        = 10007
	CACHE_ERROR           = 10008
	NETWORK_ERROR         = 10009
	FILE_UPLOAD_ERROR     = 10010
	FILE_DOWNLOAD_ERROR   = 10011
	DATA_FORMAT_ERROR     = 10012
	BUSINESS_LOGIC_ERROR  = 10013
	CONFIG_ERROR          = 10014
	THIRD_PARTY_ERROR     = 10015
	VALIDATION_ERROR      = 10016
	ENCRYPTION_ERROR      = 10017
	DECRYPTION_ERROR      = 10018
	TOKEN_EXPIRED         = 10019
	TOKEN_INVALID         = 10020
	RATE_LIMIT_EXCEEDED   = 10021
	QUOTA_EXCEEDED        = 10022
	MAINTENANCE_MODE      = 10023
	VERSION_NOT_SUPPORTED = 10024
	FEATURE_NOT_AVAILABLE = 10025
)

// 业务错误码 (20000-29999)
const (
	// 用户相关错误 (20000-20099)
	USER_NOT_FOUND            = 20000
	USER_ALREADY_EXISTS       = 20001
	USER_DISABLED             = 20002
	USER_LOCKED               = 20003
	PASSWORD_INCORRECT        = 20004
	PASSWORD_TOO_WEAK         = 20005
	EMAIL_ALREADY_EXISTS      = 20006
	PHONE_ALREADY_EXISTS      = 20007
	VERIFICATION_CODE_INVALID = 20008
	VERIFICATION_CODE_EXPIRED = 20009
	LOGIN_TOO_FREQUENT        = 20010
	ACCOUNT_SUSPENDED         = 20011

	// 邮件相关错误 (20100-20199)
	MAIL_SEND_FAILED          = 20100
	MAIL_TEMPLATE_NOT_FOUND   = 20101
	MAIL_RECIPIENT_INVALID    = 20102
	MAIL_ATTACHMENT_TOO_LARGE = 20103
	MAIL_RATE_LIMIT_EXCEEDED  = 20104
	MAIL_SERVICE_UNAVAILABLE  = 20105
	MAIL_CONTENT_INVALID      = 20106
	MAIL_SUBJECT_TOO_LONG     = 20107

	// 文件相关错误 (20200-20299)
	FILE_NOT_FOUND         = 20200
	FILE_TOO_LARGE         = 20201
	FILE_TYPE_NOT_ALLOWED  = 20202
	FILE_CORRUPTED         = 20203
	FILE_UPLOAD_INCOMPLETE = 20204
	FILE_DELETE_FAILED     = 20205
	FILE_RENAME_FAILED     = 20206
	FILE_COPY_FAILED       = 20207
	FILE_MOVE_FAILED       = 20208

	// 数据相关错误 (20300-20399)
	DATA_NOT_FOUND      = 20300
	DATA_ALREADY_EXISTS = 20301
	DATA_INVALID        = 20302
	DATA_CORRUPTED      = 20303
	DATA_EXPORT_FAILED  = 20304
	DATA_IMPORT_FAILED  = 20305
	DATA_BACKUP_FAILED  = 20306
	DATA_RESTORE_FAILED = 20307
	DATA_SYNC_FAILED    = 20308
)

// 错误码对应的消息
var ErrorMessages = map[int]string{
	SUCCESS:               "成功",
	SYSTEM_ERROR:          "系统错误",
	PARAM_ERROR:           "参数错误",
	AUTH_FAILED:           "认证失败",
	PERMISSION_DENIED:     "权限不足",
	RESOURCE_NOT_FOUND:    "资源不存在",
	REQUEST_TIMEOUT:       "请求超时",
	SERVICE_UNAVAILABLE:   "服务不可用",
	DATABASE_ERROR:        "数据库错误",
	CACHE_ERROR:           "缓存错误",
	NETWORK_ERROR:         "网络错误",
	FILE_UPLOAD_ERROR:     "文件上传失败",
	FILE_DOWNLOAD_ERROR:   "文件下载失败",
	DATA_FORMAT_ERROR:     "数据格式错误",
	BUSINESS_LOGIC_ERROR:  "业务逻辑错误",
	CONFIG_ERROR:          "配置错误",
	THIRD_PARTY_ERROR:     "第三方服务调用失败",
	VALIDATION_ERROR:      "数据验证失败",
	ENCRYPTION_ERROR:      "加密失败",
	DECRYPTION_ERROR:      "解密失败",
	TOKEN_EXPIRED:         "令牌已过期",
	TOKEN_INVALID:         "令牌无效",
	RATE_LIMIT_EXCEEDED:   "请求频率超限",
	QUOTA_EXCEEDED:        "配额已用完",
	MAINTENANCE_MODE:      "系统维护中",
	VERSION_NOT_SUPPORTED: "版本不支持",
	FEATURE_NOT_AVAILABLE: "功能不可用",

	// 用户相关错误消息
	USER_NOT_FOUND:            "用户不存在",
	USER_ALREADY_EXISTS:       "用户已存在",
	USER_DISABLED:             "用户已被禁用",
	USER_LOCKED:               "用户已被锁定",
	PASSWORD_INCORRECT:        "密码错误",
	PASSWORD_TOO_WEAK:         "密码强度不足",
	EMAIL_ALREADY_EXISTS:      "邮箱已被注册",
	PHONE_ALREADY_EXISTS:      "手机号已被注册",
	VERIFICATION_CODE_INVALID: "验证码错误",
	VERIFICATION_CODE_EXPIRED: "验证码已过期",
	LOGIN_TOO_FREQUENT:        "登录过于频繁",
	ACCOUNT_SUSPENDED:         "账户已被暂停",

	// 邮件相关错误消息
	MAIL_SEND_FAILED:          "邮件发送失败",
	MAIL_TEMPLATE_NOT_FOUND:   "邮件模板不存在",
	MAIL_RECIPIENT_INVALID:    "收件人地址无效",
	MAIL_ATTACHMENT_TOO_LARGE: "邮件附件过大",
	MAIL_RATE_LIMIT_EXCEEDED:  "邮件发送频率超限",
	MAIL_SERVICE_UNAVAILABLE:  "邮件服务不可用",
	MAIL_CONTENT_INVALID:      "邮件内容无效",
	MAIL_SUBJECT_TOO_LONG:     "邮件主题过长",

	// 文件相关错误消息
	FILE_NOT_FOUND:         "文件不存在",
	FILE_TOO_LARGE:         "文件过大",
	FILE_TYPE_NOT_ALLOWED:  "文件类型不允许",
	FILE_CORRUPTED:         "文件已损坏",
	FILE_UPLOAD_INCOMPLETE: "文件上传不完整",
	FILE_DELETE_FAILED:     "文件删除失败",
	FILE_RENAME_FAILED:     "文件重命名失败",
	FILE_COPY_FAILED:       "文件复制失败",
	FILE_MOVE_FAILED:       "文件移动失败",

	// 数据相关错误消息
	DATA_NOT_FOUND:      "数据不存在",
	DATA_ALREADY_EXISTS: "数据已存在",
	DATA_INVALID:        "数据无效",
	DATA_CORRUPTED:      "数据已损坏",
	DATA_EXPORT_FAILED:  "数据导出失败",
	DATA_IMPORT_FAILED:  "数据导入失败",
	DATA_BACKUP_FAILED:  "数据备份失败",
	DATA_RESTORE_FAILED: "数据恢复失败",
	DATA_SYNC_FAILED:    "数据同步失败",
}

// GetErrorMessage 获取错误消息
func GetErrorMessage(code int) string {
	if msg, exists := ErrorMessages[code]; exists {
		return msg
	}
	return "未知错误"
}

// IsSuccess 判断是否成功
func IsSuccess(code int) bool {
	return code == SUCCESS
}

// IsSystemError 判断是否为系统错误
func IsSystemError(code int) bool {
	return code >= 10000 && code <= 10099
}

// IsBusinessError 判断是否为业务错误
func IsBusinessError(code int) bool {
	return code >= 20000 && code <= 29999
}

// IsUserError 判断是否为用户相关错误
func IsUserError(code int) bool {
	return code >= 20000 && code <= 20099
}

// IsMailError 判断是否为邮件相关错误
func IsMailError(code int) bool {
	return code >= 20100 && code <= 20199
}

// IsFileError 判断是否为文件相关错误
func IsFileError(code int) bool {
	return code >= 20200 && code <= 20299
}

// IsDataError 判断是否为数据相关错误
func IsDataError(code int) bool {
	return code >= 20300 && code <= 20399
}

// GetErrorCategory 获取错误分类
func GetErrorCategory(code int) string {
	switch {
	case IsSuccess(code):
		return "success"
	case IsSystemError(code):
		return "system"
	case IsUserError(code):
		return "user"
	case IsMailError(code):
		return "mail"
	case IsFileError(code):
		return "file"
	case IsDataError(code):
		return "data"
	default:
		return "unknown"
	}
}

// IsRetryableError 判断是否为可重试错误
func IsRetryableError(code int) bool {
	switch code {
	case NETWORK_ERROR, SERVICE_UNAVAILABLE, THIRD_PARTY_ERROR,
		DATABASE_ERROR, CACHE_ERROR, MAIL_SERVICE_UNAVAILABLE,
		DATA_SYNC_FAILED:
		return true
	default:
		return false
	}
}

// IsClientError 判断是否为客户端错误
func IsClientError(code int) bool {
	return code >= 10001 && code <= 10025 ||
		code >= 20000 && code <= 20399
}

// IsServerError 判断是否为服务器错误
func IsServerError(code int) bool {
	return code >= 10000 && code <= 10099 && code != SUCCESS
}
