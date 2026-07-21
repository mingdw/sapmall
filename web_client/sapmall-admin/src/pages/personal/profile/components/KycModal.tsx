import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Select, Steps, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import AdminModal from '../../../../components/common/AdminModal';
import AdminButton from '../../../../components/common/AdminButton';
import MessageUtils from '../../../../utils/messageUtils';
import type { KycBasicForm, KycSubmitPayload } from '../types';
import styles from '../ProfileManager.module.scss';

interface KycModalProps {
  open: boolean;
  onCancel: () => void;
  onCompleted: (payload: KycSubmitPayload) => void;
}

const beforeUpload = () => false;
const mainlandIdPattern = /(^\d{15}$)|(^\d{17}[\dXx]$)/;
const passportPattern = /^[A-Za-z0-9]{5,20}$/;

const KycModal: React.FC<KycModalProps> = ({ open, onCancel, onCompleted }) => {
  const { t } = useTranslation();
  const steps = useMemo(
    () => [
      {
        title: t('personal.profile.kyc.steps.basic.title'),
        description: t('personal.profile.kyc.steps.basic.description'),
      },
      {
        title: t('personal.profile.kyc.steps.upload.title'),
        description: t('personal.profile.kyc.steps.upload.description'),
      },
      {
        title: t('personal.profile.kyc.steps.face.title'),
        description: t('personal.profile.kyc.steps.face.description'),
      },
      {
        title: t('personal.profile.kyc.steps.review.title'),
        description: t('personal.profile.kyc.steps.review.description'),
      },
    ],
    [t],
  );
  const [form] = Form.useForm<KycBasicForm>();
  const [currentStep, setCurrentStep] = useState(0);
  const [frontFiles, setFrontFiles] = useState<UploadFile[]>([]);
  const [backFiles, setBackFiles] = useState<UploadFile[]>([]);
  const [faceVerified, setFaceVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nationality = Form.useWatch('nationality', form);
  const isMainland = nationality !== 'other';

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setFrontFiles([]);
      setBackFiles([]);
      setFaceVerified(false);
      setSubmitting(false);
      form.resetFields();
    }
  }, [open, form]);

  const canGoNext = useMemo(() => {
    if (currentStep === 1) {
      if (isMainland) {
        return frontFiles.length > 0 && backFiles.length > 0;
      }
      return frontFiles.length > 0;
    }
    if (currentStep === 2) {
      return faceVerified;
    }
    return true;
  }, [currentStep, frontFiles.length, backFiles.length, faceVerified, isMainland]);

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields();
      } catch {
        return;
      }
    }

    if (currentStep === 1 && !canGoNext) {
      MessageUtils.warning(
        isMainland
          ? t('personal.profile.kyc.msg.uploadIdBoth')
          : t('personal.profile.kyc.msg.uploadPassport'),
      );
      return;
    }

    if (currentStep === 2 && !faceVerified) {
      MessageUtils.warning(t('personal.profile.kyc.msg.faceVerifyFirst'));
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFaceVerify = () => {
    setFaceVerified(true);
    MessageUtils.success(t('personal.profile.kyc.msg.faceVerifySuccess'));
  };

  const handleComplete = async () => {
    try {
      const basicInfo = await form.validateFields();
      const missingDocFiles = isMainland
        ? frontFiles.length === 0 || backFiles.length === 0
        : frontFiles.length === 0;
      if (missingDocFiles) {
        MessageUtils.warning(
          isMainland
            ? t('personal.profile.kyc.msg.completeIdBoth')
            : t('personal.profile.kyc.msg.completePassport'),
        );
        return;
      }

      setSubmitting(true);
      setTimeout(() => {
        onCompleted({
          basicInfo,
          frontFile: frontFiles[0],
          backFile: isMainland ? backFiles[0] : undefined,
        });
        setSubmitting(false);
      }, 500);
    } catch {
      // 表单验证提示由 antd 内部处理
    }
  };

  return (
    <AdminModal
      open={open}
      onCancel={onCancel}
      title={
        <div className={styles.kycModalTitle}>
          <i className="fas fa-shield-alt"></i>
          <span>{t('personal.profile.kyc.modalTitle')}</span>
        </div>
      }
      footer={null}
      size="large"
    >
      <div className={styles.kycModalBody}>
        <Steps
          current={currentStep}
          items={steps}
          className={styles.kycSteps}
          responsive
          size="small"
        />

        <div className={styles.kycStepContent}>
          {currentStep === 0 && (
            <Form<KycBasicForm> form={form} layout="vertical" requiredMark={false}>
              <Form.Item
                name="realName"
                label={t('personal.profile.kyc.forms.realName')}
                rules={[
                  { required: true, message: t('personal.profile.kyc.forms.realNameRequired') },
                  { min: 2, message: t('personal.profile.kyc.forms.realNameMin') },
                ]}
              >
                <Input placeholder={t('personal.profile.kyc.forms.realNamePlaceholder')} />
              </Form.Item>
              <Form.Item
                name="nationality"
                label={t('personal.profile.kyc.forms.nationality')}
                rules={[{ required: true, message: t('personal.profile.kyc.forms.nationalityRequired') }]}
              >
                <Select
                  placeholder={t('personal.profile.kyc.forms.nationalityPlaceholder')}
                  options={[
                    { label: t('personal.profile.kyc.forms.nationalityMainland'), value: 'cn_mainland' },
                    { label: t('personal.profile.kyc.forms.nationalityOther'), value: 'other' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="documentNumber"
                label={
                  isMainland
                    ? t('personal.profile.kyc.forms.idNumber')
                    : t('personal.profile.kyc.forms.passportNumber')
                }
                rules={[
                  {
                    required: true,
                    message: isMainland
                      ? t('personal.profile.kyc.forms.idNumberRequired')
                      : t('personal.profile.kyc.forms.passportNumberRequired'),
                  },
                  {
                    validator: async (_, value: string) => {
                      if (!value) return;
                      if (isMainland && !mainlandIdPattern.test(value)) {
                        throw new Error(t('personal.profile.kyc.forms.idNumberInvalid'));
                      }
                      if (!isMainland && !passportPattern.test(value)) {
                        throw new Error(t('personal.profile.kyc.forms.passportNumberInvalid'));
                      }
                    },
                  },
                ]}
              >
                <Input
                  placeholder={
                    isMainland
                      ? t('personal.profile.kyc.forms.idNumberPlaceholder')
                      : t('personal.profile.kyc.forms.passportNumberPlaceholder')
                  }
                />
              </Form.Item>
            </Form>
          )}

          {currentStep === 1 && (
            <div className={styles.uploadGrid}>
              <div>
                <div className={styles.uploadLabel}>
                  {isMainland
                    ? t('personal.profile.kyc.forms.idFrontPhoto')
                    : t('personal.profile.kyc.forms.passportPhoto')}
                </div>
                <Upload.Dragger
                  multiple={false}
                  maxCount={1}
                  fileList={frontFiles}
                  beforeUpload={beforeUpload}
                  onChange={(info) => setFrontFiles(info.fileList)}
                >
                  <p className="ant-upload-drag-icon">
                    <i className="fas fa-id-card"></i>
                  </p>
                  <p className="ant-upload-text">{t('personal.profile.kyc.forms.uploadHint')}</p>
                </Upload.Dragger>
              </div>

              {isMainland && (
                <div>
                  <div className={styles.uploadLabel}>{t('personal.profile.kyc.forms.idBackPhoto')}</div>
                  <Upload.Dragger
                    multiple={false}
                    maxCount={1}
                    fileList={backFiles}
                    beforeUpload={beforeUpload}
                    onChange={(info) => setBackFiles(info.fileList)}
                  >
                    <p className="ant-upload-drag-icon">
                      <i className="fas fa-id-card"></i>
                    </p>
                    <p className="ant-upload-text">{t('personal.profile.kyc.forms.uploadHint')}</p>
                  </Upload.Dragger>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.faceVerify}>
              <div className={styles.facePreview}>
                <i className="fas fa-user-circle"></i>
                <p>{t('personal.profile.kyc.forms.faceHint')}</p>
              </div>
              <AdminButton
                variant="primary"
                icon="fas fa-camera"
                onClick={handleFaceVerify}
              >
                {faceVerified
                  ? t('personal.profile.kyc.forms.faceDone')
                  : t('personal.profile.kyc.forms.faceStart')}
              </AdminButton>
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.kycReview}>
              <div className={styles.reviewIcon}>
                <i className="fas fa-clock"></i>
              </div>
              <h3>{t('personal.profile.kyc.forms.reviewTitle')}</h3>
              <p>{t('personal.profile.kyc.forms.reviewDesc')}</p>
            </div>
          )}
        </div>

        <div className={styles.kycModalFooter}>
          {currentStep > 0 && (
            <AdminButton variant="outline" icon="fas fa-arrow-left" onClick={handlePrev}>
              {t('personal.profile.kyc.prev')}
            </AdminButton>
          )}

          {currentStep < 3 && (
            <AdminButton
              variant="primary"
              icon="fas fa-arrow-right"
              onClick={handleNext}
              disabled={!canGoNext && currentStep !== 0}
            >
              {t('personal.profile.kyc.next')}
            </AdminButton>
          )}

          {currentStep === 3 && (
            <AdminButton
              variant="primary"
              icon="fas fa-check"
              onClick={handleComplete}
              loading={submitting}
            >
              {t('personal.profile.kyc.complete')}
            </AdminButton>
          )}
        </div>
      </div>
    </AdminModal>
  );
};

export default KycModal;
