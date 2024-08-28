import {ReactNode} from 'react';

const FullscreenLayout = ({children}: {children: ReactNode}) => {
  return <main className="w-full h-full">{children}</main>;
};

export default FullscreenLayout;
