import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';

function Input() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const [noOptionText, setNoOptionText] = useState("Please enter character name");
    // const [searchItems, setSearchItems] = useState(localStorage.getItem('searchItems') ? JSON.parse(localStorage.getItem('searchItems')) : []);
    const animatedComponents = makeAnimated();

    const [cache, setCache] = useState([]);
    const [pending, setPending] = useState(false);
    let pendingSecond = 1000;
    // {
    //     label : "",
    //     link : "",
    //     result : []    
    // } Formatında veri gelecek

    // function convertLink(text) {
    //     return text.toLowerCase().replace(/\s+/g, '-');
    // }

    const options = [
        // { value: 'chocolate', label: 'Chocolate' },
        // { value: 'strawberry', label: 'Strawberry' },
        // { value: 'vanilla', label: 'Vanilla' }
    ]

    // useEffect(() => {
    //     console.log(BASE_URL)
    // }, []);
    let typingTimer;
    const typingInterval = 1000; // 1 saniye

    // Kullanıcı yazmaya başladığında zamanlayıcıyı başlat
    function startTypingTimer() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            // Yazma süresinde değişiklik olmadı, kullanıcı yazmayı bitirdi
            onTypingFinished();
        }, typingInterval);
    }

    function resetTypingTimer() {
        clearTimeout(typingTimer);
        startTypingTimer();
    }

    let changeFunction = (event) => {
        resetTypingTimer();
        setTimeout(async () => {
            let val = event.target.value;
            val === "" ? setNoOptionText("Please enter character name") : setNoOptionText("No options")
        }, 10);
    }
    async function onTypingFinished(inputValue) {
        let results = (await axios.get(BASE_URL + "?", `name=${inputValue}`)).data.results;
        return results;
    }
    const promiseOptions = (inputValue) =>
        new Promise(async (resolve) => {
            // resolve();
            if (inputValue !== "") {
                if (pending === false) {
                    // console.log(BASE_URL + `?name=${inputValue}`)
                    let results = await onTypingFinished(inputValue);
                    console.log(results)
                    resolve([])
                    // setPending(true);
                    // setTimeout(() => {
                    //     setPending(false);
                    // }, pendingSecond);
                }

            }
            else {
                resolve([]);
            }

            // if (results != []) {

            // }
        });
    return (
        <>
            <div className='multi-search-area'>
                {/* <Select options={options} isMulti closeMenuOnSelect={true}
                    components={animatedComponents}
                    placeholder="Please enter character name"
                    noOptionsMessage={() => noOptionText}
                    // onInputChange={}
                    onKeyDown={(event) => changeFunction(event)}
                /> */}
                <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    components={animatedComponents}
                    placeholder="Please enter character name"
                    loadOptions={promiseOptions}
                    noOptionsMessage={() => noOptionText}
                    onKeyDown={(event) => changeFunction(event)}
                />
            </div>
        </>
    );
}

export default Input;
