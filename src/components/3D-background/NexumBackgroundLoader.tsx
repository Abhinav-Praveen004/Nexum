'use client';

import dynamic from 'next/dynamic';

// Client-only: three.js/WebGL never runs on the server.
const NexumBackground = dynamic(() => import('./NexumBackground'), { ssr: false });

export default NexumBackground;
