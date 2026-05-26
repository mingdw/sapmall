import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import { Modal, message } from 'antd';
import {
  CalendarRange,
  ChevronRight,
  FileText,
  Link2,
  Save,
  SendHorizontal,
  Sparkles,
  Tags,
  X,
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { DAO_DISCORD_URL } from '../constants';
import { DAO_PROPOSAL_TAG_KEYS } from '../constants/proposalTags';
import type { DaoProposalDraft } from '../types';
import {
  clearProposalDraft,
  loadProposalDraft,
  saveProposalDraft,
} from '../utils/daoProposalDraft.storage';
import { daoHomePath, daoProposalsListPath } from '../utils/daoNavigation';
import listTagStyles from '../styles/dao.listTags.module.scss';
import pageLayoutStyles from '../styles/dao.pageLayout.module.scss';
import sharedStyles from '../styles/dao.shared.module.scss';
import detailStyles from './DaoProposalDetail.module.scss';
import styles from './DaoProposalEditor.module.scss';

const topicTagClass: Record<string, string> = {
  'dao.list.proposals.tags.governance': listTagStyles.topicTagGovernance,
  'dao.list.proposals.tags.treasury': listTagStyles.topicTagTreasury,
  'dao.list.proposals.tags.marketplace': listTagStyles.topicTagMarketplace,
  'dao.list.proposals.tags.staking': listTagStyles.topicTagStaking,
  'dao.list.proposals.tags.grant': listTagStyles.topicTagGrant,
  'dao.list.proposals.tags.multisig': listTagStyles.topicTagMultisig,
  'dao.list.proposals.tags.security': listTagStyles.topicTagSecurity,
};

const SUMMARY_MAX = 280;

const DaoProposalEditor: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [draft, setDraft] = useState<DaoProposalDraft>(() => loadProposalDraft());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const patchDraft = useCallback((partial: Partial<DaoProposalDraft>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const addTag = useCallback((tagKey: string) => {
    setDraft((prev) => {
      if (prev.tagKeys.includes(tagKey)) return prev;
      return { ...prev, tagKeys: [...prev.tagKeys, tagKey] };
    });
  }, []);

  const removeTag = useCallback((tagKey: string) => {
    setDraft((prev) => ({
      ...prev,
      tagKeys: prev.tagKeys.filter((k) => k !== tagKey),
    }));
  }, []);

  const validateDraft = useCallback((): string | null => {
    if (!draft.title.trim()) return t('dao.proposalCreate.validation.titleRequired');
    if (!draft.summary.trim()) return t('dao.proposalCreate.validation.summaryRequired');
    if (draft.tagKeys.length === 0) return t('dao.proposalCreate.validation.tagRequired');
    if (!draft.startAt || !draft.endAt) return t('dao.proposalCreate.validation.datesRequired');
    if (draft.endAt <= draft.startAt) return t('dao.proposalCreate.validation.endAfterStart');
    if (!draft.motivation.trim()) return t('dao.proposalCreate.validation.motivationRequired');
    return null;
  }, [draft, t]);

  const onSaveDraft = useCallback(() => {
    saveProposalDraft(draft);
    message.success(t('dao.proposalCreate.saveDraftSuccess'));
  }, [draft, t]);

  const onSubmit = useCallback(() => {
    if (!isConnected || !address) {
      message.info(t('dao.proposalCreate.connectToSubmit'));
      return;
    }

    const error = validateDraft();
    if (error) {
      message.warning(error);
      return;
    }

    Modal.confirm({
      title: t('dao.proposalCreate.submitConfirmTitle'),
      content: t('dao.proposalCreate.submitConfirmBody'),
      okText: t('dao.proposalCreate.submit'),
      cancelText: t('common.cancel'),
      onOk: () =>
        new Promise<void>((resolve) => {
          setSubmitting(true);
          window.setTimeout(() => {
            saveProposalDraft(draft);
            setSubmitting(false);
            message.success(t('dao.proposalCreate.submitSuccess'));
            resolve();
            navigate(daoProposalsListPath);
          }, 1200);
        }),
    });
  }, [address, draft, isConnected, navigate, t, validateDraft]);

  const onDiscard = useCallback(() => {
    Modal.confirm({
      title: t('dao.proposalCreate.discardTitle'),
      content: t('dao.proposalCreate.discardBody'),
      okText: t('dao.proposalCreate.discardConfirm'),
      cancelText: t('common.cancel'),
      okButtonProps: { danger: true },
      onOk: () => {
        clearProposalDraft();
        navigate(daoProposalsListPath);
      },
    });
  }, [navigate, t]);

  return (
    <section className={pageLayoutStyles.contentZoneInnerFull}>
      <article className={`${sharedStyles.panelCard} ${styles.proposalEditorCard}`} aria-label={t('dao.proposalCreate.pageTitle')}>
        <header className={styles.proposalEditorHead}>
          <nav className={detailStyles.proposalDetailBreadcrumb} aria-label="Breadcrumb">
            <Link to={daoHomePath} className={detailStyles.proposalDetailBreadcrumbLink}>
              {t('navigation.dao')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link to={daoProposalsListPath} className={detailStyles.proposalDetailBreadcrumbLink}>
              {t('dao.tabs.proposals')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <span className={detailStyles.proposalDetailBreadcrumbCurrent} aria-current="page">
              {t('dao.proposalCreate.breadcrumbCurrent')}
            </span>
          </nav>

          <div className={styles.proposalEditorIntro}>
            <div className={styles.proposalEditorIntroIcon} aria-hidden>
              <FileText size={22} strokeWidth={2} />
            </div>
            <div className={styles.proposalEditorIntroBody}>
              <h1 className={styles.proposalEditorTitle}>{t('dao.proposalCreate.pageTitle')}</h1>
              <p className={styles.proposalEditorLead}>{t('dao.proposalCreate.pageLead')}</p>
            </div>
          </div>

          <aside className={styles.proposalEditorCallout} role="note">
            <Sparkles size={16} aria-hidden />
            <p>{t('dao.proposalCreate.demoCallout')}</p>
          </aside>
        </header>

        <form
          className={styles.proposalEditorForm}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <section className={styles.proposalEditorSection}>
            <h2 className={styles.proposalEditorSectionTitle}>
              <FileText size={16} aria-hidden />
              {t('dao.proposalCreate.sections.basic')}
            </h2>

            <label className={styles.proposalEditorField}>
              <span className={styles.proposalEditorLabel}>{t('dao.proposalCreate.fields.title')}</span>
              <input
                type="text"
                className={styles.proposalEditorInput}
                value={draft.title}
                maxLength={120}
                placeholder={t('dao.proposalCreate.placeholders.title')}
                onChange={(e) => patchDraft({ title: e.target.value })}
              />
            </label>

            <label className={styles.proposalEditorField}>
              <span className={styles.proposalEditorLabel}>
                {t('dao.proposalCreate.fields.summary')}
                <span className={styles.proposalEditorCharCount}>
                  {draft.summary.length}/{SUMMARY_MAX}
                </span>
              </span>
              <textarea
                className={`${styles.proposalEditorTextarea} ${styles.proposalEditorTextareaShort}`}
                value={draft.summary}
                maxLength={SUMMARY_MAX}
                rows={3}
                placeholder={t('dao.proposalCreate.placeholders.summary')}
                onChange={(e) => patchDraft({ summary: e.target.value })}
              />
            </label>

            <fieldset className={`${styles.proposalEditorFieldset} ${styles.proposalEditorTagFieldset}`}>
              <legend className="sr-only">{t('dao.proposalCreate.fields.tags')}</legend>
              <div className={styles.proposalEditorTagHeadRow}>
                <span className={styles.proposalEditorTagLabel} id="proposal-tag-label">
                  <Tags size={12} aria-hidden />
                  {t('dao.proposalCreate.fields.tags')}
                </span>
                <span className={styles.proposalEditorTagDivider} aria-hidden />
                <div
                  className={styles.proposalEditorTagPicker}
                  role="group"
                  aria-labelledby="proposal-tag-label"
                >
                  {DAO_PROPOSAL_TAG_KEYS.map((tagKey) => {
                    const isSelected = draft.tagKeys.includes(tagKey);
                    return (
                      <button
                        key={tagKey}
                        type="button"
                        className={`${styles.proposalEditorTagBtn} ${topicTagClass[tagKey] ?? ''}`}
                        data-selected={isSelected}
                        disabled={isSelected}
                        aria-pressed={isSelected}
                        onClick={() => addTag(tagKey)}
                      >
                        {t(tagKey)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div
                className={styles.proposalEditorTagInput}
                role="list"
                aria-label={t('dao.proposalCreate.selectedTagsAria')}
              >
                {draft.tagKeys.map((tagKey) => (
                  <span
                    key={tagKey}
                    role="listitem"
                    className={`${styles.proposalEditorSelectedTag} ${topicTagClass[tagKey] ?? ''}`}
                  >
                    <span className={styles.proposalEditorSelectedTagLabel}>{t(tagKey)}</span>
                    <button
                      type="button"
                      className={styles.proposalEditorSelectedTagRemove}
                      aria-label={t('dao.proposalCreate.removeTag', { tag: t(tagKey) })}
                      onClick={() => removeTag(tagKey)}
                    >
                      <X size={12} strokeWidth={2.5} aria-hidden />
                    </button>
                  </span>
                ))}
                {draft.tagKeys.length === 0 ? (
                  <span className={styles.proposalEditorTagInputPlaceholder}>
                    {t('dao.proposalCreate.tagsInputPlaceholder')}
                  </span>
                ) : null}
              </div>
            </fieldset>
          </section>

          <section className={styles.proposalEditorSection}>
            <h2 className={styles.proposalEditorSectionTitle}>
              <CalendarRange size={16} aria-hidden />
              {t('dao.proposalCreate.sections.votingWindow')}
            </h2>
            <div className={styles.proposalEditorFieldRow}>
              <label className={styles.proposalEditorField}>
                <span className={styles.proposalEditorLabel}>{t('dao.proposalCreate.fields.startAt')}</span>
                <input
                  type="date"
                  className={styles.proposalEditorInput}
                  value={draft.startAt}
                  onChange={(e) => patchDraft({ startAt: e.target.value })}
                />
              </label>
              <label className={styles.proposalEditorField}>
                <span className={styles.proposalEditorLabel}>{t('dao.proposalCreate.fields.endAt')}</span>
                <input
                  type="date"
                  className={styles.proposalEditorInput}
                  value={draft.endAt}
                  min={draft.startAt || undefined}
                  onChange={(e) => patchDraft({ endAt: e.target.value })}
                />
              </label>
            </div>
            <p className={styles.proposalEditorHint}>{t('dao.proposalCreate.votingWindowHint')}</p>
          </section>

          <section className={styles.proposalEditorSection}>
            <h2 className={styles.proposalEditorSectionTitle}>
              <FileText size={16} aria-hidden />
              {t('dao.proposalCreate.sections.body')}
            </h2>

            <label className={styles.proposalEditorField}>
              <span className={styles.proposalEditorLabel}>{t('dao.proposalCreate.fields.motivation')}</span>
              <textarea
                className={styles.proposalEditorTextarea}
                value={draft.motivation}
                rows={5}
                placeholder={t('dao.proposalCreate.placeholders.motivation')}
                onChange={(e) => patchDraft({ motivation: e.target.value })}
              />
            </label>

            <label className={styles.proposalEditorField}>
              <span className={styles.proposalEditorLabel}>{t('dao.proposalCreate.fields.specification')}</span>
              <textarea
                className={styles.proposalEditorTextarea}
                value={draft.specification}
                rows={6}
                placeholder={t('dao.proposalCreate.placeholders.specification')}
                onChange={(e) => patchDraft({ specification: e.target.value })}
              />
              <span className={styles.proposalEditorHint}>{t('dao.proposalCreate.specificationHint')}</span>
            </label>

            <label className={styles.proposalEditorField}>
              <span className={styles.proposalEditorLabel}>{t('dao.proposalCreate.fields.callout')}</span>
              <textarea
                className={`${styles.proposalEditorTextarea} ${styles.proposalEditorTextareaShort}`}
                value={draft.callout}
                rows={2}
                placeholder={t('dao.proposalCreate.placeholders.callout')}
                onChange={(e) => patchDraft({ callout: e.target.value })}
              />
            </label>
          </section>

          <section className={styles.proposalEditorSection}>
            <h2 className={styles.proposalEditorSectionTitle}>
              <Link2 size={16} aria-hidden />
              {t('dao.proposalCreate.sections.references')}
            </h2>

            <label className={styles.proposalEditorField}>
              <span className={styles.proposalEditorLabel}>{t('dao.proposalCreate.fields.referenceForum')}</span>
              <input
                type="url"
                className={styles.proposalEditorInput}
                value={draft.referenceForum}
                placeholder={DAO_DISCORD_URL}
                onChange={(e) => patchDraft({ referenceForum: e.target.value })}
              />
            </label>

            <label className={styles.proposalEditorField}>
              <span className={styles.proposalEditorLabel}>{t('dao.proposalCreate.fields.referenceImplementation')}</span>
              <input
                type="url"
                className={styles.proposalEditorInput}
                value={draft.referenceImplementation}
                placeholder={t('dao.proposalCreate.placeholders.referenceImplementation')}
                onChange={(e) => patchDraft({ referenceImplementation: e.target.value })}
              />
            </label>
          </section>

          <footer className={styles.proposalEditorFooter}>
            {!isConnected ? (
              <p className={styles.proposalEditorWalletHint}>{t('dao.proposalCreate.connectToSubmit')}</p>
            ) : null}

            <div className={styles.proposalEditorActions}>
              <button type="button" className={styles.proposalEditorBtnGhost} onClick={onDiscard}>
                {t('dao.proposalCreate.discard')}
              </button>
              <button type="button" className={styles.proposalEditorBtnOutline} onClick={onSaveDraft}>
                <Save size={16} aria-hidden />
                {t('dao.proposalCreate.saveDraft')}
              </button>
              {!isConnected ? (
                <ConnectButton.Custom>
                  {({ openConnectModal, mounted, authenticationStatus }) => {
                    const ready = mounted && authenticationStatus !== 'loading';
                    return (
                      <button
                        type="button"
                        className={styles.proposalEditorBtnPrimary}
                        disabled={!ready}
                        onClick={openConnectModal}
                      >
                        {t('dao.proposalCreate.connectWallet')}
                      </button>
                    );
                  }}
                </ConnectButton.Custom>
              ) : (
                <button type="submit" className={styles.proposalEditorBtnPrimary} disabled={submitting}>
                  <SendHorizontal size={16} aria-hidden />
                  {t('dao.proposalCreate.submit')}
                </button>
              )}
            </div>
          </footer>
        </form>
      </article>
    </section>
  );
};

export default DaoProposalEditor;
