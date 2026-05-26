import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { insertImageIntoQuillEditor } from '../utils/quillDiscussionImage';
import styles from './DaoDiscussionRichTextEditor.module.scss';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxPlainLength?: number;
  ariaLabel?: string;
};

const QUILL_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'code-block',
  'link',
  'image',
];

const normalizeQuillHtml = (html: string): string => {
  const trimmed = html.trim();
  if (!trimmed || trimmed === '<p><br></p>' || trimmed === '<p></p>') return '';
  return html;
};

const DaoDiscussionRichTextEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder = '',
  ariaLabel,
}) => {
  const { t } = useTranslation();
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/jpeg,image/png,image/gif,image/webp');
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) void insertImageIntoQuillEditor(quillRef.current, file, t);
    };
    input.click();
  }, [t]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler],
  );

  const handleChange = useCallback(
    (content: string) => {
      onChange(normalizeQuillHtml(content));
    },
    [onChange],
  );

  return (
    <div className={styles.richEditorRoot} data-editor="quill" aria-label={ariaLabel}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={QUILL_FORMATS}
        placeholder={placeholder}
      />
    </div>
  );
};

export default DaoDiscussionRichTextEditor;
