import { forwardRef, type CSSProperties, type FocusEvent } from 'react';
import type { CardPage, CardStyle } from '../types';
import { FONT_SIZES } from '../types';

interface CardPreviewProps {
  page: CardPage;
  style: CardStyle;
  isEditing?: boolean;
  onUpdatePage?: (partial: Partial<CardPage>) => void;
}

function getTextColor(templateId: string): string {
  if (templateId === 'wenkai') return '#006400'; // Dark green
  if (templateId === 'memo') return '#2d2d2d';
  if (templateId === 'sunset' || templateId === 'aurora') return '#1a1a1a';
  return '#ffffff';
}

function getSubtextColor(templateId: string): string {
  if (templateId === 'wenkai') return 'rgba(0,100,0,0.6)';
  if (templateId === 'memo') return 'rgba(45,45,45,0.6)';
  if (templateId === 'sunset' || templateId === 'aurora') return 'rgba(26,26,26,0.6)';
  return 'rgba(255,255,255,0.65)';
}

function getAccentColor(templateId: string): string {
  const accents: Record<string, string> = {
    default: 'rgba(255,255,255,0.25)',
    quote: 'rgba(100,149,237,0.4)',
    memo: 'rgba(180,90,50,0.2)',
    night: 'rgba(138,43,226,0.3)',
    aurora: 'rgba(255,255,255,0.2)',
    sunset: 'rgba(255,255,255,0.3)',
    wenkai: 'rgba(0,100,0,0.15)',
  };
  return accents[templateId] ?? 'rgba(255,255,255,0.2)';
}

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ page, style, isEditing = false, onUpdatePage }, ref) => {
    const textColor = getTextColor(style.templateId);
    const subtextColor = getSubtextColor(style.templateId);
    const accentColor = getAccentColor(style.templateId);

    const handleBlur = (field: keyof CardPage) => (e: FocusEvent<HTMLElement>) => {
      if (onUpdatePage) {
        onUpdatePage({ [field]: e.currentTarget.innerText });
      }
    };

    const containerStyle: CSSProperties = {
      width: '100%',
      minHeight: 480, // Minimum fixed height for better screen proportion
      background: style.background,
      borderRadius: style.borderRadius,
      padding: `${style.paddingY}px ${style.paddingX}px`,
      fontFamily: style.templateId === 'wenkai' ? "'LXGW WenKai', sans-serif" : "'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif",
      color: textColor,
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    };

    const isQuote = style.templateId === 'quote';
    const isNight = style.templateId === 'night';
    const isMemo = style.templateId === 'memo';
    const isWenkai = style.templateId === 'wenkai';

    const editProps = (field: keyof CardPage) => ({
      contentEditable: isEditing,
      suppressContentEditableWarning: true as const,
      onBlur: handleBlur(field),
    });

    return (
      <div ref={ref} style={containerStyle} className="card-preview-root">
        {/* Quote circle glow */}
        {isQuote && (
          <div style={{
            position: 'absolute', top: -20, right: -20,
            width: 160, height: 160, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100,149,237,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        )}

        {/* Night glow orbs */}
        {isNight && (
          <>
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(138,43,226,0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: -40, left: -40,
              width: 150, height: 150, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(75,0,130,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
          </>
        )}

        {/* Large quote mark */}
        {isQuote && (
          <div style={{
            position: 'absolute', top: 16, left: 24,
            fontSize: '120px', lineHeight: '1',
            color: 'rgba(255,255,255,0.08)',
            fontFamily: 'Georgia, serif',
            pointerEvents: 'none', userSelect: 'none',
          }}>"</div>
        )}

        {/* Memo ruled lines */}
        {isMemo && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(180,90,50,0.1) 27px, rgba(180,90,50,0.1) 28px)',
            backgroundPositionY: '56px',
            pointerEvents: 'none',
            borderRadius: style.borderRadius,
          }} />
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          {style.showIcon && (
            <div
              {...editProps('icon')}
              style={{
                fontSize: 24, lineHeight: '1', cursor: isEditing ? 'text' : 'default',
                outline: 'none', minWidth: 28, marginRight: 10,
                opacity: isWenkai ? 0.3 : 1, filter: isWenkai ? 'grayscale(100%)' : 'none'
              }}
            >
              {page.icon}
            </div>
          )}
          {style.showDate && (
            <div
              {...editProps('date')}
              style={{ fontSize: FONT_SIZES.sm, color: subtextColor, letterSpacing: '0.03em', cursor: isEditing ? 'text' : 'default', outline: 'none' }}
            >
              {page.date}
            </div>
          )}
        </div>

        {/* Quote accent bar */}
        {isQuote && (
          <div style={{ width: 40, height: 3, background: accentColor, borderRadius: 2, marginBottom: 24 }} />
        )}

        {/* Body spacer (for vertical centering on wenkai) */}
        {isWenkai && <div style={{ flex: 1 }} />}

        {/* Title */}
        {page.title.trim() && (
          <div
            {...editProps('title')}
            style={{
              fontSize: FONT_SIZES[style.titleSize],
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: isWenkai ? 16 : 12,
              letterSpacing: isQuote ? '-0.02em' : '0',
              color: textColor,
              cursor: isEditing ? 'text' : 'default',
              outline: 'none',
              display: style.titleSize === 'xs' ? 'none' : 'block',
            }}
          >
            {page.title}
          </div>
        )}

        {/* Body */}
        <div
          {...editProps('body')}
          style={{
            fontSize: FONT_SIZES[style.bodySize],
            lineHeight: style.lineHeight,
            textAlign: style.bodyAlign,
            color: isQuote ? 'rgba(255,255,255,0.82)' : textColor,
            cursor: isEditing ? 'text' : 'default',
            outline: 'none',
            minHeight: 60,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {page.body}
        </div>

        {/* Body spacer (for vertical centering on wenkai) */}
        {isWenkai && <div style={{ flex: 1 }} />}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: isWenkai ? 'auto' : 24, paddingTop: 16,
          borderTop: isWenkai ? 'none' : `1px solid ${accentColor}`,
        }}>
          <div>
            {style.showAuthor && (
              <div
                {...editProps('author')}
                style={{
                  fontSize: FONT_SIZES.sm,
                  color: subtextColor,
                  fontStyle: 'italic',
                  cursor: isEditing ? 'text' : 'default',
                  outline: 'none',
                  minWidth: 40,
                  opacity: page.author ? 1 : 0.4,
                }}
              >
                {page.author || (isEditing ? '作者' : '—')}
              </div>
            )}
            {style.showWatermark && (
              <div style={{
                fontSize: FONT_SIZES.xs,
                color: isWenkai ? 'rgba(0,100,0,0.3)' : subtextColor,
                opacity: isWenkai ? 1 : 0.4,
                marginTop: style.showAuthor ? 2 : 0,
                letterSpacing: '0.05em',
              }}>
                TypoArt
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CardPreview.displayName = 'CardPreview';
