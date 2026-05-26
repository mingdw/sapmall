import type { TFunction } from 'i18next';
import { message } from 'antd';
import type ReactQuill from 'react-quill';
import { compressImageForEditor } from './richTextMedia';

export const insertImageIntoQuillEditor = async (
  quill: ReactQuill | null,
  file: File,
  t: TFunction,
): Promise<void> => {
  const editor = quill?.getEditor();
  if (!editor) return;

  try {
    const dataUrl = await compressImageForEditor(file);
    const range = editor.getSelection(true);
    const index = range?.index ?? editor.getLength();
    editor.insertEmbed(index, 'image', dataUrl, 'user');
    editor.setSelection(index + 1, 0, 'user');
    message.success(t('dao.discussionCreate.richEditor.imageInsertSuccess'));
  } catch (err) {
    const code = err instanceof Error ? err.message : '';
    if (code === 'INVALID_TYPE') {
      message.warning(t('dao.discussionCreate.richEditor.imageInvalidType'));
    } else if (code === 'TOO_LARGE' || code === 'TOO_LARGE_AFTER_COMPRESS') {
      message.warning(t('dao.discussionCreate.richEditor.imageTooLarge'));
    } else {
      message.error(t('dao.discussionCreate.richEditor.imageUploadFailed'));
    }
  }
};
