import { styled } from '@styles/stitches.config';
import Link from 'next/link';

const Wrapper = styled('div', {
  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
});

interface NextLinkProps {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const NextLink = ({ href, disabled, children }: NextLinkProps) => {
  return (
    <Wrapper disabled={disabled}>
      <Link href={href}>{children}</Link>
    </Wrapper>
  );
};

export default NextLink;
