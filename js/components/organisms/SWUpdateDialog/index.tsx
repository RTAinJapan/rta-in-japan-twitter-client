import React, { useState } from 'react';

export const SWUpdateDialog: React.FC<{ registration: ServiceWorkerRegistration }> = ({ registration }) => {
  const [show, setShow] = useState(!!registration.waiting);
  const style: React.CSSProperties = {
    width: '100%',
    background: 'white',
  };
  const handleUpdate = () => {
    if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    setShow(false);
    window.location.reload();
  };

  return show ? (
    <div style={style}>
      <span>更新があります</span>
      <button onClick={handleUpdate}>アップデート</button>
    </div>
  ) : (
    <></>
  );
};
