import { useCardStore } from '../store/useCardStore';
import type { FontSize, TextAlign } from '../types';

function SliderRow({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="prop-row">
      <div className="prop-label">{label}</div>
      <div className="prop-control slider-control">
        <input
          type="range" min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="slider"
        />
        <span className="prop-value">{Math.round(value)}</span>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: {
  label: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="prop-row">
      <div className="prop-label">{label}</div>
      <button
        className={`toggle ${value ? 'on' : 'off'}`}
        onClick={() => onChange(!value)}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}

function SelectRow({ label, value, options, onChange }: {
  label: string; value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="prop-row">
      <div className="prop-label">{label}</div>
      <select
        className="prop-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

const FONT_SIZE_OPTIONS: { label: string; value: FontSize }[] = [
  { label: '超小', value: 'xs' },
  { label: '小', value: 'sm' },
  { label: '正常', value: 'base' },
  { label: '大', value: 'lg' },
  { label: '更大', value: 'xl' },
  { label: '2XL', value: '2xl' },
  { label: '3XL', value: '3xl' },
];

const TEXT_ALIGN_OPTIONS: { label: string; value: TextAlign }[] = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' },
];

export function SidebarRight() {
  const { style, updateStyle } = useCardStore();

  return (
    <div className="sidebar-right">
      <div className="sidebar-section">
        <div className="sidebar-section-title">显示 / 隐藏</div>
        <ToggleRow label="图标" value={style.showIcon} onChange={(v) => updateStyle({ showIcon: v })} />
        <ToggleRow label="日期" value={style.showDate} onChange={(v) => updateStyle({ showDate: v })} />
        <ToggleRow label="作者" value={style.showAuthor} onChange={(v) => updateStyle({ showAuthor: v })} />
        <ToggleRow label="水印" value={style.showWatermark} onChange={(v) => updateStyle({ showWatermark: v })} />
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">容器</div>
        <SliderRow label="内边距 X" value={style.paddingX} min={12} max={80} onChange={(v) => updateStyle({ paddingX: v })} />
        <SliderRow label="内边距 Y" value={style.paddingY} min={12} max={80} onChange={(v) => updateStyle({ paddingY: v })} />
        <SliderRow label="圆角" value={style.borderRadius} min={0} max={48} onChange={(v) => updateStyle({ borderRadius: v })} />
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">文字</div>
        <SelectRow
          label="标题大小"
          value={style.titleSize}
          options={FONT_SIZE_OPTIONS}
          onChange={(v) => updateStyle({ titleSize: v as FontSize })}
        />
        <SelectRow
          label="正文大小"
          value={style.bodySize}
          options={FONT_SIZE_OPTIONS}
          onChange={(v) => updateStyle({ bodySize: v as FontSize })}
        />
        <SelectRow
          label="对齐"
          value={style.bodyAlign}
          options={TEXT_ALIGN_OPTIONS}
          onChange={(v) => updateStyle({ bodyAlign: v as TextAlign })}
        />
        <SliderRow label="行高" value={style.lineHeight} min={1.2} max={3} step={0.1} onChange={(v) => updateStyle({ lineHeight: v })} />
      </div>
    </div>
  );
}
