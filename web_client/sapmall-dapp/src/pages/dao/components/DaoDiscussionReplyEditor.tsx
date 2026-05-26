import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import { Input, message } from 'antd';
import { SendHorizonal, X } from 'lucide-react';
import { useAccount } from 'wagmi';
import type { DaoDiscussionReplyTarget } from '../types';
import { addUserDiscussionReply } from '../utils/daoDiscussionReply.storage';
import { shortenWalletAddress } from '../utils/walletAddress';
import styles from './DaoDiscussionReplyComposer.module.scss';

const { TextArea } = Input;

const MAX_LENGTH = 2000;

export type DaoDiscussionReplyEditorVariant = 'footer' | 'inline';

type Props = {
  discussionId: string;
  replyTarget?: DaoDiscussionReplyTarget | null;
  variant?: DaoDiscussionReplyEditorVariant;
  autoFocus?: boolean;
  onPosted: () => void;
  onCancel?: () => void;
};

const DaoDiscussionReplyEditor: React.FC<Props> = ({
  discussionId,
  replyTarget = null,
  variant = 'footer',
  autoFocus = false,
  onPosted,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isInline = variant === 'inline';

  const canSubmit = useMemo(() => draft.trim().length > 0 && !submitting, [draft, submitting]);

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus, replyTarget?.replyId]);

  const onSubmit = useCallback(() => {
    const body = draft.trim();
    if (!body) {
      message.warning(t('dao.discussionDetail.composer.emptyError'));
      return;
    }
    if (!address) return;

    setSubmitting(true);
    addUserDiscussionReply(
      discussionId,
      address,
      body,
      replyTarget
        ? {
            parentReplyId: replyTarget.replyId,
            replyToAuthorAddress: replyTarget.authorAddress,
            replyToSnippet: replyTarget.preview,
          }
        : undefined,
    );
    setDraft('');
    setSubmitting(false);
    message.success(t('dao.discussionDetail.composer.successToast'));
    onPosted();
  }, [address, discussionId, draft, onPosted, replyTarget, t]);

  const placeholder = replyTarget
    ? t('dao.discussionDetail.composer.placeholderReply', {
        user: shortenWalletAddress(replyTarget.authorAddress),
      })
    : t('dao.discussionDetail.composer.placeholder');

  if (!isConnected || !address) {
    return (
      <div className={isInline ? styles.discussionReplyComposerGuestInline : styles.discussionReplyComposerGuest}>
        <p className={styles.discussionReplyComposerHint}>{t('dao.discussionDetail.composer.connectHint')}</p>
        <ConnectButton.Custom>
          {({ openConnectModal, mounted, authenticationStatus }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            return (
              <button
                type="button"
                className={styles.discussionReplyConnectBtn}
                disabled={!ready}
                onClick={openConnectModal}
              >
                {t('dao.discussionDetail.composer.connectWallet')}
              </button>
            );
          }}
        </ConnectButton.Custom>
      </div>
    );
  }

  return (
    <div className={styles.discussionReplyComposerForm}>
      {replyTarget && isInline ? (
        <div className={styles.replyTargetBannerInline}>
          <span className={styles.replyTargetText}>
            {t('dao.discussionDetail.composer.replyingTo', {
              user: shortenWalletAddress(replyTarget.authorAddress),
            })}
          </span>
          {onCancel ? (
            <button
              type="button"
              className={styles.replyTargetCancel}
              onClick={onCancel}
              aria-label={t('dao.discussionDetail.composer.cancelReplyTo')}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : null}
        </div>
      ) : null}

      {replyTarget && !isInline ? (
        <div className={styles.replyTargetBanner}>
          <span className={styles.replyTargetText}>
            {t('dao.discussionDetail.composer.replyingTo', {
              user: shortenWalletAddress(replyTarget.authorAddress),
            })}
            <span className={styles.replyTargetPreview}>{replyTarget.preview}</span>
          </span>
          {onCancel ? (
            <button
              type="button"
              className={styles.replyTargetCancel}
              onClick={onCancel}
              aria-label={t('dao.discussionDetail.composer.cancelReplyTo')}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : null}
        </div>
      ) : null}

      <TextArea
        ref={textareaRef}
        className={styles.discussionReplyTextarea}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        autoSize={{ minRows: isInline ? 2 : 4, maxRows: isInline ? 6 : 10 }}
        maxLength={MAX_LENGTH}
      />

      <div className={styles.discussionReplyComposerActions}>
        <span className={styles.charCount} aria-live="polite">
          {t('dao.discussionDetail.composer.charCount', { current: draft.length, max: MAX_LENGTH })}
        </span>
        <div className={styles.discussionReplyComposerActionBtns}>
          {onCancel && isInline ? (
            <button type="button" className={styles.discussionReplyCancelBtn} onClick={onCancel}>
              {t('dao.discussionDetail.composer.cancelReplyTo')}
            </button>
          ) : null}
          <button
            type="button"
            className={styles.discussionReplySubmitBtn}
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            <SendHorizonal className="h-4 w-4" aria-hidden />
            {replyTarget
              ? t('dao.discussionDetail.composer.submitReply')
              : t('dao.discussionDetail.composer.submit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DaoDiscussionReplyEditor;
