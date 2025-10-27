import React from 'react';

 
const Banner = (props: any) => {
    console.log('Banner Props:', props);
    return ( 
        <div className="bg-yellow-500">
            <p className="text-3xl text-blue-500">Olá, mundo! Teste 5</p>
        </div>
     );
}
 
export default Banner;