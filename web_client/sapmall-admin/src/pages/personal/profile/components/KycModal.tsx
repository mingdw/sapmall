import React, { useEffect, useMemo, useState } from 'react';
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

const steps = [
  { title: '填写基本信息', description: '提供真实姓名、国籍与证件号' },
  { title: '上传证件照片', description: '大陆上传身份证，其它上传护照信息页' },
  { title: '人脸验证', description: '完成在线人脸验证' },
  { title: '等待审核', description: '1-3个工作日内完成审核' },
];

const beforeUpload = () => false;
const mainlandIdPattern = /(^\d{15}$)|(^\d{17}[\dXx]$)/;
const passportPattern = /^[A-Za-z0-9]{5,20}$/;

const KycModal: React.FC<KycModalProps> = ({ open, onCancel, onCompleted }) => {
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
      MessageUtils.warning(isMainland ? '请上传身份证正反面照片' : '请上传护照信息页照片');
      return;
    }

    if (currentStep === 2 && !faceVerified) {
      MessageUtils.warning('请先完成人脸验证');
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFaceVerify = () => {
    setFaceVerified(true);
    MessageUtils.success('人脸验证通过（模拟）');
  };

  const handleComplete = async () => {
    try {
      const basicInfo = await form.validateFields();
      const missingDocFiles = isMainland
        ? frontFiles.length === 0 || backFiles.length === 0
        : frontFiles.length === 0;
      if (missingDocFiles) {
        MessageUtils.warning(isMainland ? '请补全身份证正反面照片' : '请补全护照信息页照片');
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
          <span>KYC身份认证</span>
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
                label="真实姓名"
                rules={[
                  { required: true, message: '请输入真实姓名' },
                  { min: 2, message: '姓名长度至少 2 位' },
                ]}
              >
                <Input placeholder="请输入您的真实姓名" />
              </Form.Item>
              <Form.Item
                name="nationality"
                label="国籍 / 地区"
                rules={[
                  { required: true, message: '请选择国籍/地区' },
                ]}
              >
                <Select
                  placeholder="请选择国籍/地区"
                  options={[
                    { label: '中国大陆', value: 'cn_mainland' },
                    { label: '其他国家/地区', value: 'other' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="documentNumber"
                label={isMainland ? '身份证号' : '护照号'}
                rules={[
                  { required: true, message: isMainland ? '请输入身份证号' : '请输入护照号' },
                  {
                    validator: async (_, value: string) => {
                      if (!value) return;
                      if (isMainland && !mainlandIdPattern.test(value)) {
                        throw new Error('请输入正确的身份证号');
                      }
                      if (!isMainland && !passportPattern.test(value)) {
                        throw new Error('请输入正确的护照号');
                      }
                    },
                  },
                ]}
              >
                <Input placeholder={isMainland ? '请输入18位身份证号码' : '请输入护照号码'} />
              </Form.Item>
            </Form>
          )}

          {currentStep === 1 && (
            <div className={styles.uploadGrid}>
              <div>
                <div className={styles.uploadLabel}>{isMainland ? '身份证正面照片' : '护照信息页照片'}</div>
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
                  <p className="ant-upload-text">点击上传或拖拽文件到此处</p>
                </Upload.Dragger>
              </div>

              {isMainland && (
                <div>
                  <div className={styles.uploadLabel}>身份证背面照片</div>
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
                    <p className="ant-upload-text">点击上传或拖拽文件到此处</p>
                  </Upload.Dragger>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.faceVerify}>
              <div className={styles.facePreview}>
                <i className="fas fa-user-circle"></i>
                <p>请确保光线充足，面部清晰可见</p>
              </div>
              <AdminButton
                variant="primary"
                icon="fas fa-camera"
                onClick={handleFaceVerify}
              >
                {faceVerified ? '已完成人脸验证' : '开始人脸验证'}
              </AdminButton>
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.kycReview}>
              <div className={styles.reviewIcon}>
                <i className="fas fa-clock"></i>
              </div>
              <h3>您的KYC认证申请已提交</h3>
              <p>我们将在1-3个工作日内完成审核，请耐心等待</p>
            </div>
          )}
        </div>

        <div className={styles.kycModalFooter}>
          {currentStep > 0 && (
            <AdminButton variant="outline" icon="fas fa-arrow-left" onClick={handlePrev}>
              上一步
            </AdminButton>
          )}

          {currentStep < 3 && (
            <AdminButton
              variant="primary"
              icon="fas fa-arrow-right"
              onClick={handleNext}
              disabled={!canGoNext && currentStep !== 0}
            >
              下一步
            </AdminButton>
          )}

          {currentStep === 3 && (
            <AdminButton
              variant="primary"
              icon="fas fa-check"
              onClick={handleComplete}
              loading={submitting}
            >
              完成
            </AdminButton>
          )}
        </div>
      </div>
    </AdminModal>
  );
};

export default KycModal;
