import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';

function Input() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [noOptionText, setNoOptionText] = useState("Please enter a character name");
    const animatedComponents = makeAnimated();
    const [inputValue, setInputValue] = useState("");
    const [typingTimer, setTypingTimer] = useState(null);
    const [cache, setCache] = useState({});

    const selectRef = useRef()

    const fetchData = async (inputValue) => {
        try {
            if (cache[inputValue]) {
                return cache[inputValue];
            } else {
                const response = await axios.get(`${BASE_URL}?name=${inputValue}`);
                const results = response.data.results;
                setCache({ ...cache, [inputValue]: results });
                localStorage.setItem("cache", JSON.stringify({ ...cache, [inputValue]: results }))
                return results;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    };

    // useEffect(() => {
    //     console.log(selectRef.current)


    //     document.addEventListener("keydown", handleKeyDown);
    //     document.addEventListener("keyup", handleKeyUp);
    //     return () => {
    //         document.removeEventListener("keydown", handleKeyDown);
    //         document.removeEventListener("keyup", handleKeyUp);
    //     };
    // }, [typingTimer]);

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
            console.log("object")
            setNoOptionText("Loading...");
            const results = await fetchData(inputValue);

            if (results && results.length > 0) {
                let values = []
                results.map((data, key) => values.push(
                    {
                        label: `${data.name}`,
                        value: `${convertLink(data.name)}`,
                        image: `${data.image}`
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

    const formatOptionLabel = ({ value, label, image }) => (
        <div style={{ display: "flex" }}>
            <div>{label}</div>
            <div style={{ marginLeft: "10px", color: "#ccc" }}>
                <img src={image} alt="" />
            </div>
        </div>
    );

    return (
        <div className='multi-search-area'>
            <div onKeyUp={handleKeyUp}>
                <AsyncSelect
                    ref={selectRef}
                    cacheOptions
                    defaultOptions
                    formatOptionLabel={formatOptionLabel}
                    components={animatedComponents}
                    placeholder="Please enter a character name"
                    loadOptions={loadOptions}
                    noOptionsMessage={() => noOptionText}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
}

export default Input;
