import React, { useEffect, useMemo, useState } from 'react';
import { Empty, Spin } from 'antd';
import AdminCard from '../../../components/common/AdminCard';
import MessageUtils from '../../../utils/messageUtils';
import dictionaryApi, {
  type DictCategoryInfo,
  type DictItemInfo,
  type SaveDictCategoryReq,
  type SaveDictItemReq,
} from '../../../services/api/dictionaryApi';
import DictCategoryListPanel from './components/DictCategoryListPanel';
import DictCategoryDetailPanel from './components/DictCategoryDetailPanel';
import DictItemListPanel from './components/DictItemListPanel';
import DictCategoryModal from './components/modals/DictCategoryModal';
import DictItemModal from './components/modals/DictItemModal';
import styles from './DictionariesManager.module.scss';

const DictionariesManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<DictCategoryInfo[]>([]);
  const [itemList, setItemList] = useState<DictItemInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DictCategoryInfo | null>(null);

  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [categorySearchValue, setCategorySearchValue] = useState('');

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DictItemInfo | null>(null);
  const [itemSubmitting, setItemSubmitting] = useState(false);
  const [togglingItemId, setTogglingItemId] = useState<number>();
  const [togglingCategoryId, setTogglingCategoryId] = useState<number>();

  const loadCategories = async (keyword = categoryKeyword) => {
    setLoading(true);
    try {
      const resp = await dictionaryApi.listDictCategory({
        dictType: undefined,
        code: keyword || undefined,
        status: undefined,
        page: 1,
        pageSize: 500,
      });
      const list = Array.isArray(resp.data?.list) ? resp.data.list : [];
      setCategoryList(list);
      if (list.length === 0) {
        setSelectedCategory(null);
        setItemList([]);
        return;
      }
      if (!selectedCategory) {
        setSelectedCategory(list[0]);
        return;
      }
      const current = list.find((item) => item.id === selectedCategory.id);
      setSelectedCategory(current || list[0]);
    } catch {
      MessageUtils.error('加载字典类目失败');
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async (dictType?: string) => {
    if (!dictType) {
      setItemList([]);
      return;
    }
    setItemLoading(true);
    try {
      const resp = await dictionaryApi.listDictItemByType({
        dictCategoryCode: dictType,
        status: 2,
      });
      setItemList(Array.isArray(resp.data?.list) ? resp.data.list : []);
    } catch {
      MessageUtils.error('加载字典项失败');
    } finally {
      setItemLoading(false);
    }
  };

  useEffect(() => {
    loadCategories().catch(() => undefined);
  }, []);

  useEffect(() => {
    loadItems(selectedCategory?.code).catch(() => undefined);
  }, [selectedCategory?.id]);

  const enabledItemCount = useMemo(() => itemList.filter((item) => item.status === 1).length, [itemList]);

  const handleCreateCategory = () => {
    setCategoryModalOpen(true);
  };

  const handleCategorySearch = () => {
    const nextKeyword = categorySearchValue.trim();
    setCategoryKeyword(nextKeyword);
    loadCategories(nextKeyword).catch(() => undefined);
  };

  const handleToggleCategoryStatus = async (category: DictCategoryInfo) => {
    setTogglingCategoryId(category.id);
    try {
      await dictionaryApi.saveDictCategory({
        id: category.id,
        dictType: category.dictType,
        code: category.code,
        desc: category.desc || '',
        level: category.level,
        sort: category.sort,
        status: category.status === 0 ? 1 : 0,
      });
      MessageUtils.success(category.status === 0 ? '已禁用该字典类目' : '已启用该字典类目');
      await loadCategories(categoryKeyword);
    } catch {
      MessageUtils.error('更新字典类目状态失败，请稍后重试');
    } finally {
      setTogglingCategoryId(undefined);
    }
  };

  const handleSubmitCategory = async (payload: SaveDictCategoryReq) => {
    setCategorySubmitting(true);
    try {
      await dictionaryApi.saveDictCategory(payload);
      MessageUtils.success(payload.id ? '字典类目更新成功' : '字典类目新增成功');
      if (!payload.id) {
        setCategoryModalOpen(false);
      }
      await loadCategories(categoryKeyword);
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleCreateItem = () => {
    if (!selectedCategory) {
      MessageUtils.warning('请先选择字典类目');
      return;
    }
    setEditingItem(null);
    setItemModalOpen(true);
  };

  const handleEditItem = (item: DictItemInfo) => {
    setEditingItem(item);
    setItemModalOpen(true);
  };

  const handleSubmitItem = async (payload: SaveDictItemReq) => {
    setItemSubmitting(true);
    try {
      await dictionaryApi.saveDictItem(payload);
      MessageUtils.success(payload.id ? '字典项更新成功' : '字典项新增成功');
      setItemModalOpen(false);
      await loadItems(payload.dictCategoryCode);
    } finally {
      setItemSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: DictItemInfo) => {
    setTogglingItemId(item.id);
    try {
      await dictionaryApi.saveDictItem({
        id: item.id,
        dictCategoryCode: item.dictCategoryCode,
        code: item.code,
        value: item.value,
        desc: item.desc || '',
        level: item.level,
        sort: item.sort,
        status: item.status === 1 ? 0 : 1,
      });
      MessageUtils.success(item.status === 1 ? '已禁用该字典项' : '已启用该字典项');
      await loadItems(selectedCategory?.code);
    } catch {
      MessageUtils.error('更新字典项状态失败，请稍后重试');
    } finally {
      setTogglingItemId(undefined);
    }
  };

  const handleDeleteItem = async (item: DictItemInfo) => {
    try {
      await dictionaryApi.deleteDictItem(item.id);
      MessageUtils.success('删除字典项成功');
      await loadItems(selectedCategory?.code);
    } catch {
      MessageUtils.error('删除字典项失败，请稍后重试');
    }
  };

  return (
    <div className={styles.dictionariesPage}>
      <AdminCard icon="fas fa-book" showHeader={false}>
        <Spin spinning={loading && categoryList.length === 0} tip="加载中...">
          <div className={styles.container}>
            <div className={styles.leftPanel}>
              <DictCategoryListPanel
                loading={loading}
                list={categoryList}
                selectedCategory={selectedCategory}
                keyword={categorySearchValue}
                onKeywordChange={setCategorySearchValue}
                onSearch={handleCategorySearch}
                onSelect={setSelectedCategory}
                onToggleStatus={handleToggleCategoryStatus}
                togglingCategoryId={togglingCategoryId}
                onAdd={handleCreateCategory}
              />
            </div>
            <div className={styles.rightPanel}>
              {!selectedCategory ? (
                <div className={styles.emptyPanel}>
                  <Empty description="请从左侧选择一个字典类目" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              ) : (
                <>
                  <DictCategoryDetailPanel
                    category={selectedCategory}
                    itemCount={itemList.length}
                    enabledItemCount={enabledItemCount}
                    saving={categorySubmitting}
                    togglingCategoryId={togglingCategoryId}
                    onSave={handleSubmitCategory}
                    onToggleStatus={handleToggleCategoryStatus}
                  />
                  <DictItemListPanel
                    loading={itemLoading}
                    selectedCategory={selectedCategory}
                    list={itemList}
                    onAdd={handleCreateItem}
                    onEdit={handleEditItem}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteItem}
                    togglingItemId={togglingItemId}
                    onRefresh={() => loadItems(selectedCategory.code)}
                  />
                </>
              )}
            </div>
          </div>
        </Spin>
      </AdminCard>

      <DictItemModal
        open={itemModalOpen}
        loading={itemSubmitting}
        category={selectedCategory}
        editingItem={editingItem}
        onCancel={() => setItemModalOpen(false)}
        onSubmit={handleSubmitItem}
      />

      <DictCategoryModal
        open={categoryModalOpen}
        loading={categorySubmitting}
        editingCategory={null}
        onCancel={() => setCategoryModalOpen(false)}
        onSubmit={handleSubmitCategory}
      />
    </div>
  );
};

export default DictionariesManager;
