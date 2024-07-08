import React, {useState} from 'react'
import Autosuggest from 'react-autosuggest';

const AutosuggestWrapper = ({ suggestions, onSuggestionSelected, placeholder }) => {
    const [value, setValue] = useState('');
    const [suggestionsArray, setSuggestionsArray] = useState([]);

    const getSuggestions = (inputValue) => {
        const inputValueLowerCase = inputValue.trim().toLowerCase();
        const inputLength = inputValueLowerCase.length;

        return inputLength === 0 || (suggestions.length && typeof suggestions[0] != "string") ?
            [] : suggestions.filter(suggestion =>
            suggestion.toLowerCase().slice(0, inputLength) === inputValueLowerCase
        );
    };

    const getSuggestionValue = (suggestion) => suggestion;

    const renderSuggestion = (suggestion) => (
        <div>
            {suggestion}
        </div>
    );

    const onChange = (event, { newValue }) => {
        setValue(newValue);
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestionsArray(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestionsArray([]);
    };

    const inputProps = {
        placeholder: placeholder || 'Type a suggestion',
        value,
        onChange: onChange
    };

    return (
        <Autosuggest
            suggestions={suggestionsArray}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={(event, { suggestion }) => {
                if (onSuggestionSelected) {
                    onSuggestionSelected(suggestion);
                }
            }}
        />
    );
};

export default AutosuggestWrapper