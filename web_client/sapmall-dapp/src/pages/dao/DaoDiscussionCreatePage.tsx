import React from 'react';
import { useTranslation } from 'react-i18next';
import DaoDiscussionEditor from './components/DaoDiscussionEditor';

const DaoDiscussionCreatePage: React.FC = () => {
  const { ready } = useTranslation();

  if (!ready) {
    return null;
  }

  return <DaoDiscussionEditor />;
};

export default DaoDiscussionCreatePage;
