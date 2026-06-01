package i18n

import (
	"context"
	"strings"
)

const (
	DefaultLocale        = "zh-CN"
	AcceptLanguageHeader = "Accept-Language"
)

type localeContextKey struct{}

// WithLocale 将语言写入 context。
func WithLocale(ctx context.Context, locale string) context.Context {
	return context.WithValue(ctx, localeContextKey{}, NormalizeLocale(locale))
}

// LocaleFrom 从 context 读取语言；未设置时返回 DefaultLocale。
func LocaleFrom(ctx context.Context) string {
	if ctx == nil {
		return DefaultLocale
	}
	if v, ok := ctx.Value(localeContextKey{}).(string); ok && v != "" {
		return v
	}
	return DefaultLocale
}

// NormalizeLocale 规范为 zh-CN / en-US。
func NormalizeLocale(locale string) string {
	locale = strings.TrimSpace(locale)
	if locale == "" {
		return DefaultLocale
	}
	lower := strings.ToLower(locale)
	switch {
	case strings.HasPrefix(lower, "zh"):
		return "zh-CN"
	case strings.HasPrefix(lower, "en"):
		return "en-US"
	default:
		return DefaultLocale
	}
}

// ParseAcceptLanguage 解析 Accept-Language 请求头，取优先级最高的一条。
func ParseAcceptLanguage(header string) string {
	header = strings.TrimSpace(header)
	if header == "" {
		return ""
	}

	first := header
	if idx := strings.Index(first, ","); idx >= 0 {
		first = first[:idx]
	}
	if idx := strings.Index(first, ";"); idx >= 0 {
		first = first[:idx]
	}
	return NormalizeLocale(strings.TrimSpace(first))
}
