import { TEMPLATES, PRESET_BACKGROUNDS } from '../data/templates';
import { useCardStore } from '../store/useCardStore';

export function SidebarLeft() {
  const { style, applyTemplate, updateStyle } = useCardStore();

  return (
    <div className="sidebar-left">
      <div className="sidebar-section">
        <div className="sidebar-label">模板</div>
        <div className="template-grid">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              className={`template-item ${style.templateId === template.id ? 'active' : ''}`}
              onClick={() => applyTemplate(template.id)}
              title={template.name}
            >
              <div
                className="template-thumb"
                style={{ background: template.preview }}
              >
                <div className="template-thumb-inner">
                  <div className="thumb-line thumb-title" />
                  <div className="thumb-line thumb-body" />
                  <div className="thumb-line thumb-body" />
                </div>
              </div>
              <span className="template-name">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">背景预设</div>
        <div className="bg-grid">
          {PRESET_BACKGROUNDS.map((bg) => (
            <button
              key={bg.value}
              className={`bg-swatch ${style.background === bg.value ? 'active' : ''}`}
              style={{ background: bg.value }}
              onClick={() => updateStyle({ background: bg.value })}
              title={bg.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
