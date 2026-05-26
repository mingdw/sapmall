import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import { Modal, message } from 'antd';
import { ChevronRight, Hash, Link2, MessageCircle, Save, SendHorizontal, Sparkles, Tags, X } from 'lucide-react';
import { useAccount } from 'wagmi';
import type { DaoDiscussionCategory, DaoDiscussionDraft, DaoDiscussionTopicTag } from '../types';
import { DAO_DISCUSSION_CATEGORY_FILTERS } from '../constants/discussionCategories';
import {
  DAO_DISCUSSION_CREATE_MAX_TAGS,
  DAO_DISCUSSION_CREATE_TAG_OPTIONS,
} from '../constants/discussionCreateTags';
import {
  clearDiscussionDraft,
  loadDiscussionDraft,
  saveDiscussionDraft,
} from '../utils/daoDiscussionDraft.storage';
import { publishUserDiscussion } from '../utils/daoUserDiscussion.storage';
import { getPlainTextLength } from '../utils/richText';
import DaoDiscussionRichTextEditor from './DaoDiscussionRichTextEditor';
import {
  daoDiscussionsListPath,
  daoDiscussionPath,
  daoHomePath,
} from '../utils/daoNavigation';
import listRowStyles from './DaoMainListCard.module.scss';
import pageLayoutStyles from '../styles/dao.pageLayout.module.scss';
import sharedStyles from '../styles/dao.shared.module.scss';
import eventStyles from './DaoEventDetail.module.scss';
import styles from './DaoDiscussionEditor.module.scss';

const TITLE_MAX = 120;
const EXCERPT_MAX = 280;
const BODY_MAX = 6000;

const CREATE_CATEGORIES = DAO_DISCUSSION_CATEGORY_FILTERS.filter(
  (c): c is DaoDiscussionCategory => c !== 'all',
);

const DaoDiscussionEditor: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [draft, setDraft] = useState<DaoDiscussionDraft>(() => loadDiscussionDraft());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const patchDraft = useCallback((partial: Partial<DaoDiscussionDraft>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const addTag = useCallback(
    (tag: DaoDiscussionTopicTag) => {
      setDraft((prev) => {
        if (prev.tags.includes(tag)) return prev;
        if (prev.tags.length >= DAO_DISCUSSION_CREATE_MAX_TAGS) {
          message.info(t('dao.discussionCreate.validation.tagMax', { max: DAO_DISCUSSION_CREATE_MAX_TAGS }));
          return prev;
        }
        return { ...prev, tags: [...prev.tags, tag] };
      });
    },
    [t],
  );

  const removeTag = useCallback((tag: DaoDiscussionTopicTag) => {
    setDraft((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  const tagLimitReached = draft.tags.length >= DAO_DISCUSSION_CREATE_MAX_TAGS;

  const bodyPlainLength = useMemo(() => getPlainTextLength(draft.body), [draft.body]);

  const validateDraft = useCallback((): string | null => {
    if (!draft.title.trim()) return t('dao.discussionCreate.validation.titleRequired');
    if (!draft.excerpt.trim()) return t('dao.discussionCreate.validation.excerptRequired');
    if (bodyPlainLength === 0) return t('dao.discussionCreate.validation.bodyRequired');
    if (bodyPlainLength > BODY_MAX) {
      return t('dao.discussionCreate.validation.bodyMax', { max: BODY_MAX });
    }
    if (draft.tags.length === 0) return t('dao.discussionCreate.validation.tagRequired');
    return null;
  }, [bodyPlainLength, draft, t]);

  const onSaveDraft = useCallback(() => {
    saveDiscussionDraft(draft);
    message.success(t('dao.discussionCreate.saveDraftSuccess'));
  }, [draft, t]);

  const onSubmit = useCallback(() => {
    if (!isConnected || !address) {
      message.info(t('dao.discussionCreate.connectToSubmit'));
      return;
    }

    const error = validateDraft();
    if (error) {
      message.warning(error);
      return;
    }

    Modal.confirm({
      title: t('dao.discussionCreate.submitConfirmTitle'),
      content: t('dao.discussionCreate.submitConfirmBody'),
      okText: t('dao.discussionCreate.submit'),
      cancelText: t('common.cancel'),
      onOk: () =>
        new Promise<void>((resolve) => {
          setSubmitting(true);
          window.setTimeout(() => {
            const record = publishUserDiscussion(address, draft);
            clearDiscussionDraft();
            setSubmitting(false);
            message.success(t('dao.discussionCreate.submitSuccess'));
            resolve();
            navigate(daoDiscussionPath(record.id));
          }, 800);
        }),
    });
  }, [address, draft, isConnected, navigate, t, validateDraft]);

  const onDiscard = useCallback(() => {
    Modal.confirm({
      title: t('dao.discussionCreate.discardTitle'),
      content: t('dao.discussionCreate.discardBody'),
      okText: t('dao.discussionCreate.discardConfirm'),
      cancelText: t('common.cancel'),
      okButtonProps: { danger: true },
      onOk: () => {
        clearDiscussionDraft();
        navigate(daoDiscussionsListPath());
      },
    });
  }, [navigate, t]);

  return (
    <section className={pageLayoutStyles.contentZoneInnerFull}>
      <article
        className={`${sharedStyles.panelCard} ${styles.discussionEditorCard}`}
        aria-label={t('dao.discussionCreate.pageTitle')}
      >
        <header className={styles.discussionEditorHead}>
          <nav className={eventStyles.eventDetailBreadcrumb} aria-label="Breadcrumb">
            <Link to={daoHomePath} className={eventStyles.eventDetailBreadcrumbLink}>
              {t('navigation.dao')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link to={daoDiscussionsListPath()} className={eventStyles.eventDetailBreadcrumbLink}>
              {t('dao.tabs.discussions')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <span className={eventStyles.eventDetailBreadcrumbCurrent} aria-current="page">
              {t('dao.discussionCreate.breadcrumbCurrent')}
            </span>
          </nav>

          <div className={styles.discussionEditorIntro}>
            <div className={styles.discussionEditorIntroIcon} aria-hidden>
              <MessageCircle size={22} strokeWidth={2} />
            </div>
            <div className={styles.discussionEditorIntroBody}>
              <h1 className={styles.discussionEditorTitle}>{t('dao.discussionCreate.pageTitle')}</h1>
              <p className={styles.discussionEditorLead}>{t('dao.discussionCreate.pageLead')}</p>
            </div>
          </div>

          <aside className={styles.discussionEditorCallout} role="note">
            <Sparkles size={16} aria-hidden />
            <p>{t('dao.discussionCreate.demoCallout')}</p>
          </aside>
        </header>

        <form
          className={styles.discussionEditorForm}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <section className={styles.discussionEditorSection}>
            <h2 className={styles.discussionEditorSectionTitle}>
              <MessageCircle size={16} aria-hidden />
              {t('dao.discussionCreate.sections.basic')}
            </h2>

            <label className={styles.discussionEditorField}>
              <span className={styles.discussionEditorLabel}>{t('dao.discussionCreate.fields.title')}</span>
              <input
                type="text"
                className={styles.discussionEditorInput}
                value={draft.title}
                maxLength={TITLE_MAX}
                placeholder={t('dao.discussionCreate.placeholders.title')}
                onChange={(e) => patchDraft({ title: e.target.value })}
              />
            </label>

            <label className={styles.discussionEditorField}>
              <span className={styles.discussionEditorLabel}>
                {t('dao.discussionCreate.fields.excerpt')}
                <span className={styles.discussionEditorCharCount}>
                  {draft.excerpt.length}/{EXCERPT_MAX}
                </span>
              </span>
              <textarea
                className={`${styles.discussionEditorTextarea} ${styles.discussionEditorTextareaShort}`}
                value={draft.excerpt}
                maxLength={EXCERPT_MAX}
                rows={3}
                placeholder={t('dao.discussionCreate.placeholders.excerpt')}
                onChange={(e) => patchDraft({ excerpt: e.target.value })}
              />
            </label>

            <fieldset className={styles.discussionEditorFieldset}>
              <legend className={styles.discussionEditorLabel}>
                <Hash size={14} aria-hidden />
                {t('dao.discussionCreate.fields.category')}
              </legend>
              <div className={styles.discussionEditorCategoryGrid}>
                {CREATE_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={styles.discussionEditorCategoryBtn}
                    data-active={draft.category === category}
                    aria-pressed={draft.category === category}
                    onClick={() => patchDraft({ category })}
                  >
                    {t(`dao.filters.discussions.${category}`)}
                  </button>
                ))}
              </div>
              <span className={styles.discussionEditorHint}>
                {t('dao.discussionCreate.categoryHint', {
                  channel: t(`dao.discussionCreate.channels.${draft.category}`),
                })}
              </span>
            </fieldset>

            <fieldset className={styles.discussionEditorFieldset}>
              <legend className={styles.discussionEditorLabel}>
                <Tags size={14} aria-hidden />
                {t('dao.discussionCreate.fields.tags')}
                <span className={styles.discussionEditorCharCount}>
                  {draft.tags.length}/{DAO_DISCUSSION_CREATE_MAX_TAGS}
                </span>
              </legend>
              <div
                className={styles.discussionEditorTagPicker}
                role="group"
                aria-label={t('dao.discussionCreate.tagPickerAria')}
              >
                {DAO_DISCUSSION_CREATE_TAG_OPTIONS.map((tag) => {
                  const isSelected = draft.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`${styles.discussionEditorTagBtn} ${listRowStyles.discussionTopicTag}`}
                      data-tag={tag}
                      data-selected={isSelected}
                      disabled={isSelected || tagLimitReached}
                      aria-pressed={isSelected}
                      onClick={() => addTag(tag)}
                    >
                      {t(`dao.topicTags.${tag}`)}
                    </button>
                  );
                })}
              </div>
              <div
                className={styles.discussionEditorTagInput}
                role="list"
                aria-label={t('dao.discussionCreate.selectedTagsAria')}
              >
                {draft.tags.map((tag) => (
                  <span
                    key={tag}
                    role="listitem"
                    className={`${styles.discussionEditorSelectedTag} ${listRowStyles.discussionTopicTag}`}
                    data-tag={tag}
                  >
                    <span className={styles.discussionEditorSelectedTagLabel}>
                      {t(`dao.topicTags.${tag}`)}
                    </span>
                    <button
                      type="button"
                      className={styles.discussionEditorSelectedTagRemove}
                      aria-label={t('dao.discussionCreate.removeTag', { tag: t(`dao.topicTags.${tag}`) })}
                      onClick={() => removeTag(tag)}
                    >
                      <X size={12} strokeWidth={2.5} aria-hidden />
                    </button>
                  </span>
                ))}
                {draft.tags.length === 0 ? (
                  <span className={styles.discussionEditorTagInputPlaceholder}>
                    {t('dao.discussionCreate.tagsInputPlaceholder')}
                  </span>
                ) : null}
              </div>
            </fieldset>
          </section>

          <section className={styles.discussionEditorSection}>
            <h2 className={styles.discussionEditorSectionTitle}>
              <MessageCircle size={16} aria-hidden />
              {t('dao.discussionCreate.sections.body')}
            </h2>

            <div className={styles.discussionEditorField}>
              <span className={styles.discussionEditorLabel}>
                {t('dao.discussionCreate.fields.body')}
                <span className={styles.discussionEditorCharCount}>
                  {bodyPlainLength}/{BODY_MAX}
                </span>
              </span>
              <DaoDiscussionRichTextEditor
                value={draft.body}
                onChange={(html) => patchDraft({ body: html })}
                placeholder={t('dao.discussionCreate.placeholders.body')}
                maxPlainLength={BODY_MAX}
                ariaLabel={t('dao.discussionCreate.fields.body')}
              />
              <span className={styles.discussionEditorHint}>{t('dao.discussionCreate.bodyHint')}</span>
            </div>
          </section>

          <section className={styles.discussionEditorSection}>
            <h2 className={styles.discussionEditorSectionTitle}>
              <Link2 size={16} aria-hidden />
              {t('dao.discussionCreate.sections.references')}
            </h2>

            <label className={styles.discussionEditorField}>
              <span className={styles.discussionEditorLabel}>{t('dao.discussionCreate.fields.referenceLink')}</span>
              <input
                type="url"
                className={styles.discussionEditorInput}
                value={draft.referenceLink}
                placeholder={t('dao.discussionCreate.placeholders.referenceLink')}
                onChange={(e) => patchDraft({ referenceLink: e.target.value })}
              />
            </label>
          </section>

          <footer className={styles.discussionEditorFooter}>
            {!isConnected ? (
              <p className={styles.discussionEditorWalletHint}>{t('dao.discussionCreate.connectToSubmit')}</p>
            ) : null}

            <div className={styles.discussionEditorActions}>
              <button type="button" className={styles.discussionEditorBtnGhost} onClick={onDiscard}>
                {t('dao.discussionCreate.discard')}
              </button>
              <button type="button" className={styles.discussionEditorBtnOutline} onClick={onSaveDraft}>
                <Save size={16} aria-hidden />
                {t('dao.discussionCreate.saveDraft')}
              </button>
              {!isConnected ? (
                <ConnectButton.Custom>
                  {({ openConnectModal, mounted, authenticationStatus }) => {
                    const ready = mounted && authenticationStatus !== 'loading';
                    return (
                      <button
                        type="button"
                        className={styles.discussionEditorBtnPrimary}
                        disabled={!ready}
                        onClick={openConnectModal}
                      >
                        {t('dao.discussionCreate.connectWallet')}
                      </button>
                    );
                  }}
                </ConnectButton.Custom>
              ) : (
                <button type="submit" className={styles.discussionEditorBtnPrimary} disabled={submitting}>
                  <SendHorizontal size={16} aria-hidden />
                  {t('dao.discussionCreate.submit')}
                </button>
              )}
            </div>
          </footer>
        </form>
      </article>
    </section>
  );
};

export default DaoDiscussionEditor;
