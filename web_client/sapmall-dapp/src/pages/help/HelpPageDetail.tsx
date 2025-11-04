import React, { useState, useEffect } from 'react';
import { helpApiService } from '../../services/api/helpApiService';
import { Category, FAQ, GuideStep } from './helpData';
import styles from './HelpPageDetail.module.scss';

const HelpPageDetail: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [guideSteps, setGuideSteps] = useState<GuideStep[]>([]);
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<(Category | FAQ | GuideStep)[]>([]);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, faqsData, guideStepsData] = await Promise.all([
          helpApiService.getCategories(),
          helpApiService.getFAQs(),
          helpApiService.getGuideSteps()
        ]);
        setCategories(categoriesData);
        setFaqs(faqsData);
        setGuideSteps(guideStepsData);
      } catch (error) {
        console.error('加载帮助中心数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 搜索功能
  useEffect(() => {
    const searchData = async () => {
      if (searchQuery.trim()) {
        try {
          const results = await helpApiService.searchHelpContent(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('搜索失败:', error);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchData();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // 切换FAQ展开/收起
  const toggleFaq = (faqId: number) => {
    setExpandedFaqId(expandedFaqId === faqId ? null : faqId);
  };

  // 获取图标组件
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'wallet': return <i className={`fas fa-wallet ${styles.textWhite} ${styles.text2xl}`} />;
      case 'exchange-alt': return <i className={`fas fa-exchange-alt ${styles.textWhite} ${styles.text2xl}`} />;
      case 'coins': return <i className={`fas fa-coins ${styles.textWhite} ${styles.text2xl}`} />;
      case 'vote-yea': return <i className={`fas fa-vote-yea ${styles.textWhite} ${styles.text2xl}`} />;
      case 'shield-alt': return <i className={`fas fa-shield-alt ${styles.textWhite} ${styles.text2xl}`} />;
      case 'bug': return <i className={`fas fa-bug ${styles.textWhite} ${styles.text2xl}`} />;
      default: return <i className={`fas fa-question-circle ${styles.textWhite} ${styles.text2xl}`} />;
    }
  };

  // 获取渐变类
  const getGradientClass = (color: string) => {
    switch (color) {
      case 'from-sapphire-500 to-sapphire-600': return styles.gradientSapphire;
      case 'from-green-500 to-green-600': return styles.gradientGreen;
      case 'from-purple-500 to-purple-600': return styles.gradientPurple;
      case 'from-yellow-500 to-orange-600': return styles.gradientYellow;
      case 'from-red-500 to-pink-600': return styles.gradientRed;
      case 'from-indigo-500 to-blue-600': return styles.gradientIndigo;
      default: return styles.gradientSapphire;
    }
  };

  return (
    <div className={styles.helpPage}>      
      <div className={`${styles.maxW7xl} ${styles.mxAuto} ${styles.py6} ${styles.px4}`}>
        {/* 帮助中心头部 */}
        <div className={styles.mb8}>
          <div className={`${styles.glassBg} ${styles.roundedXl} ${styles.p8} ${styles.textCenter} ${styles.border} ${styles.borderGray70050}`}>
            <h1 className={`${styles.text3xl} ${styles.fontBold} ${styles.textWhite} ${styles.mb4}`}>帮助中心</h1>
            <p className={`${styles.textGray400} ${styles.mb6}`}>欢迎来到 Sapphire Mall 帮助中心，这里为您提供全面的使用指南和技术支持</p>
            
            {/* 搜索框 */}
            <div className={`${styles.maxW2xl} ${styles.mxAuto}`}>
              <div className={`${styles.searchBox} ${styles.roundedLg} ${styles.p4} ${styles.flex} ${styles.itemsCenter} ${styles.border} ${styles.borderGray60050}`}>
                <i className={`fas fa-search ${styles.textGray400} ${styles.mr3}`} />
                <input 
                  type="text" 
                  placeholder="搜索帮助内容..." 
                  className={`${styles.bgTransparent} ${styles.flex1} ${styles.outlineNone} ${styles.textWhite} ${styles.placeholderGray400}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className={`${styles.contactButton} ${styles.textWhite} ${styles.px4} ${styles.py2} ${styles.roundedLg} ${styles.fontMedium} ${styles.ml3} ${styles.hoverFromSapphire600} ${styles.hoverToSapphire700} ${styles.transitionAll}`}>
                  搜索
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索结果 */}
        {searchResults.length > 0 && (
          <div className={styles.mb8}>
            <div className={`${styles.glassBg} ${styles.roundedXl} ${styles.p6} ${styles.border} ${styles.borderGray70050}`}>
              <h2 className={`${styles.textXl} ${styles.fontBold} ${styles.mb4} ${styles.textWhite}`}>搜索结果 ({searchResults.length})</h2>
              <div className={styles.gap4} style={{display: 'flex', flexDirection: 'column'}}>                {searchResults.map((result) => (
                  <div key={(result as any).id} className={`${styles.searchResultItem} ${styles.roundedLg} ${styles.p4} ${styles.border} ${styles.borderGray60050}`}>
                    {('icon' in result && 'color' in result) ? (
                      // 分类结果
                      <div className={`${styles.contactInfoItem}`}>
                        <div className={`${styles.w12} ${styles.h12} ${getGradientClass(result.color)} ${styles.roundedFull} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter} ${styles.mr4}`}>
                          {getIcon(result.icon)}
                        </div>
                        <div>
                          <h3 className={`${styles.fontBold} ${styles.textWhite}`}>{result.title}</h3>
                          <p className={`${styles.textSm} ${styles.textGray400}`}>{result.description}</p>
                        </div>
                      </div>
                    ) : ('question' in result) ? (
                      // FAQ结果
                      <div>
                        <h3 className={`${styles.fontBold} ${styles.textWhite}`}>{result.question}</h3>
                        <p className={`${styles.textGray400} ${styles.textSm} ${styles.mt2}`} dangerouslySetInnerHTML={{ __html: result.answer }} />
                      </div>
                    ) : ('id' in result && 'title' in result) ? (
                      // 指南结果
                      <div>
                        <h3 className={`${styles.fontBold} ${styles.textWhite}`}>{result.title}</h3>
                        <p className={`${styles.textGray400} ${styles.textSm} ${styles.mt2}`}>{result.description}</p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className={`${styles.grid} ${styles.gridCols1} ${styles.lgGridCols4} ${styles.gap6}`}>
            {/* 主要内容区域 */}
            <div className={`${styles.lgColSpan3} ${styles.gap6}`} style={{display: 'flex', flexDirection: 'column'}}>
              {/* 快速分类 */}
              <div className={`${styles.glassBg} ${styles.roundedXl} ${styles.p6} ${styles.border} ${styles.borderGray70050}`}>
                <h2 className={`${styles.textXl} ${styles.fontBold} ${styles.mb6} ${styles.textWhite}`}>快速导航</h2>
                
                <div className={`${styles.grid} ${styles.gridCols1} ${styles.mdGridCols3} ${styles.gap4}`}>
                  {isLoading ? (
                    // 加载状态
                    Array(6).fill(0).map((_, index) => (
                      <div key={index} className={`${styles.bgGray70050} ${styles.roundedLg} ${styles.p6} ${styles.textCenter} ${styles.animatePulse}`}>
                        <div className={`${styles.w16} ${styles.h16} ${styles.bgGray600} ${styles.roundedFull} ${styles.mxAuto} ${styles.mb4}`} />
                        <div className={`${styles.h4} ${styles.bgGray600} ${styles.rounded} ${styles.w23} ${styles.mxAuto} ${styles.mb2}`} />
                        <div className={`${styles.h3} ${styles.bgGray600} ${styles.rounded} ${styles.w12} ${styles.mxAuto}`} />
                      </div>
                    ))
                  ) : (
                    categories.map(category => (
                      <div key={category.id} className={`${styles.categoryCard} ${styles.roundedLg} ${styles.p6} ${styles.textCenter} ${styles.hoverBgGray70070} ${styles.hoverTranslateY1} ${styles.transitionAll} ${styles.border} ${styles.borderGray60050}`}>
                        <div className={`${styles.w16} ${styles.h16} ${getGradientClass(category.color)} ${styles.roundedFull} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter} ${styles.mxAuto} ${styles.mb4}`}>
                          {getIcon(category.icon)}
                        </div>
                        <h3 className={`${styles.fontBold} ${styles.mb2} ${styles.textWhite}`}>{category.title}</h3>
                        <p className={`${styles.textSm} ${styles.textGray400}`}>{category.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 常见问题 */}
              <div className={`${styles.glassBg} ${styles.roundedXl} ${styles.p6} ${styles.border} ${styles.borderGray70050}`}>
                <h2 className={`${styles.textXl} ${styles.fontBold} ${styles.mb6} ${styles.textWhite}`}>常见问题</h2>
                
                <div className={styles.gap4} style={{display: 'flex', flexDirection: 'column'}}>
                  {isLoading ? (
                    // 加载状态
                    Array(5).fill(0).map((_, index) => (
                      <div key={index} className={`${styles.bgGray70050} ${styles.roundedLg} ${styles.p4} ${styles.animatePulse}`}>
                        <div className={`${styles.flex} ${styles.itemsCenter} ${styles.justifyBetween} ${styles.mb3}`}>
                          <div className={`${styles.h4} ${styles.bgGray600} ${styles.rounded} ${styles.w34}`} />
                          <div className={`${styles.h4} ${styles.bgGray600} ${styles.rounded} ${styles.w6}`} />
                        </div>
                        <div className={styles.gap2} style={{display: 'flex', flexDirection: 'column'}}>
                          <div className={`${styles.h3} ${styles.bgGray600} ${styles.rounded} ${styles.wFull}`} />
                          <div className={`${styles.h3} ${styles.bgGray600} ${styles.rounded} ${styles.w56}`} />
                          <div className={`${styles.h3} ${styles.bgGray600} ${styles.rounded} ${styles.w46}`} />
                        </div>
                      </div>
                    ))
                  ) : (
                    faqs.map(faq => (
                      <div key={faq.id} className={`${styles.faqItem} ${styles.roundedLg} ${styles.p4} ${expandedFaqId === faq.id ? styles.expanded : ''} ${styles.border} ${styles.borderGray60050}`}>
                        <div className={`${styles.flex} ${styles.itemsCenter} ${styles.justifyBetween} ${styles.cursorPointer}`} onClick={() => toggleFaq(faq.id)}>
                          <h3 className={`${styles.fontBold} ${styles.textWhite}`}>{faq.question}</h3>
                          <i className={`fas fa-chevron-down ${styles.transitionTransform} ${styles.duration300} ${expandedFaqId === faq.id ? styles.rotate180 : ''}`} />
                        </div>
                        {expandedFaqId === faq.id && (
                          <div className={styles.mt4}>
                            <p className={`${styles.textGray400} ${styles.textSm}`} dangerouslySetInnerHTML={{ __html: faq.answer }} />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 操作指南 */}
              <div className={`${styles.glassBg} ${styles.roundedXl} ${styles.p6} ${styles.border} ${styles.borderGray70050}`}>
                <h2 className={`${styles.textXl} ${styles.fontBold} ${styles.mb6} ${styles.textWhite}`}>新手指南</h2>
                
                <div className={styles.gap4} style={{display: 'flex', flexDirection: 'column'}}>
                  {isLoading ? (
                    // 加载状态
                    Array(5).fill(0).map((_, index) => (
                      <div key={index} className={`${styles.bgGray70050} ${styles.roundedLg} ${styles.p4} ${styles.animatePulse}`}>
                        <div className={`${styles.flex} ${styles.itemsStart} ${styles.spaceX4}`}>
                          <div className={`${styles.w8} ${styles.h8} ${styles.bgGray600} ${styles.roundedFull} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter} ${styles.fontBold} ${styles.textSm}`} />
                          <div className={styles.flex1}>
                            <div className={`${styles.h4} ${styles.bgGray600} ${styles.rounded} ${styles.w12} ${styles.mb2}`} />
                            <div className={`${styles.h3} ${styles.bgGray600} ${styles.rounded} ${styles.wFull}`} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    guideSteps.map(step => (
                      <div key={step.id} className={`${styles.guideStep} ${styles.roundedLg} ${styles.p4} ${styles.border} ${styles.borderGray60050}`}>
                        <div className={`${styles.flex} ${styles.itemsStart} ${styles.spaceX4}`}>
                          <div className={`${styles.stepNumber} ${styles.w8} ${styles.h8} ${styles.bgSapphire500} ${styles.textWhite} ${styles.roundedFull} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter} ${styles.fontBold} ${styles.textSm}`}>{step.id}</div>
                          <div className={styles.flex1}>
                            <h3 className={`${styles.fontBold} ${styles.mb2} ${styles.textWhite}`}>{step.title}</h3>
                            <p className={`${styles.textGray400} ${styles.textSm}`}>{step.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 联系支持 */}
            <div className={styles.gap6} style={{display: 'flex', flexDirection: 'column'}}>
              <div className={`${styles.glassBg} ${styles.roundedXl} ${styles.p6} ${styles.border} ${styles.borderGray70050}`}>
                <h2 className={`${styles.textXl} ${styles.fontBold} ${styles.mb4} ${styles.textWhite}`}>联系支持</h2>
                <div className={styles.gap4} style={{display: 'flex', flexDirection: 'column'}}>
                  <div className={`${styles.contactInfoItem}`}>
                    <div className={`${styles.contactInfoIcon} ${styles.w10} ${styles.h10} ${styles.bgSapphire50030} ${styles.roundedFull} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter}`}>
                      <i className={`fas fa-envelope ${styles.textSapphire400}`} />
                    </div>
                    <div>
                      <div className={`${styles.textSm} ${styles.textGray400}`}>邮箱</div>
                      <div className={`${styles.textWhite} ${styles.fontMedium}`}>support@sapphiremall.io</div>
                    </div>
                  </div>
                  
                  <div className={`${styles.contactInfoItem}`}>
                    <div className={`${styles.contactInfoIcon} ${styles.w10} ${styles.h10} ${styles.bgSapphire50030} ${styles.roundedFull} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter}`}>
                      <i className={`fas fa-discord ${styles.textSapphire400}`} />
                    </div>
                    <div>
                      <div className={`${styles.textSm} ${styles.textGray400}`}>Discord</div>
                      <div className={`${styles.textWhite} ${styles.fontMedium}`}>SapphireMall</div>
                    </div>
                  </div>
                  
                  <div className={`${styles.contactInfoItem}`}>
                    <div className={`${styles.contactInfoIcon} ${styles.w10} ${styles.h10} ${styles.bgSapphire50030} ${styles.roundedFull} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter}`}>
                      <i className={`fas fa-twitter ${styles.textSapphire400}`} />
                    </div>
                    <div>
                      <div className={`${styles.textSm} ${styles.textGray400}`}>Twitter</div>
                      <div className={`${styles.textWhite} ${styles.fontMedium}`}>@SapphireMall</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`${styles.glassBg} ${styles.roundedXl} ${styles.p6} ${styles.border} ${styles.borderGray70050}`}>
                <h2 className={`${styles.textXl} ${styles.fontBold} ${styles.mb4} ${styles.textWhite}`}>在线状态</h2>
                <div className={`${styles.supportStatus} ${styles.flex} ${styles.itemsCenter} ${styles.spaceX3}`}>
                  <div className={`${styles.statusIndicator} ${styles.statusOnline} ${styles.w3} ${styles.h3} ${styles.roundedFull} ${styles.animatePulse}`} />
                  <div className={styles.textWhite}>在线支持</div>
                </div>
                <div className={styles.mt4}>
                  <p className={`${styles.textGray400} ${styles.textSm}`}>我们的支持团队随时为您服务</p>
                  <button className={`${styles.contactButton} ${styles.mt3} ${styles.wFull} ${styles.textWhite} ${styles.px4} ${styles.py3} ${styles.roundedLg} ${styles.fontMedium} ${styles.hoverFromSapphire600} ${styles.hoverToSapphire700} ${styles.transitionAll}`}>
                    开始聊天
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpPageDetail;
