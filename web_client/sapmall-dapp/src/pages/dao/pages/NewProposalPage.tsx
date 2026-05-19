import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Steps, Input, Select, Button, Switch, message } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import SectionTitle from '../components/SectionTitle';
import shared from '../styles/dao.shared.module.scss';
import styles from './NewProposalPage.module.scss';

const NewProposalPage: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('community');
  const [discussionFirst, setDiscussionFirst] = useState(true);

  const handlePublish = () => {
    message.success(t('dao.new.publishSuccess'));
    setStep(3);
  };

  return (
    <main className={shared.page}>
      <header className={styles.pageHead}>
        <span className={shared.badge}>
          <FormOutlined style={{ fontSize: 12 }} aria-hidden />
          {t('dao.new.badge')}
        </span>
        <h1 className={shared.pageTitle}>{t('dao.new.title')}</h1>
        <p className={shared.pageSubtitle}>{t('dao.new.subtitle')}</p>
      </header>

      <Steps
        current={step}
        className={styles.steps}
        items={[
          { title: t('dao.new.stepType') },
          { title: t('dao.new.stepContent') },
          { title: t('dao.new.stepParams') },
          { title: t('dao.new.stepPreview') },
        ]}
      />

      <section className={`${shared.panel} ${styles.formCard}`}>
        {step === 0 && (
          <>
            <SectionTitle title={t('dao.new.stepType')} />
            <Select
              value={type}
              onChange={setType}
              className={styles.fullWidth}
              options={['parameter', 'treasury', 'grants', 'protocol', 'community'].map((tp) => ({
                value: tp,
                label: t(`dao.type.${tp}`),
              }))}
            />
          </>
        )}
        {step === 1 && (
          <>
            <SectionTitle title={t('dao.new.stepContent')} />
            <label className={styles.label} htmlFor="proposal-title">
              {t('dao.new.fieldTitle')}
            </label>
            <Input id="proposal-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label className={styles.label} htmlFor="proposal-summary">
              {t('dao.new.fieldSummary')}
            </label>
            <Input.TextArea id="proposal-summary" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
            <label className={styles.label} htmlFor="proposal-body">
              {t('dao.new.fieldBody')}
            </label>
            <Input.TextArea id="proposal-body" rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
          </>
        )}
        {step === 2 && (
          <>
            <SectionTitle title={t('dao.new.stepParams')} />
            <label className={styles.switchRow}>
              <span>{t('dao.new.discussionFirst')}</span>
              <Switch checked={discussionFirst} onChange={setDiscussionFirst} />
            </label>
            <p className={shared.muted}>{t('dao.new.discussionFirstHint')}</p>
          </>
        )}
        {step === 3 && (
          <>
            <SectionTitle title={t('dao.new.stepPreview')} />
            <h2 className={styles.previewTitle}>{title || '—'}</h2>
            <p className={shared.bodyText}>{summary}</p>
            <pre className={styles.previewBody}>{body}</pre>
          </>
        )}

        <footer className={styles.actions}>
          {step > 0 && (
            <Button onClick={() => setStep((s) => s - 1)}>{t('dao.new.back')}</Button>
          )}
          {step < 3 ? (
            <Button type="primary" className={styles.nextBtn} onClick={() => setStep((s) => s + 1)}>
              {t('dao.new.next')}
            </Button>
          ) : (
            <Button type="primary" className={styles.nextBtn} onClick={handlePublish}>
              {t('dao.new.publish')}
            </Button>
          )}
        </footer>
      </section>

      <Link to="/dao" className={styles.backLink}>
        {t('dao.detail.backToList')}
      </Link>
    </main>
  );
};

export default NewProposalPage;
