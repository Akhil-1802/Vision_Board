import React from 'react';
import ContentLoader from 'react-content-loader';

const RowOfRectangleLoaders: React.FC<{
  count?: number;
  width?: number;
  height?: number;
  radius?: number;
  gap?: number;
}> = ({ count = 3, width = 288, height = 420, radius = 8, gap = 16 }) => {
  // Total SVG width includes rectangles + gaps between them
  const totalWidth = count * width + (count - 1) * gap;

  return (
    <ContentLoader
      speed={2}
      width={totalWidth}
      height={height}
      viewBox={`0 0 ${totalWidth} ${height}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {Array.from({ length: count }).map((_, index) => (
        <rect
          key={index}
          x={index * (width + gap)}
          y={0}
          rx={radius}
          ry={radius}
          width={width}
          height={height}
        />
      ))}
    </ContentLoader>
  );
};

export default RowOfRectangleLoaders;
