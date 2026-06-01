package middleware

import (
	"net/http"

	"sapphire-mall/pkg/i18n"
)

// LanguageMiddleware 解析 Accept-Language 并写入 request context。
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
	if header := r.Header.Get(i18n.AcceptLanguageHeader); header != "" {
		if locale := i18n.ParseAcceptLanguage(header); locale != "" {
			return locale
		}
	}
	return i18n.NormalizeLocale(m.defaultLocale)
}
