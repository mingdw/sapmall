import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Empty, Input, Spin, Switch } from 'antd';
import AdminButton from '../../../../components/common/AdminButton';
import { getDictCategoryTypeLabel, type DictCategoryInfo } from '../../../../services/api/dictionaryApi';
import styles from '../DictionariesManager.module.scss';

interface DictCategoryListPanelProps {
  loading: boolean;
  list: DictCategoryInfo[];
  selectedCategory: DictCategoryInfo | null;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onSelect: (category: DictCategoryInfo) => void;
  onToggleStatus: (category: DictCategoryInfo) => void;
  togglingCategoryId?: number;
  onAdd: () => void;
}

const DictCategoryListPanel: React.FC<DictCategoryListPanelProps> = ({
  loading,
  list,
  selectedCategory,
  keyword,
  onKeywordChange,
  onSearch,
  onSelect,
  onToggleStatus,
  togglingCategoryId,
  onAdd,
}) => {
  return (
    <div className={styles.panelCard}>
      <div className={styles.panelHead}>
        <h3 className={styles.panelTitle}>
          <i className="fas fa-layer-group"></i>
          字典类目
        </h3>
        <div className={styles.inlineActionsGrow}>
          <Input
            size="small"
            className={styles.categorySearchInput}
            value={keyword}
            allowClear
            placeholder="搜索类目 code/名称"
            onChange={(e) => onKeywordChange(e.target.value)}
            suffix={<SearchOutlined onClick={onSearch} style={{ cursor: 'pointer', color: '#ffffff' }} />}
          />
          <AdminButton
            variant="primary"
            size="xs"
            className={styles.addTinyButton}
            icon="fas fa-plus"
            onClick={onAdd}
          >
            新增
          </AdminButton>
        </div>
      </div>

      <Spin spinning={loading}>
        <div className={styles.categoryList}>
          {list.length === 0 ? (
            <div className={styles.emptyPanel}>
              <Empty description="暂无字典类目" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            list.map((item) => {
              const active = selectedCategory?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`${styles.categoryCard} ${active ? styles.categoryCardActive : ''}`}
                  onClick={() => onSelect(item)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.categoryRow}>
                    <span className={styles.categoryCodeInline}>{item.code}</span>
                    <span className={styles.categoryNameInline}>{item.desc || '-'}</span>
                    <span className={styles.inlineActions}>
                      <Switch
                        size="small"
                        checked={item.status === 0}
                        className={`${styles.categoryStatusSwitch} ${
                          item.status === 0 ? styles.categoryStatusSwitchOn : styles.categoryStatusSwitchOff
                        }`}
                        loading={togglingCategoryId === item.id}
                        onClick={(checked, event) => {
                          event?.stopPropagation();
                          onToggleStatus(item);
                        }}
                      />
                      <span className={item.status === 0 ? styles.statusTextEnabled : styles.statusTextDisabled}>
                        {item.status === 0 ? '启用' : '禁用'}
                      </span>
                      <span className={styles.dictTypeTag}>{getDictCategoryTypeLabel(item.dictType)}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Spin>
    </div>
  );
};

export default DictCategoryListPanel;
