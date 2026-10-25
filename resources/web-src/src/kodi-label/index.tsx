import React from 'react';
import { Label } from 'semantic-ui-react';

const tagRegexp = /\[(\/?)(COLOR|B|I)(?: ([^\]]+))?\]/gi;

// Kodi colors are names ("red") or AARRGGBB hex values
const cssColor = (color: string) => (/^[0-9a-f]{8}$/i.test(color) ? `#${color.slice(2)}` : color);

export const stripKodiTags = (text = ''): string => text.replace(tagRegexp, '');

interface Node {
  tag: string;
  color?: string;
  children: React.ReactNode[];
}

const wrap = (node: Node, key: number): React.ReactNode => {
  switch (node.tag) {
    case 'B':
      return <b key={key}>{node.children}</b>;
    case 'I':
      return <i key={key}>{node.children}</i>;
    default:
      return (
        <span key={key} style={{ color: node.color && cssColor(node.color) }}>
          {node.children}
        </span>
      );
  }
};

// Renders Kodi label formatting: [COLOR ...]...[/COLOR], [B]...[/B], [I]...[/I]
export const KodiLabel = ({ text = '' }: { text?: string }): JSX.Element => {
  const stack: Node[] = [{ tag: '', children: [] }];
  let key = 0;
  let last = 0;

  for (const match of text.matchAll(tagRegexp)) {
    const [whole, closing, tag, color] = match;
    stack[stack.length - 1].children.push(text.slice(last, match.index));
    last = match.index + whole.length;

    if (!closing) {
      stack.push({ tag: tag.toUpperCase(), color, children: [] });
    } else if (stack.length > 1 && stack[stack.length - 1].tag === tag.toUpperCase()) {
      const node = stack.pop()!;
      stack[stack.length - 1].children.push(wrap(node, key++));
    }
  }
  stack[stack.length - 1].children.push(text.slice(last));

  // Labels with unclosed tags are shown as Kodi does, till the end of the text
  while (stack.length > 1) {
    const node = stack.pop()!;
    stack[stack.length - 1].children.push(wrap(node, key++));
  }
  return <>{stack[0].children}</>;
};

// Provider as a tag in its Kodi color, text is black or white, whichever is readable on it
export const ProviderTag = ({ text = '' }: { text?: string }): JSX.Element | null => {
  if (!text) return null;

  const color = /\[COLOR ([^\]]+)\]/i.exec(text)?.[1];
  let style: React.CSSProperties | undefined;
  if (color) {
    const probe = document.createElement('span');
    probe.style.color = cssColor(color);
    document.body.appendChild(probe);
    const [r, g, b] = getComputedStyle(probe).color.match(/\d+/g)!.map(Number);
    probe.remove();
    style = { backgroundColor: cssColor(color), color: r * 0.299 + g * 0.587 + b * 0.114 > 150 ? '#000' : '#fff' };
  }

  return (
    <Label size="small" style={style} className="provider-tag">
      {stripKodiTags(text)}
    </Label>
  );
};

// Provider logo, hidden if it is not available, like for Kodi on another machine
export const ProviderIcon = ({ icon }: { icon?: string }): JSX.Element | null =>
  icon ? (
    <img
      className="provider-icon"
      src={icon}
      alt=""
      onError={(e) => {
        e.currentTarget.style.visibility = 'hidden';
      }}
    />
  ) : null;
