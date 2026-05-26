/** 富文本编辑器插入块 class（编辑区与详情页共用） */
export const DAO_RICH_CODE_BLOCK_CLASS = 'dao-rich-code-block';
export const DAO_RICH_IMAGE_CLASS = 'dao-rich-image';

export const DAO_RICH_CODE_BLOCK_HTML = `<pre class="${DAO_RICH_CODE_BLOCK_CLASS}" spellcheck="false"><code>// </code></pre><p><br></p>`;

export const buildRichImageHtml = (dataUrl: string, alt: string): string =>
  `<p><img src="${dataUrl}" alt="${alt}" class="${DAO_RICH_IMAGE_CLASS}" /></p><p><br></p>`;
