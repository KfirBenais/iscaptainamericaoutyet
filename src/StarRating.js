import React from 'react';

const STAR_POINTS = "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26";

function Star({ fill, size, index }) {
  const gradId = `star-grad-${index}`;

  if (fill === 'half') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#f5a623" />
            <stop offset="50%" stopColor="#d4d4d4" />
          </linearGradient>
        </defs>
        <polygon
          points={STAR_POINTS}
          fill={`url(#${gradId})`}
          stroke="#f5a623"
          strokeWidth="0.5"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      aria-hidden="true"
    >
      <polygon
        points={STAR_POINTS}
        fill={fill === 'full' ? '#f5a623' : '#d4d4d4'}
        stroke="#f5a623"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function StarRating({ rating, size = 16 }) {
  const stars = Array.from({ length: 5 }).map((_, i) => {
    const position = i + 1;
    let fill = 'empty';
    if (rating >= position) {
      fill = 'full';
    } else if (rating >= position - 0.5) {
      fill = 'half';
    }
    return <Star key={i} fill={fill} size={size} index={i} />;
  });

  return <span className="star-rating">{stars}</span>;
}

export default StarRating;
