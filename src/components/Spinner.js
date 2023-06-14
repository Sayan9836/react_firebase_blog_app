import React from 'react'
import { Vortex } from 'react-loader-spinner'

const Spinner = () => {
    return (

        <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperStyle={{ margin: '20% 40% 0 48%' }}
            wrapperClass="vortex-wrapper"
            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
        />
        
    )
}

export default Spinner
