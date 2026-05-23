import React from 'react';
import { useTranslation } from 'react-i18next';
import DaoProposalEditor from './components/DaoProposalEditor';

const DaoProposalCreatePage: React.FC = () => {
  const { ready } = useTranslation();

  if (!ready) {
    return null;
  }

  return <DaoProposalEditor />;
};

export default DaoProposalCreatePage;
