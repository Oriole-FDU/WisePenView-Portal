import { REGISTER_URL, openPortalLink } from '@/config/portalLinks';
import logoIconAqua from '@/assets/logos/logo-icon-aqua.svg';
import { FilePenLine, FileText, Folder, Globe, GraduationCap, Grid3x3, Link2, Monitor, NotebookText, Table2, UserCog, Users } from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DemoPlayer from './DemoPlayer';
import RollingNumber from './RollingNumber';
import GlassBackdrop from './GlassBackdrop';
import Reveal from './Reveal';
import { useDemoStep } from './useDemoStep';
import { useTypewriter } from './useTypewriter';
import styles from './style.module.less';

/** WisePenView aqua 主题的正式 logo */
function BrandMark() {
  return <img className={styles.brandMark} src={logoIconAqua} alt="" aria-hidden="true" />;
}

/** 滚动到门户区块（SPA 内 .root 为滚动容器，需 scrollIntoView 而非 #hash） */
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function IconNote() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5h16v14H4z" />
      <path d="M4 9h16" />
      <path d="M8 13h6" />
    </svg>
  );
}

/** 知识库支持格式的精美图标徽章（Lucide） */
function FormatIcon({ kind }: { kind: string }) {
  const size = 11;
  switch (kind) {
    case 'pdf':
      return <FileText size={size} strokeWidth={2.5} />;
    case 'word':
      return <FilePenLine size={size} strokeWidth={2.5} />;
    case 'ppt':
      return <Monitor size={size} strokeWidth={2.5} />;
    case 'excel':
      return <Table2 size={size} strokeWidth={2.5} />;
    default:
      return <Grid3x3 size={size} strokeWidth={2.5} />;
  }
}

function IconChart() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
    </svg>
  );
}

function IconText() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </svg>
  );
}

function ProductIcon({ kind }: { kind: 'note' | 'chart' | 'text' }) {
  if (kind === 'note') return <IconNote />;
  if (kind === 'chart') return <IconChart />;
  return <IconText />;
}

/** 资源类型图标（lucide）：文件夹 / PDF / DOC / 链接，颜色由 .resourceIcon* 类控制 */
function FileTypeIcon({ type }: { type: string }) {
  const size = 12;
  if (type === 'folder') return <Folder size={size} aria-hidden="true" />;
  if (type === 'PDF') return <FileText size={size} aria-hidden="true" />;
  if (type === 'DOC') return <FilePenLine size={size} aria-hidden="true" />;
  return <Link2 size={size} aria-hidden="true" />;
}

/** 打字机文本：逐字渲染 + 光标闪烁（active 由外部阶段控制） */
function TypewriterLine({ text, active, speed = 30 }: { text: string; active: boolean; speed?: number }) {
  const count = useTypewriter(text, speed, active);
  return (
    <span className={styles.twLine}>
      {text.slice(0, count)}
      <span className={styles.caret} aria-hidden="true" />
    </span>
  );
}

/**
 * 顺序打字机（多行）：上一行打完后下一行紧接着开始，逐行依次输出。
 * active 由外部阶段控制：关闭（step 0 / 离开视口）时整段清空，呈现空白输入框；
 * 重新激活时从第一行重新打字，实现每次循环重打。
 */
function PromptTyping({ lines, active }: { lines: string[]; active: boolean }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [count, setCount] = useState(0);
  const linesRef = useRef(lines);
  linesRef.current = lines;

  /**
   * @wisepen-manual-effect
   * 执行时机：active 变化时启动/停止逐字计时器。
   * 不可替代原因：打字机必须逐字定时推进，setInterval 是唯一可靠的时序来源。
   * cleanup：清除计时器。
   */
  useEffect(() => {
    // 未激活时整段清空，保证 step 0 是空白输入框
    if (!active) {
      setLineIdx(0);
      setCount(0);
      return;
    }

    let li = 0;
    let n = 0;
    const timer = setInterval(() => {
      const len = linesRef.current[li].length;
      n += 1;
      if (n > len) {
        li += 1;
        if (li >= linesRef.current.length) {
          clearInterval(timer);
          return;
        }
        n = 1;
        setLineIdx(li);
      }
      setCount(n);
    }, 30);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <>
      {lines.map((line, i) => (
        <div className={styles.editorPromptLine} key={i}>
          {i < lineIdx ? line : i === lineIdx ? line.slice(0, count) : ''}
        </div>
      ))}
    </>
  );
}

/** Hero 聊天对话 mockup（ChatPanel 风格）：会话列表 + 消息区 + 输入框 */
function HeroChat() {
  const { t } = useTranslation('shell');
  const convs = t('home.hero.conversations', { returnObjects: true }) as string[];
  const aiItems = t('home.hero.chatAiMsgItems', { returnObjects: true }) as string[];
  const [stepEl, step] = useDemoStep();
  // 阶段 1 起 AI 开始打字（引导句），阶段 2 要点整段淡入
  const aiTyping = step >= 1;

  return (
    <div className={styles.chatLayout} ref={stepEl}>
      <aside className={styles.conversationList}>
        <div className={styles.convNew}>{t('home.hero.chatNew')}</div>
        {convs.map((name, i) => (
          <div className={i === 0 ? styles.convItemActive : styles.convItem} key={name}>
            <span className={i === 0 ? styles.convMarkActive : styles.convMark} />
            {name}
          </div>
        ))}
      </aside>
      <div className={styles.chatMain}>
        <div className={styles.chatHeader}>
          <b>{convs[0]}</b>
          <span>
            {t('home.hero.chatAiName')} <i className={styles.onlineDot} />
          </span>
        </div>
        <div className={styles.messageArea}>
          <div className={styles.msgUser}>{t('home.hero.chatUserMsg')}</div>
          <div className={styles.msgAi}>
            <span className={styles.aiAvatar}>W</span>
            <div className={styles.msgAiBody}>
              <TypewriterLine text={t('home.hero.chatAiMsgLead')} active={aiTyping} />
              <span className={styles.dots}><i /><i /><i /></span>
              {aiItems.map((item, i) => (
                <div className={styles.aiAnswerItem} key={i}>
                  <span className={styles.aiAnswerBullet} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.chatInput}>
          <span>{t('home.hero.chatPlaceholder')}</span>
          <b>↑</b>
        </div>
      </div>
    </div>
  );
}

function AgentEditorDemo() {
  const { t } = useTranslation('shell');
  const nav = t('home.aiFeature.agentEditor.nav', { returnObjects: true }) as string[];
  const promptLines = t('home.aiFeature.agentEditor.promptLines', { returnObjects: true }) as string[];
  const capabilities = t('home.aiFeature.agentEditor.capabilities', { returnObjects: true }) as string[];
  const [stepEl, step] = useDemoStep();
  const aiTyping = step >= 1;

  return (
    <div className={styles.editorWindow} ref={stepEl}>
      <aside className={styles.editorSidebar}>
        {nav.map((item, i) => (
          <div className={i === 0 ? styles.editorNavActive : styles.editorNav} key={item}>
            <span className={i === 0 ? styles.navDotActive : styles.navDot} />
            {item}
          </div>
        ))}
      </aside>
      <div className={styles.editorMain}>
        <div className={styles.editorSection}>
          <label className={styles.editorLabel}>{t('home.aiFeature.agentEditor.basicLabel')}</label>
          <div className={styles.editorInput}>{t('home.aiFeature.agentEditor.basicValue')}</div>
          <div className={styles.editorHint}>{t('home.aiFeature.agentEditor.basicHint')}</div>
        </div>
        <div className={styles.editorSection}>
          <label className={styles.editorLabel}>{t('home.aiFeature.agentEditor.promptLabel')}</label>
          <div className={styles.editorPromptArea}>
            <PromptTyping lines={promptLines} active={aiTyping} />
          </div>
        </div>
        <div className={styles.editorSection}>
          <label className={styles.editorLabel}>{t('home.aiFeature.agentEditor.modelLabel')}</label>
          <div className={styles.editorModelCard}>
            <span className={styles.modelIcon}>✦</span>
            <div>
              <b>{t('home.aiFeature.agentEditor.modelText')}</b>
              <small>{t('home.aiFeature.agentEditor.modelMeta')}</small>
            </div>
          </div>
        </div>
        <div className={styles.editorSection}>
          <label className={styles.editorLabel}>{t('home.aiFeature.agentEditor.capabilityLabel')}</label>
          <div className={styles.editorTagRow}>
            {capabilities.map((cap) => (
              <span className={styles.editorTag} key={cap}>{cap}</span>
            ))}
          </div>
        </div>
        <div className={styles.editorSave}>{t('home.aiFeature.agentEditor.saveBtn')}</div>
      </div>
    </div>
  );
}

/** 散落文件卡片（装饰）：围绕主收藏夹窗口散落摆放，模拟"散落的信息"主题 */
function ScatteredFiles() {
  const { t } = useTranslation('shell');
  const files = t('home.knowledgeFeature.files', { returnObjects: true }) as { ext: string; name: string; meta: string }[];
  const [stepEl, step] = useDemoStep();

  function renderIcon(ext: string) {
    const size = 14;
    if (ext === 'PDF') return <FileText size={size} aria-hidden="true" />;
    if (ext === 'Html') return <Globe size={size} aria-hidden="true" />;
    if (ext === 'DOC') return <FilePenLine size={size} aria-hidden="true" />;
    if (ext === 'link') return <Link2 size={size} aria-hidden="true" />;
    return <NotebookText size={size} aria-hidden="true" />;
  }

  // 每张卡片定义不同的旋转、偏移和浮动偏移
  const cards = [
    { ext: 'PDF', name: files[0]?.name ?? '认知心理学研究.pdf', color: '#e74c3c', top: '4%', left: '2%', rotate: -4.5, floatY: -6 },
    { ext: 'Html', name: files[1]?.name ?? '注意力机制综述', color: '#2e86de', top: '12%', right: '4%', rotate: 3.2, floatY: 8 },
    { ext: 'DOC', name: files[2]?.name ?? '课堂笔记合集.docx', color: '#2980b9', top: '48%', left: '3%', rotate: -2.8, floatY: -4 },
    { ext: 'link', name: '论文参考文献', color: '#8e44ad', bottom: '6%', right: '3%', rotate: 5.5, floatY: 5 },
    { ext: 'note', name: '实验数据记录', color: '#d35400', top: '38%', right: '2%', rotate: -6.2, floatY: -7 },
  ];

  return (
    <div ref={stepEl} className={styles.scatteredLayer} aria-hidden="true">
      {cards.map((card, i) => (
        <div
          key={i}
          className={styles.scatterCard}
          style={
            {
              '--rot': `${card.rotate}deg`,
              '--float-y': `${card.floatY}px`,
              '--card-color': card.color,
              '--i': i,
              top: card.top,
              left: card.left as string | undefined,
              right: card.right as string | undefined,
              bottom: card.bottom as string | undefined,
            } as CSSProperties
          }
        >
          <div className={styles.scatterCardBar}>
            <span className={styles.scatterCardDot} />
            <span className={styles.scatterCardDot} />
            <span className={styles.scatterCardDot} />
          </div>
          <div className={styles.scatterCardBody}>
            <span className={styles.scatterCardIcon} style={{ background: card.color }}>
              {renderIcon(card.ext)}
            </span>
            <span className={styles.scatterCardName}>{card.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** 知识库/收藏夹 mockup（FavoritesTab 风格）：收藏集列表 + 资源列表 */
function FavoritesDemo() {
  const { t } = useTranslation('shell');
  const collections = t('home.knowledgeFeature.favorites.collections', { returnObjects: true }) as { name: string; count: number }[];
  const resourceItems = t('home.knowledgeFeature.favorites.resources.items', { returnObjects: true }) as { name: string; type: string; date: string; size: string }[];
  const [stepEl, step] = useDemoStep();

  return (
    <div className={styles.favoritesWindow} ref={stepEl}>
      <aside className={styles.collectionPanel}>
        <div className={styles.collectionHeader}>
          <b>{t('home.knowledgeFeature.favorites.title')}</b>
          <span className={styles.collectionNew}>{t('home.knowledgeFeature.favorites.newCollection')}</span>
        </div>
        {collections.map((col, i) => (
          <div className={i === 0 ? styles.collectionItemActive : styles.collectionItem} key={col.name}>
            <span className={i === 0 ? styles.collectionMarkActive : styles.collectionMark} />
            <span className={styles.collectionName}>{col.name}</span>
            <span className={styles.collectionCount}>{col.count}</span>
          </div>
        ))}
      </aside>
      <div className={styles.resourcePanel}>
        <div className={styles.resourceHeader}>
          <b>{t('home.knowledgeFeature.favorites.folderName')}</b>
          <span className={styles.resourceCount}>24</span>
        </div>
        <div className={styles.resourceList}>
          <div className={styles.resourceRowHeader}>
            <span>{t('home.knowledgeFeature.favorites.resources.header')}</span>
            <span>{t('home.knowledgeFeature.favorites.resources.modified')}</span>
            <span>{t('home.knowledgeFeature.favorites.resources.size')}</span>
          </div>
          {resourceItems.map((item, i) => (
            <div className={styles.resourceRow} key={item.name}>
              <span className={styles.resourceName}>
                <span
                  className={
                    item.type === 'folder'
                      ? styles.resourceIconFolder
                      : item.type === 'PDF'
                        ? styles.resourceIconPdf
                        : item.type === 'DOC'
                          ? styles.resourceIconDoc
                          : styles.resourceIconLink
                  }
                >
                  <FileTypeIcon type={item.type} />
                </span>
                {item.name}
              </span>
              <span className={styles.resourceDate}>{item.date}</span>
              <span className={styles.resourceSize}>{item.size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 课题组详情 mockup（GroupDetail 风格）：封面 + 标签栏 + 成员列表（翻页） */
function GroupDetailDemo() {
  const { t } = useTranslation('shell');
  const memberList = t('home.teamFeature.groupDetail.members', { returnObjects: true }) as { name: string; role: string; avatar: string }[];
  const memberListPage2 = t('home.teamFeature.groupDetail.membersPage2', { returnObjects: true }) as { name: string; role: string; avatar: string }[];
  const tabs = t('home.teamFeature.groupDetail.tabs', { returnObjects: true }) as string[];
  const roleLabels = t('home.teamFeature.groupDetail.roleLabels', { returnObjects: true }) as Record<string, string>;
  const [stepEl, step] = useDemoStep();

  // step1 翻页到下一页成员，step2 回到首页显示"已加载全部"（终态停留）
  const page = step >= 1 && memberListPage2?.length ? 2 : 1;

  return (
    <div className={styles.groupWindow} ref={stepEl}>
      <div className={styles.groupCover}>
        <span className={styles.groupBadge}>{t('home.teamFeature.status')}</span>
        <div className={styles.waveLine} />
      </div>
      <div className={styles.groupInfo}>
        <b>{t('home.teamFeature.groupDetail.title')}</b>
        <p>{t('home.teamFeature.groupDetail.desc')}</p>
      </div>
      <div className={styles.groupTabBar}>
        {tabs.map((tab, i) => (
          <span className={i === 0 ? styles.groupTabActive : styles.groupTab} key={tab}>
            {tab}
          </span>
        ))}
      </div>
      <div className={styles.groupMemberList}>
        <div className={`${styles.groupMemberPage} ${page === 1 ? styles.pageVisible : styles.pageHidden}`} data-page="1">
          {memberList.map((member, i) => (
            <div className={styles.groupMemberRow} key={member.name}>
              <span className={styles.groupMemberAvatar}>{member.avatar}</span>
              <span className={styles.groupMemberName}>{member.name}</span>
              <span className={member.role === 'OWNER' ? styles.roleOwner : member.role === 'ADMIN' ? styles.roleAdmin : styles.roleMember}>
                {roleLabels[member.role]}
              </span>
            </div>
          ))}
          <div className={styles.groupPagination}>{t('home.teamFeature.groupDetail.pagination', { page: 1 })}</div>
        </div>
        {memberListPage2?.length ? (
          <div className={`${styles.groupMemberPage} ${styles.pageSlideIn} ${page >= 2 ? styles.pageVisible : styles.pageHidden}`} data-page="2">
            {memberListPage2.map((member, i) => (
              <div className={styles.groupMemberRow} key={member.name}>
                <span className={styles.groupMemberAvatar}>{member.avatar}</span>
                <span className={styles.groupMemberName}>{member.name}</span>
                <span className={member.role === 'OWNER' ? styles.roleOwner : member.role === 'ADMIN' ? styles.roleAdmin : styles.roleMember}>
                  {roleLabels[member.role]}
                </span>
              </div>
            ))}
            <div className={styles.groupPagination}>{t('home.teamFeature.groupDetail.pagination', { page: 2 })}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Home() {
  const { t } = useTranslation('shell');

  // 装饰性玻璃螺旋背景带覆盖范围：AI 助手 → 常见问题（连续贯通，不被模块边界截断）
  const aiSectionRef = useRef<HTMLElement>(null);
  const faqSectionRef = useRef<HTMLElement>(null);

  const products = [
    {
      kind: 'note' as const,
      title: t('home.aiFeature.products.0.title'),
      text: t('home.aiFeature.products.0.text'),
    },
    {
      kind: 'chart' as const,
      title: t('home.aiFeature.products.1.title'),
      text: t('home.aiFeature.products.1.text'),
    },
    {
      kind: 'text' as const,
      title: t('home.aiFeature.products.2.title'),
      text: t('home.aiFeature.products.2.text'),
    },
  ];

  const outlineItems = [
    t('home.aiFeature.outline.0'),
    t('home.aiFeature.outline.1'),
    t('home.aiFeature.outline.2'),
    t('home.aiFeature.outline.3'),
  ];

  const formats = t('home.knowledgeFeature.formats', { returnObjects: true }) as string[];

  const files: { ext: string; name: string; meta: string; count?: number }[] = [
    {
      ext: 'PDF',
      name: t('home.knowledgeFeature.files.0.name'),
      meta: t('home.knowledgeFeature.files.0.meta'),
      count: 84,
    },
    {
      ext: 'Html',
      name: t('home.knowledgeFeature.files.1.name'),
      meta: t('home.knowledgeFeature.files.1.meta'),
    },
    {
      ext: 'DOC',
      name: t('home.knowledgeFeature.files.2.name'),
      meta: t('home.knowledgeFeature.files.2.meta'),
      count: 24,
    },
  ];

  const sources = t('home.knowledgeFeature.sources', { returnObjects: true }) as string[];

  const teamTags = t('home.teamFeature.tags', { returnObjects: true }) as string[];

  const scenes = [
    {
      num: t('home.scenes.items.0.num'),
      title: t('home.scenes.items.0.title'),
      text: t('home.scenes.items.0.text'),
    },
    {
      num: t('home.scenes.items.1.num'),
      title: t('home.scenes.items.1.title'),
      text: t('home.scenes.items.1.text'),
    },
    {
      num: t('home.scenes.items.2.num'),
      title: t('home.scenes.items.2.title'),
      text: t('home.scenes.items.2.text'),
    },
  ];

  const faqs = [
    { q: t('home.faq.items.0.q'), a: t('home.faq.items.0.a') },
    { q: t('home.faq.items.1.q'), a: t('home.faq.items.1.a') },
    { q: t('home.faq.items.2.q'), a: t('home.faq.items.2.a') },
    { q: t('home.faq.items.3.q'), a: t('home.faq.items.3.a') },
    { q: t('home.faq.items.4.q'), a: t('home.faq.items.4.a') },
  ];

  const manifestoWords = t('home.manifesto.words', { returnObjects: true }) as string[];

  // 宣言三步渐进动效：进入视口后依次推进 idle→active→done
  const [threeStage, setThreeStage] = useState(0);
  const manifestoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = manifestoRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    let timer: ReturnType<typeof setTimeout>;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        // 每步间隔 800ms 推进
        [800, 1600, 2400].forEach((delay, step) => {
          timer = setTimeout(() => setThreeStage(step + 1), delay);
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const stageOf = (i: number): 'idle' | 'active' | 'done' => {
    // 第 s 步时：前 s 项完成、当前项激活、其余待触达
    if (threeStage > i) return 'done';
    if (threeStage === i) return 'active';
    return 'idle';
  };

  const connectorStage = (i: number): 'idle' | 'half' | 'done' => {
    // 第 i 条连接线（位于 item i-1 与 item i 之间）
    if (threeStage >= i + 1) return 'done';
    if (threeStage >= i) return 'half';
    return 'idle';
  };

  return (
    <main className={styles.page}>
      {/* 装饰性磨砂玻璃螺旋背景带（AI → FAQ 连续贯通，纯装饰不拦截交互） */}
      <GlassBackdrop fromRef={aiSectionRef} toRef={faqSectionRef} />
      {/* ── 首屏 ── */}
      <section className={styles.hero} id="top">
        <Reveal className={styles.heroCopy}>
          <div className={styles.eyebrow}>
            <i /> {t('home.hero.eyebrow')}
          </div>
          <h1>
            {t('home.hero.titleA')}
            <br />
            <em>{t('home.hero.titleB')}</em>
          </h1>
          <p>{t('home.hero.lead')}</p>
          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.buttonPrimary}
              onClick={() => openPortalLink(REGISTER_URL)}
            >
              {t('home.hero.webCta')} <span aria-hidden="true">↗</span>
            </button>
          </div>
        </Reveal>

        <Reveal className={styles.heroVisual} delay={120}>
          <div className={styles.orbOne} />
          <div className={styles.orbTwo} />
          <div className={styles.appWindow} data-demo="hero" data-step="0">
            <div className={styles.appWindowInner}>
              <div className={styles.appBar}>
                <div className={styles.miniBrand}>
                  <BrandMark />
                  <b>WisePen</b>
                </div>
                <div className={styles.windowSearch}>
                  {t('home.hero.searchPlaceholder')} <span>⌘ K</span>
                </div>
                <div className={styles.avatar}>W</div>
              </div>
              <HeroChat />
            </div>
            <div className={styles.tagLeft}>
              <span>✦</span>
              <b>
                <Trans ns="shell" i18nKey="home.hero.tagLeft">
                  <RollingNumber base={8} interval={2200} />
                </Trans>
              </b>
            </div>
          </div>
          <div className={styles.tagRight}>
            <i /> {t('home.hero.tagRight')}
          </div>
        </Reveal>
        <DemoPlayer target="hero" steps={[1800, 2500, 2600]} startDelay={650} repeatDelay={6000} fadeOut={260} />
        <div className={styles.scrollNote}>
          <span /> {t('home.hero.scrollNote')}
        </div>
      </section>

      {/* ── 品牌宣言 ── */}
      <section className={styles.manifesto}>
        <Reveal>
          <p className={styles.sectionKicker}>{t('home.manifesto.kicker')}</p>
          <h2>
            {t('home.manifesto.titleA')}
            <br />
            {t('home.manifesto.titleB')}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className={styles.manifestoBottom}>
            <p>{t('home.manifesto.body')}</p>
            <div className={styles.threeWords} ref={manifestoRef}>
              {manifestoWords.map((word, i) => (
                <Fragment key={word}>
                  {i > 0 && (
                    <span
                      className={styles.stepConnector}
                      data-state={connectorStage(i)}
                    />
                  )}
                  <span className={styles.stepItem} data-state={stageOf(i)}>
                    <b
                      className={`${styles.stepCircle} ${
                        stageOf(i) === 'done' ? styles.done : stageOf(i) === 'active' ? styles.active : ''
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </b>
                    <span
                      className={`${styles.stepLabel} ${
                        stageOf(i) === 'done' ? styles.done : stageOf(i) === 'active' ? styles.active : ''
                      }`}
                    >
                      {word}
                    </span>
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 特性 01 · AI 助手 ── */}
      <section className={styles.featureSection} id="ai" ref={aiSectionRef}>
        <div className={styles.featureGrid}>
          <Reveal className={styles.featureCopy}>
            <div className={styles.sectionNumber}>
              <span>01</span> {t('home.aiFeature.section')}
            </div>
            <h2>
              {t('home.aiFeature.titleA')}
              <br />
              {t('home.aiFeature.titleB')}
            </h2>
          </Reveal>

          <Reveal className={styles.aiDemo} delay={120} data-demo="ai" data-step="0" data-layout="imageLeft">
            <AgentEditorDemo />
          </Reveal>

          <DemoPlayer target="ai" steps={[2000, 2800, 2200]} startDelay={650} repeatDelay={6500} fadeOut={260} />

          <div className={styles.productStrip}>
            {products.map((item) => (
              <div className={styles.productCard} key={item.title}>
                <span className={styles.productIcon}>
                  <ProductIcon kind={item.kind} />
                </span>
                <div>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 特性 02 · 个人知识库 ── */}
      <section className={styles.featureSectionKnowledge} id="knowledge">
        <div className={styles.featureGridReverse}>
          <Reveal className={styles.knowledgeDemo} delay={120} data-demo="knowledge" data-step="0" data-layout="imageRight">
            <ScatteredFiles />
            <FavoritesDemo />
          </Reveal>

          <DemoPlayer target="knowledge" steps={[2500, 2000, 1500]} startDelay={650} repeatDelay={7000} fadeOut={260} />

          <Reveal className={styles.featureCopy}>
            <div className={styles.sectionNumber}>
              <span>02</span> {t('home.knowledgeFeature.section')}
            </div>
            <h2>
              {t('home.knowledgeFeature.titleA')}
              <br />
              {t('home.knowledgeFeature.titleB1')}
              <wbr />
              {t('home.knowledgeFeature.titleB2')}
            </h2>
            <p>{t('home.knowledgeFeature.lead')}</p>
            <div className={styles.formatRow}>
              {formats.map((format) => {
                const fmt = format.toLowerCase();
                return (
                  <span className={styles.formatItem} data-format={fmt} key={format}>
                    <i>
                      <FormatIcon kind={fmt} />
                    </i>
                    {format}
                  </span>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 特性 03 · 团队空间 ── */}
      <section className={styles.featureSectionTeam} id="team">
        <div className={styles.featureGrid}>
          <Reveal className={styles.featureCopy}>
            <div className={styles.sectionNumber}>
              <span>03</span> {t('home.teamFeature.section')}
            </div>
            <h2>
              {t('home.teamFeature.titleA')}
              <br />
              {t('home.teamFeature.titleB')}
            </h2>
            <p>{t('home.teamFeature.lead')}</p>
            <div className={styles.teamFeatures}>
              {teamTags.map((tag, i) => {
                const iconMap = [
                  UserCog,
                  GraduationCap,
                  Users,
                ];
                const Icon = iconMap[i] ?? UserCog;
                return (
                  <span key={tag} className={styles.teamFeatureChip} style={{ '--i': i } as CSSProperties}>
                    <Icon size={13} strokeWidth={2.2} />
                    {tag}
                  </span>
                );
              })}
            </div>
          </Reveal>

          <Reveal className={styles.teamDemo} delay={120} data-demo="team" data-step="0" data-layout="imageLeft">
            <GroupDetailDemo />
          </Reveal>

          <DemoPlayer target="team" steps={[2800, 2200, 1800]} startDelay={650} repeatDelay={7500} fadeOut={260} />
        </div>
      </section>

      {/* ── 师生使用场景 ── */}
      <section className={styles.scenes} id="scenes">
        <Reveal className={styles.sceneHead}>
          <div>
            <p className={styles.sectionKicker}>{t('home.scenes.kicker')}</p>
            <h2>
              {t('home.scenes.titleA')}
              <wbr />
              {t('home.scenes.titleB')}
            </h2>
          </div>
        </Reveal>
        <div className={styles.sceneList}>
          {scenes.map((item, i) => (
            <Reveal key={item.num} delay={i * 80}>
              <article>
                <span>{item.num}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 常见问题 ── */}
      <section className={styles.faq} id="faq" ref={faqSectionRef}>
        <Reveal className={styles.faqHead}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionKicker}>{t('home.faq.kicker')}</p>
            <h2>{t('home.faq.title')}</h2>
          </div>
        </Reveal>
        <div className={styles.faqList}>
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <details>
                <summary>
                  {item.q}
                  <span className={styles.faqMark} aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 注册入口 ── */}
      <section className={styles.registerCta} id="start">
        <div className={styles.finalOrbOne} />
        <div className={styles.finalOrbTwo} />
        <div className={styles.registerContent}>
          <BrandMark />
          <p>{t('home.cta.kicker')}</p>
          <h2>
            {t('home.cta.titleA')}
            <br />
            {t('home.cta.titleB')}
          </h2>
          <p className={styles.registerSub}>{t('home.cta.sub')}</p>
          <button
            type="button"
            className={styles.buttonLime}
            onClick={() => openPortalLink(REGISTER_URL)}
          >
            {t('home.cta.button')} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;
