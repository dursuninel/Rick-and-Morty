import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';

function Select({ listValues, setListValues }) {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [noOptionText, setNoOptionText] = useState("Please enter a character name");
    const animatedComponents = makeAnimated();
    const [inputValue, setInputValue] = useState("");
    const [typingTimer, setTypingTimer] = useState(null);
    const [cache, setCache] = useState(sessionStorage.getItem("cache") ? JSON.parse(sessionStorage.getItem("cache")) : {});


    const selectRef = useRef()

    const fetchData = async (inputValue) => {
        try {
            if (cache[inputValue]) {
                return cache[inputValue];
            } else {
                const response = await axios.get(`${BASE_URL}?name=${inputValue}`);
                const results = response.data.results;
                setCache({ ...cache, [inputValue]: results });
                sessionStorage.setItem("cache", JSON.stringify({ ...cache, [inputValue]: results }))
                return results;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    };

    const handleKeyDown = () => {
        clearTimeout(typingTimer);
    };

    const handleKeyUp = (event) => {
        clearTimeout(typingTimer);
        const value = event.target.value.trim();
        if (value === "") {
            setNoOptionText("Please enter a character name");
        } else {
            setNoOptionText("Loading...");
            setTypingTimer(setTimeout(() => {
                fetchData(value).then((results) => {
                    setNoOptionText(results.length ? "No options" : "No matching options found");
                });
            }, 1000)); // 1 saniye bekleme süresi
        }
    };

    const convertLink = (text) => {
        return text.toLowerCase().replace(/\s+/g, '-');
    };

    const loadOptions = async (inputValue, callback) => {
        setInputValue(inputValue.trim());

        if (inputValue.trim() === "") {
            setNoOptionText("Please enter a character name");
            callback([]);
        } else {
            setNoOptionText("Loading...");
            const results = await fetchData(inputValue);

            if (results && results.length > 0) {
                let values = []
                results.map((data, key) => values.push(
                    {
                        id: `${data.id}`,
                        label: `${data.name}`,
                        value: `${convertLink(data.name)}`,
                        image: `${data.image}`,
                        episode: data.episode.length
                    }
                ))
                callback(values);
                return;

            } else {
                setNoOptionText(results.length ? "No options" : "No matching options found");
                return;
            }
        }
    };

    const formatOptionLabel = ({ value, label, image, episode }) => (
        <div className='opt_style'>
            <img src={image} alt="" />
            <div>
                <div className='opt_name'>
                    <p>{label}</p>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        setInputValue('')
        sessionStorage.setItem("list", JSON.stringify(listValues))
    }, [listValues]);

    return (
        <div onKeyUp={handleKeyUp}>
            <AsyncSelect
                ref={selectRef}
                value={inputValue || ''}
                cacheOptions
                defaultOptions
                formatOptionLabel={formatOptionLabel}
                components={animatedComponents}
                placeholder="Please enter a character name"
                loadOptions={loadOptions}
                noOptionsMessage={() => noOptionText}
                onKeyDown={handleKeyDown}
                onChange={(value) => setListValues([...listValues, value])}
            />
        </div>
    );
}

export default Select;
