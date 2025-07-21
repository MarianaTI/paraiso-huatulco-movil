import Image from 'next/image';
import React from 'react';

const OfflinePage = () => {
    return (
        <div className='offline-page-container'>
            <Image src="/empty-state.png" alt='empty-state-network' width={250} height={200}/>
            <h1 className='mt-5 offline-page-title'>Conexión requerida</h1>
            <span className='offline-page-description'>Para acceder a esta funcionalidad necesitas estar conectado a internet. Revisa tu red e inténtalo nuevamente.</span>
        </div>
    );
}

export default OfflinePage;
