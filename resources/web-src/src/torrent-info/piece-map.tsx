import React, { useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useResizeObserver } from 'use-resize-observer';
import { t } from '../i18n';

interface IPieceMapProps {
  pieces: string;
}

const PieceSize = 8;
const Margin = 1;
const FullSize = PieceSize + Margin;

const drawLegend = (context: CanvasRenderingContext2D, legendHeight: number) => {
  const y = context.canvas.height - legendHeight / 2;
  context.font = '12px sans-serif';
  const pieceSize = PieceSize * 1.3;

  // Translated labels differ in length, so each item starts after the previous one
  let x = 0;
  const drawLegendItem = (fillStyle: string, text: string) => {
    context.fillStyle = fillStyle;
    context.fillRect(x, y, pieceSize, pieceSize);

    context.fillStyle = 'black';
    context.fillText(text, x + PieceSize * 2, y + pieceSize);
    x += PieceSize * 2 + context.measureText(text).width + PieceSize * 3;
  };

  drawLegendItem('#4CAF50', `- ${t('pieceDone')}`);
  drawLegendItem('#ECEFF1', `- ${t('pieceQueued')}`);
  drawLegendItem('#F0B8B8', `- ${t('pieceNotSelected')}`);
};

const draw = (parentDiv: HTMLDivElement, context: CanvasRenderingContext2D, pieces: string) => {
  const parentWidth = parentDiv.clientWidth;
  const piecesPerLine = Math.floor(parentWidth / FullSize);
  const height = Math.ceil(pieces.length / piecesPerLine) * FullSize;
  const legendHeight = 30;

  const { canvas } = context;
  canvas.width = parentWidth;
  canvas.height = height + legendHeight;

  for (let i = 0; i < pieces.length; i += 1) {
    let pieceColor;

    switch (pieces[i]) {
      case '+':
        pieceColor = '#4CAF50';
        break;
      case '-':
        pieceColor = '#F0B8B8';
        break;
      default:
        pieceColor = '#ECEFF1';
        break;
    }

    context.fillStyle = pieceColor;
    context.fillRect(FullSize * (i % piecesPerLine), Math.floor(i / piecesPerLine) * FullSize, PieceSize, PieceSize);
  }

  drawLegend(context, legendHeight);
};

const PieceMap = ({ pieces }: IPieceMapProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentDivRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver<HTMLDivElement>({ ref: parentDivRef });
  const [debouncedWidth] = useDebounce(width, 100);

  useEffect(() => {
    if (!debouncedWidth) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const parentDiv = parentDivRef.current;
    if (!parentDiv) return;

    draw(parentDiv, context, pieces);
  }, [pieces, debouncedWidth]);

  return (
    <div ref={parentDivRef}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default PieceMap;
