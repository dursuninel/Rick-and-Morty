import React from 'react'

function ListItems({ data, delItem }) {
    return (
        <div className='list_item_style'>
            <img src={data.image} alt="" />
            <div className='list_in_infos'>
                <div className='list_name'>
                    <p>Name:</p> <span>{data.label}</span>
                </div>
                <div className='list_episode'>
                    <p>Episode:</p> <span>{data.episode}</span>
                </div>
            </div>
            <span className='delete_list_item' onClick={() => delItem({ id: data.id, value: data.value })}>
                <i className="fa-regular fa-trash"></i>
            </span>
        </div>
    )
}

export default ListItems
