'use client'
import React, { useState } from 'react';
import { CategoryMenu } from './CategoryMenu';

export const ProductFilterPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-7xl mx-auto mb-8">
      {/* 商品目录 */}
      <CategoryMenu />
      {/* 分割线 */}
      <div className="border-t border-gray-600 my-4"></div>
      {/* 筛选区 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs">
        {/* 左侧多行筛选标签 */}
        <div className="flex flex-col gap-2 flex-1 min-w-[300px]">
          {/* 价格 */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-gray-400 font-semibold mr-2">价格</span>
            <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">0-50 SAP</button>
            <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">50-200 SAP</button>
            <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">200-500 SAP</button>
            <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">500+ SAP</button>
          </div>
          {/* 评分 */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-gray-400 font-semibold mr-2">评分</span>
            <button className="flex items-center bg-gray-700 text-gray-200 rounded px-3 py-1"><i className="fas fa-star text-yellow-400 mr-1" />4.5+</button>
            <button className="flex items-center bg-gray-700 text-gray-200 rounded px-3 py-1"><i className="fas fa-star text-yellow-400 mr-1" />4.0+</button>
            <button className="flex items-center bg-gray-700 text-gray-200 rounded px-3 py-1">3.5+</button>
          </div>
          {/* 销量 */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-gray-400 font-semibold mr-2">销量</span>
            <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">100+ 销量</button>
            <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">500+ 销量</button>
            <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">1000+ 销量</button>
          </div>
          {/* 展开后显示的分组 */}
          {expanded && <>
            {/* 时间 */}
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-gray-400 font-semibold mr-2">时间</span>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">最近一周</button>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">最近一月</button>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">最近三月</button>
            </div>
            {/* 类型 */}
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-gray-400 font-semibold mr-2">类型</span>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">数字商品</button>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">服务类</button>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">订阅制</button>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">一次性购买</button>
            </div>
            {/* 商家 */}
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-gray-400 font-semibold mr-2">商家</span>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">官方认证</button>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">高信誉商家</button>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">新商家</button>
            </div>
            {/* 特色 */}
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-gray-400 font-semibold mr-2">特色</span>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">限时打折</button>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">免费试用</button>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">开源项目</button>
              <button className="bg-gray-700 text-gray-200 rounded px-3 py-1">独家发布</button>
            </div>
          </>}
        </div>
        {/* 右侧搜索和筛选按钮 */}
      </div>
      {/* 底部操作按钮 */}
      <div className="flex gap-2 justify-end mt-4 text-xs">
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"><i className="fas fa-trash mr-1" />清空筛选</button>
        <button
          className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg flex items-center"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? '收起筛选' : '展开筛选'}
          <i className={`fas ml-1 ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
        </button>
      </div>
    </div>
  );
};
