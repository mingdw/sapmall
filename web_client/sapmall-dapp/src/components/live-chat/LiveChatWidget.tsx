import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Headphones, Minus, Send, X } from 'lucide-react';
import { useLiveChatStore } from '../../store/liveChatStore';
import { pickLiveChatAgentReply } from '../../pages/help/utils/liveChatReplies';
import styles from './LiveChatWidget.module.scss';

const LiveChatWidget: React.FC = () => {
  const { t } = useTranslation();
  const {
    isOpen,
    isMinimized,
    messages,
    isAgentTyping,
    close,
    minimize,
    expand,
    addMessage,
    sendUserMessage,
  } = useLiveChatStore();

  const [draft, setDraft] = useState('');
  const welcomedRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized && messages.length === 0 && !welcomedRef.current) {
      addMessage('agent', t('help.liveChat.welcome'));
      welcomedRef.current = true;
    }
  }, [isOpen, isMinimized, messages.length, addMessage, t]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isAgentTyping, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, isMinimized]);

  const onSend = useCallback(() => {
    const text = draft.trim();
    if (!text || isAgentTyping) return;
    setDraft('');
    sendUserMessage(text, pickLiveChatAgentReply(text, t));
  }, [draft, isAgentTyping, sendUserMessage, t]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  if (!isOpen) {
    return null;
  }

  if (isMinimized) {
    return (
      <button
        type="button"
        className={styles.launcher}
        aria-label={t('help.liveChat.open')}
        onClick={expand}
      >
        <Headphones size={22} strokeWidth={2} aria-hidden />
        <span className={styles.launcherBadge} aria-hidden />
      </button>
    );
  }

  return (
    <div
      className={styles.panel}
      role="dialog"
      aria-modal="false"
      aria-label={t('help.liveChat.title')}
    >
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <span className={styles.avatar} aria-hidden>
            <Headphones size={18} strokeWidth={2.25} />
          </span>
          <div className={styles.headerText}>
            <span className={styles.headerTitle}>{t('help.liveChat.title')}</span>
            <span className={styles.headerStatus}>
              <span className={styles.statusDot} aria-hidden />
              {t('help.liveChat.statusOnline')}
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={t('help.liveChat.minimize')}
            onClick={minimize}
          >
            <Minus size={18} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={t('help.liveChat.close')}
            onClick={close}
          >
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>
      </header>

      <div className={styles.messages} ref={listRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={styles.messageRow}
            data-role={msg.role}
          >
            {msg.role === 'agent' && (
              <span className={styles.msgAvatar} aria-hidden>
                <Headphones size={14} strokeWidth={2.25} />
              </span>
            )}
            <div className={styles.bubble}>
              <p className={styles.bubbleText}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isAgentTyping && (
          <div className={styles.messageRow} data-role="agent">
            <span className={styles.msgAvatar} aria-hidden>
              <Headphones size={14} strokeWidth={2.25} />
            </span>
            <div className={`${styles.bubble} ${styles.bubbleTyping}`}>
              <span className={styles.typingDots} aria-label={t('help.liveChat.typing')}>
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
      </div>

      <footer className={styles.composer}>
        <textarea
          ref={inputRef}
          className={styles.input}
          rows={2}
          value={draft}
          placeholder={t('help.liveChat.placeholder')}
          aria-label={t('help.liveChat.placeholder')}
          disabled={isAgentTyping}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className={styles.sendBtn}
          aria-label={t('help.liveChat.send')}
          disabled={!draft.trim() || isAgentTyping}
          onClick={onSend}
        >
          <Send size={18} strokeWidth={2.25} aria-hidden />
        </button>
      </footer>
    </div>
  );
};

export default LiveChatWidget;

/** 供帮助中心等入口调用 */
export const openLiveChat = () => useLiveChatStore.getState().open();
