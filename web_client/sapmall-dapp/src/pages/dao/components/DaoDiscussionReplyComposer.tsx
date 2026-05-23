import React, { useCallback, useMemo, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import { Input, message } from 'antd';
import { SendHorizonal } from 'lucide-react';
import { useAccount } from 'wagmi';
import { addUserDiscussionReply } from '../utils/daoDiscussionReply.storage';
import styles from '../DaoPage.module.scss';

const { TextArea } = Input;

type Props = {
  discussionId: string;
  onReplyPosted: () => void;
};

const DaoDiscussionReplyComposer: React.FC<Props> = ({ discussionId, onReplyPosted }) => {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => draft.trim().length > 0 && !submitting, [draft, submitting]);

  const onSubmit = useCallback(() => {
    const body = draft.trim();
    if (!body) {
      message.warning(t('dao.discussionDetail.composer.emptyError'));
      return;
    }
    if (!address) return;

    setSubmitting(true);
    addUserDiscussionReply(discussionId, address, body);
    setDraft('');
    setSubmitting(false);
    message.success(t('dao.discussionDetail.composer.successToast'));
    onReplyPosted();
  }, [address, discussionId, draft, onReplyPosted, t]);

  return (
    <section className={styles.discussionReplyComposer} aria-labelledby="dao-discussion-reply-title">
      <h2 id="dao-discussion-reply-title" className={styles.discussionReplyComposerTitle}>
        {t('dao.discussionDetail.composer.title')}
      </h2>

      {!isConnected || !address ? (
        <div className={styles.discussionReplyComposerGuest}>
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
      ) : (
        <div className={styles.discussionReplyComposerForm}>
          <TextArea
            className={styles.discussionReplyTextarea}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('dao.discussionDetail.composer.placeholder')}
            autoSize={{ minRows: 4, maxRows: 10 }}
            maxLength={2000}
            showCount
          />
          <div className={styles.discussionReplyComposerActions}>
            <button
              type="button"
              className={styles.discussionReplySubmitBtn}
              disabled={!canSubmit}
              onClick={onSubmit}
            >
              <SendHorizonal className="h-4 w-4" aria-hidden />
              {t('dao.discussionDetail.composer.submit')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default DaoDiscussionReplyComposer;
