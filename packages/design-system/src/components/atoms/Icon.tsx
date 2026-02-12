import type { CSSProperties, ImgHTMLAttributes } from 'react';
import { getIconAsset, type IconName } from '../../assets/icons';

type IconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  name: IconName;
  size?: number | string;
  alt?: string;
};

const wrapperStyle: CSSProperties = {
  display: 'inline-flex',
  lineHeight: 0,
  flexShrink: 0,
};

export const Icon = ({ name, size = 16, alt = '', style, ...props }: IconProps) => (
  <span style={wrapperStyle}>
    <img
      src={getIconAsset(name)}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain', ...style }}
      {...props}
    />
  </span>
);
