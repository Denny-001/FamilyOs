interface Props {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };

export const Avatar = ({ name, src, size = 'md' }: Props) => {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return src ? (
    <img
      src={src}
      alt={name}
      className={`${sizes[size]} rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${sizes[size]} rounded-full bg-primary-container text-onContainer font-semibold flex items-center justify-center`}
    >
      {initials}
    </div>
  );
};