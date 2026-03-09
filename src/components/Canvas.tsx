import { useRef, useState } from 'react';
import { Plus, Trash2, Download, Copy, Check } from 'lucide-react';
import { useCardStore } from '../store/useCardStore';
import { CardPreview } from './CardPreview';
import { exportToPng, copyToClipboard, exportAllToZip } from '../utils/exportImage';

export function Canvas() {
  const {
    pages, currentPageIndex, style,
    addPage, removePage, setCurrentPage, updatePage,
  } = useCardStore();

  const cardRef = useRef<HTMLDivElement>(null);
  const hiddenCardsRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [copying, setCopying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);

  const currentPage = pages[currentPageIndex];

  const handleExport = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      await exportToPng({ element: cardRef.current, filename: 'kapian' });
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async () => {
    if (!cardRef.current) return;
    setCopying(true);
    try {
      await copyToClipboard(cardRef.current);
      setTimeout(() => setCopying(false), 2000);
    } catch {
      setCopying(false);
    }
  };

  const handleExportAll = async () => {
    if (!hiddenCardsRef.current || pages.length === 0) return;
    setExportingAll(true);
    try {
      const elements = Array.from(hiddenCardsRef.current.children) as HTMLElement[];
      await exportAllToZip(elements, 'kapian-card');
    } finally {
      setExportingAll(false);
    }
  };

  return (
    <div className="canvas-area">
      {/* Toolbar */}
      <div className="canvas-toolbar">
        <div className="toolbar-left">
          <span className="toolbar-info">卡片 {currentPageIndex + 1} / {pages.length}</span>
        </div>
        <div className="toolbar-right">
          <button className="toolbar-btn ghost" onClick={handleCopy} title="复制图片" disabled={copying || downloading || exportingAll}>
            {copying ? <Check size={16} /> : <Copy size={16} />}
            <span>{copying ? '已复制' : '复制图片'}</span>
          </button>
          
          {pages.length > 1 && (
            <button className="toolbar-btn ghost" onClick={handleExportAll} title="打包导出全部卡片" disabled={copying || downloading || exportingAll}>
              {exportingAll ? <div className="spinner" style={{ borderColor: 'rgba(124,111,205,0.3)', borderTopColor: '#7c6fcd' }} /> : <Download size={16} />}
              <span>导出全部 ({pages.length})</span>
            </button>
          )}

          <button className="toolbar-btn primary" onClick={handleExport} title="导出当前卡片" disabled={copying || downloading || exportingAll}>
            {downloading ? <div className="spinner" /> : <Download size={16} />}
            <span>导出单张</span>
          </button>
        </div>
      </div>

      {/* Canvas bg */}
      <div className="canvas-bg">
        <div
          className="canvas-scale-wrapper"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          {/* The actual card to export */}
          <div className="card-container" style={{ width: style.width }}>
            <CardPreview
              ref={cardRef}
              page={currentPage}
              style={style}
              isEditing
              onUpdatePage={(partial) => updatePage(currentPage.id, partial)}
            />
          </div>
        </div>
      </div>

      {/* Zoom control */}
      <div className="canvas-zoom">
        <button className="zoom-btn" onClick={() => setScale(s => Math.max(0.4, s - 0.1))}>−</button>
        <span className="zoom-label">{Math.round(scale * 100)}%</span>
        <button className="zoom-btn" onClick={() => setScale(s => Math.min(2, s + 0.1))}>+</button>
        <button className="zoom-btn zoom-reset" onClick={() => setScale(1)}>重置</button>
      </div>

      {/* Page tabs */}
      <div className="page-tabs">
        {pages.map((page, index) => (
          <div key={page.id} className="page-tab-wrapper">
            <button
              className={`page-tab ${index === currentPageIndex ? 'active' : ''}`}
              onClick={() => setCurrentPage(index)}
            >
              <span className="page-num">{index + 1}</span>
            </button>
            {pages.length > 1 && index === currentPageIndex && (
              <button
                className="page-del"
                onClick={() => removePage(page.id)}
                title="删除此页"
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>
        ))}
        <button className="add-page-btn" onClick={addPage} title="添加卡片">
          <Plus size={16} />
        </button>
      </div>

      {/* Hidden container to render all pages for ZIP export */}
      <div 
        ref={hiddenCardsRef} 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {pages.map((page) => (
          <div key={page.id} style={{ width: style.width }}>
            <CardPreview page={page} style={style} isEditing={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
