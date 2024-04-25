import React from 'react'

function Input() {
    return (
        <>
            <div className='multi-search-area'>
                <ul className='search-items'>
                    <li className='active-element'>
                        Rick
                    </li>
                    <li className='active-element'>
                        Morty
                    </li>
                    <li>
                        <input type="text" />
                    </li>
                </ul>


            </div>
        </>
    )
}

export default Input
