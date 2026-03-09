import { RotateCcw } from 'lucide-react';
import { useCardStore } from '../store/useCardStore';

export function Header() {
  const { reset } = useCardStore();

  const handleReset = () => {
    if (confirm('确定要重置所有内容吗？此操作不可撤销。')) {
      reset();
    }
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo">✦</div>
        <span className="header-title">流光卡片</span>
        <span className="header-subtitle">本地版</span>
      </div>
      <div className="header-actions">
        <button className="header-btn" onClick={handleReset} title="重置全部">
          <RotateCcw size={14} />
          <span>重置</span>
        </button>
      </div>
    </header>
  );
}
