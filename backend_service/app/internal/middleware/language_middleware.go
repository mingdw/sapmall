package middleware

import (
	"net/http"

	"sapphire-mall/pkg/i18n"
)

const xLocaleHeader = "X-Locale"

// LanguageMiddleware 解析 Accept-Language / X-Locale 并写入 request context。
type LanguageMiddleware struct {
	defaultLocale string
}

func NewLanguageMiddleware() *LanguageMiddleware {
	return &LanguageMiddleware{
		defaultLocale: i18n.DefaultLocale,
	}
}

func (m *LanguageMiddleware) Handle(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		locale := m.resolveLocale(r)
		ctx := i18n.WithLocale(r.Context(), locale)
		next(w, r.WithContext(ctx))
	}
}

func (m *LanguageMiddleware) resolveLocale(r *http.Request) string {
	// 优先 Accept-Language，其次兼容前端自定义 X-Locale
	if header := r.Header.Get(i18n.AcceptLanguageHeader); header != "" {
		if locale := i18n.ParseAcceptLanguage(header); locale != "" {
			return locale
		}
	}
	if header := r.Header.Get(xLocaleHeader); header != "" {
		return i18n.NormalizeLocale(header)
	}
	return i18n.NormalizeLocale(m.defaultLocale)
}
