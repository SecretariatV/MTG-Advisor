import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ChatLoading = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/4ad8610e-4cd9-451e-b115-811dc64c1ab2/vie3FxHlBu.lottie"
      loop
      autoplay
      style={{ width: '120px', height: '120px', position: 'absolute', marginBottom: '30px' }} // Adjust size here
    />
  );
};

export default ChatLoading